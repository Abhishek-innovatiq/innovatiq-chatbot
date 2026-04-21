# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# innovatiq-chatbot

Reusable plug-and-play chatbot component for all Innovatiq React projects.

---

## 📦 Installation

```bash
npm install innovatiq-chatbot
```

---

## ⚡ Usage — React (Any Project)

```jsx
import ChatBot from 'innovatiq-chatbot';

function App() {
  return (
    <div>
      {/* Your existing app content */}

      {/* Just add this one line anywhere in your root component */}
      <ChatBot emailTo="info@innovatiq.com.sg" />
    </div>
  );
}
```

That's it! Chatbot will appear on every page automatically. ✅

---

## 🖥️ Backend Setup (Node.js) — One Time Only

### Step 1 — Install nodemailer
```bash
npm install nodemailer
```

### Step 2 — Copy the route file
```bash
# The route file is included in the package
cp node_modules/innovatiq-chatbot/backend/chatbot.route.js ./routes/chatbot.route.js
```

### Step 3 — Register in your server.js
```js
const chatbotRoute = require("./routes/chatbot.route");
app.use("/api/chatbot", chatbotRoute);
```

### Step 4 — Add .env variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

> **Gmail App Password kaise banayein:**
> Google Account → Security → 2-Step Verification → App Passwords → Generate

---

## ✅ Features

| Feature | Details |
|---------|---------|
| Auto popup | Opens after 50 seconds |
| Rotating messages | 10 messages, changes every 30 sec |
| Main menu | Product / Service / Others |
| Services | 7 Innovatiq services listed |
| Products | LearnPro, Skillera, Securon |
| Careers | Redirects to careers page |
| Lead form | Name, Email, Phone, Company, Message |
| Email | Sends to info@innovatiq.com.sg with chat history |
| Branding | Innovatiq Red theme + Logo |
| Phase II | Live agent via email (coming soon) |

---

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emailTo` | string | `info@innovatiq.com.sg` | Email to receive inquiries |

---

## 🔄 Update Package (When Changes Needed)

```bash
# Rebuild
npm run build

# Bump version in package.json then republish
npm publish
```

---

## 📁 Package Structure

```
innovatiq-chatbot/
├── src/
│   ├── components/
│   │   └── ChatBot.jsx       ← React component source
│   └── index.js              ← Export
├── backend/
│   └── chatbot.route.js      ← Node.js email API
├── dist/
│   ├── index.esm.js          ← ES Module build
│   └── index.cjs.js          ← CommonJS build
├── vite.config.js            ← Build config
└── package.json
```

---

Made with ❤️ by Innovatiq Dev Team