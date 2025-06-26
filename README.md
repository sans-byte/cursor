# 🧠 Cursor - AI Shell Assistant

Cursor is a Bun-powered CLI assistant that uses [Together](https://api.together.xyz) to connect with advanced LLMs (like DeepSeek) for intelligent reasoning and command execution right from your terminal.

> 🔧 Built with [Bun](https://bun.sh) • 🧠 Powered by [DeepSeek R1](https://huggingface.co/deepseek-ai/DeepSeek-V3) via Together

---

## ✨ Features

- Structured AI reasoning via `START → THINK → ACTION → OBSERVE → OUTPUT`
- Executes shell commands using natural language
- Super-fast development with [Bun](https://bun.sh) and [TypeScript](https://www.typescriptlang.org/)
- Uses Together to access models like DeepSeek

---

## 🛠️ Installation & Usage

### 1. Install Bun  
If you don’t have Bun installed, run:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your terminal to apply the changes.

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/cursor.git
cd cursor
```

---

### 3. Install Dependencies

```bash
bun install
```

---

### 4. Set Up Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your [Together](https://api.together.xyz) API key:

```env
TOGETHER_API_KEY=your_together_api_key_here
```

You can get your key for free at: https://api.together.xyz

---

### 5. Run the Assistant

To run the assistant:

```bash
bun run index.ts
```

Or with file watching:

```bash
bun run dev
```

---

## 💬 Usage Example

When prompted:

```bash
What do you expect me to do? :
```

Try commands like:

```
What is the weather in Delhi?

List all files in the current directory.

Create a fully functional TODO list web app with the help of HTML, CSS, JS inside todo folder

```

You’ll see the assistant respond step-by-step in this format:

```json
{ "step": "think", "content": "User is asking for..." }
{ "step": "action", "tool": "executeCommand", "input": "ls" }
{ "step": "observe", "content": "index.ts\nREADME.md" }
{ "step": "output", "content": "Here are the files..." }
```

---

## 🔧 Tools Available

The assistant has access to:
- `getWeaterInfo(city: string)` - get weater info of any city 
- `executeCommand(command: string)` – runs shell commands using Node.js

---

## 📄 License

MIT © [Sanskar Jain](https://github.com/sans-byte)

---

## 🤝 Contributing

Pull requests, feature ideas, and improvements are welcome!

---

## 📎 Suggestions

Let me know if you'd like:

- ✅ A matching `.env.example` file  
- ✅ A `.gitignore` file  
- ✅ Badges for the top (Bun version, License, etc.)
