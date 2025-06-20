import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const [tone, setTone] = useState("default");
  const [maxTokens, setMaxTokens] = useState(500);
  const [temperature, setTemperature] = useState(0.7);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [provider, setProvider] = useState("openai");

  const FREE_LIMITS = {
    openai: 5,
    cohere: 3,
    huggingface: 3,
  };

  useEffect(() => {
    const session = localStorage.getItem("session");
    const loggedInUser = localStorage.getItem("username");
    if (session === "true" && loggedInUser) {
      setIsLoggedIn(true);
      setUsername(loggedInUser);
      const userHistory = JSON.parse(localStorage.getItem(`promptHistory_${loggedInUser}`)) || [];
      setHistory(userHistory);
    }
    const savedPrompt = localStorage.getItem("unsentPrompt");
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  const updateHistory = (newPrompt, newResponse) => {
    const now = new Date().toLocaleString();
    const newItem = { prompt: newPrompt, response: newResponse, time: now };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(`promptHistory_${username}`, JSON.stringify(updated));

    axios.post("http://localhost:8000/history", {
      username,
      prompt: newPrompt,
      response: newResponse,
      time: now,
    }).catch((err) => console.error("❌ Failed to save history:", err.message));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const usageKey = `usage_${username}`;
    const usageData = JSON.parse(localStorage.getItem(usageKey)) || {
      openai: 0,
      cohere: 0,
      huggingface: 0,
    };

    if (usageData[provider] >= FREE_LIMITS[provider]) {
      setResponse(`❌ Usage limit reached for ${provider.toUpperCase()}.`);
      return;
    }

    setResponse("⏳ Generating...");
    try {
      const res = await axios.post("http://localhost:8000/generate", {
        prompt,
        provider,
        model,
        tone,
        max_tokens: maxTokens,
        temperature,
      });

      setResponse(res.data.result);
      updateHistory(prompt, res.data.result);
      localStorage.removeItem("unsentPrompt");

      usageData[provider] += 1;
      localStorage.setItem(usageKey, JSON.stringify(usageData));
    } catch (err) {
      setResponse(`❌ Error: ${err.message}`);
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (isSignup) {
      if (users[username]) return alert("❌ Username already exists!");
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      alert("✅ Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      if (users[username] === password) {
        setIsLoggedIn(true);
        localStorage.setItem("session", "true");
        localStorage.setItem("username", username);
        const userHistory = JSON.parse(localStorage.getItem(`promptHistory_${username}`)) || [];
        setHistory(userHistory);
      } else {
        alert("❌ Invalid credentials!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setPrompt("");
    setResponse("");
    setHistory([]);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt_history_${username}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTXT = () => {
    const txt = history.map((item, i) =>
      `#${i + 1} — ${item.time}\nPrompt:\n${item.prompt}\n\nResponse:\n${item.response}\n---`
    ).join("\n\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt_history_${username}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importHistory = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          setHistory(data.slice(0, 10));
          localStorage.setItem(`promptHistory_${username}`, JSON.stringify(data.slice(0, 10)));
        } else {
          alert("❌ Invalid history file.");
        }
      } catch (err) {
        alert("❌ Error reading file.");
      }
    };
    reader.readAsText(file);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleAuth} className="bg-gray-800 p-6 rounded w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            {isSignup ? "📝 Signup" : "🔐 Login"}
          </h2>
          <input type="text" placeholder="Username" className="w-full mb-3 p-2 rounded bg-gray-700" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full mb-4 p-2 rounded bg-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mb-2">
            {isSignup ? "📩 Signup" : "🔓 Login"}
          </button>
          <p className="text-sm text-center">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignup(!isSignup)} className="underline text-blue-400 hover:text-blue-500">
              {isSignup ? "Login here" : "Signup here"}
            </button>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white relative">
      <div className="absolute top-4 right-6">
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
          🔒 Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">💡 AI Code Assistant</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <textarea value={prompt} onChange={(e) => {
          setPrompt(e.target.value);
          localStorage.setItem("unsentPrompt", e.target.value);
        }} rows={5} className="w-full md:w-2/3 p-3 bg-gray-800 border border-gray-600 rounded" placeholder="Enter your coding prompt..." />

        <div className="flex flex-wrap gap-2 w-full md:w-2/3 text-sm">
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
            <option value="openai">OpenAI</option>
            <option value="cohere">Cohere</option>
            <option value="huggingface">HuggingFace</option>
          </select>
          <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
            <option value="default">🎯 Default</option>
            <option value="friendly">😊 Friendly</option>
            <option value="professional">📊 Professional</option>
            <option value="creative">🎨 Creative</option>
            <option value="concise">✂️ Concise</option>
          </select>
          <input type="number" min={100} max={4000} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-24" placeholder="Max Tokens" />
          <input type="number" step={0.1} min={0} max={2} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-24" placeholder="Temperature" />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">🚀 Generate</button>
      </form>

      {response && (
        <div className="mt-6 bg-gray-800 p-4 rounded shadow-md w-full md:w-2/3 mx-auto">
          <h2 className="font-semibold mb-2">🧠 Response:</h2>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 md:w-2/3 mx-auto bg-gray-800 p-4 rounded shadow-md">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">📜 Prompt History</h3>
            <div className="flex gap-2">
              <button onClick={() => {
                if (confirm("Clear all prompt history?")) {
                  localStorage.removeItem(`promptHistory_${username}`);
                  setHistory([]);
                }
              }} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">🗑️ Clear All</button>
              <button onClick={exportJSON} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">📥 Export JSON</button>
              <button onClick={exportTXT} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm">📄 Export TXT</button>
              <label className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm cursor-pointer">
                📤 Import
                <input type="file" accept=".json" onChange={importHistory} hidden />
              </label>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            {history.map((item, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded relative group">
                <div className="mb-1 text-xs text-gray-400">{item.time}</div>
                <div><strong>📝 Prompt:</strong><div>{item.prompt}</div></div>
                <div><strong>🧠 Response:</strong><div className="whitespace-pre-wrap">{item.response}</div></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
