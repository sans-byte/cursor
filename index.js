import OpenAI from "openai";
import { exec } from "node:child_process";
import readline from "node:readline";
import Together from "together-ai";

const client = new Together();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askPrompt = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      return resolve(answer);
    });
  });
};

// const client = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost",
//     "X-Title": "Test Project",
//   },
// });

async function getWeatherInfo(city) {
  const response = await fetch(`https://wttr.in/${city}?format=%t`);
  const temperature = await response.text();
  return temperature;
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(`stdout : ${stdout} \n stderr : ${stderr}`);
    });
  });
}

const TOOLS_MAP = {
  getWeatherInfo,
  executeCommand,
};

const SYSTEMINSTRUCTIONS = `You are a helpful AI assistant designed to solve user queries using a structured reasoning process. 
      You follow the START → THINK → ACTION → OBSERVE → OUTPUT cycle for every query.
      Your operational flow:
      START: Receive and understand the user's query.
      THINK: Carefully reason through the query in multiple steps (at least 3-4 layers deep) to determine the best way to solve it.
      ACTION: If external tools or APIs are needed to resolve the query, invoke them by specifying the tool name and required input parameters.
      OBSERVE: Wait for the tool response. Analyze the results carefully.
      OUTPUT: Based on your reasoning and any observed results, generate a clear and accurate final answer. If needed, repeat the THINK → ACTION → OBSERVE cycle for more precision.
      Only proceed to OUTPUT once you are confident that the user's query has been fully and accurately resolved.

      Available tools:
      1. getWeatherInfo(city : string) : string
      2. executeCommand( command : string ) : string Executes command on user's system and provide stdout and stderr

      Example:
      START : What is the weather of Indore
      THINK : The user is asking for the weater of Indore
      THINK : From the avaiable tools I must use getWeatherInfo tool for Indore city
      ACTION: Call tool getWeatherInfo(Indore);
      OBSERVE : 32'Celcius
      THINK : The output of getWeatherInfo(Indore) is 32'Celcius
      OUTPUT : Hey, The weater of Indore is 32'Celcius which is quite hot.

      Rules:
      Always return a single step and wait for the next step, stricly provide a single step output at a time only.
      Always wait for the next step before proceeding — never skip steps or assume results ahead of time.
      Output format must be strictly JSON
      Only use and ACTION from avaiable tools that are provided
      Strictly follow the Output format in JSON


      Output Format : 
      { step : string, tool : string, input: string, content : string  }

      Output examplt: 
      { role : user, content: What is the weater of Indore }
      { step : think, content: The user is asking for the weater of Indore}
      { step : think, content: From the available tools I must invoke getWeatherInfo(Indore)}
      { step : action, tool : getWeatherInfo(Indore), input: Indore}
      { step : observe, content : 32'Celcius }
      { step : think, content : The output of getWeatherInfo(Indore) is 32'Celcius }
      { step : output, content : Hey, The weater of Indore is 32'Celcius which is quite hot.}

      `;

async function init() {
  const message = [{ role: "system", content: SYSTEMINSTRUCTIONS }];
  const userQuery = await askPrompt("What do you expect me to do? : ");
  message.push({ role: "user", content: userQuery });

  while (true) {
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      response_format: { type: "json_object" },
      messages: message,
    });

    message.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);

    if (parsedResponse.step && parsedResponse.step == "think") {
      console.log(` 💬 : ${parsedResponse.content} `);
      continue;
    }

    if (parsedResponse.step && parsedResponse.step == "output") {
      console.log(` 🤖 : ${parsedResponse.content} `);
      rl.close();
      break;
    }

    if (parsedResponse.step && parsedResponse.step == "action") {
      const tool = parsedResponse.tool;
      const input = parsedResponse.input;

      const value = await TOOLS_MAP[tool](input);
      console.log(`🛠️ : Tool : ${tool}, Input : ${input}, Output : ${value} `);

      message.push({
        role: "assistant",
        content: JSON.stringify({ step: "observe", content: value }),
      });
      continue;
    }
  }
}

init();
