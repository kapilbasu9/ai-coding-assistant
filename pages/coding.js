import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function CodingAssistant() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const res = await axios.post('http://localhost:8000/generate', { prompt });
    setResult(res.data.result);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl mb-5">AI Coding Assistant</h1>
      <textarea
        className="w-full p-4 text-black"
        rows="5"
        placeholder="Enter your coding problem..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button onClick={handleSubmit} className="mt-4 px-5 py-2 bg-blue-600 rounded-lg">Generate</button>
      <div className="mt-10">
        <h2 className="text-xl mb-3">Generated Code:</h2>
        <Editor height="400px" defaultLanguage="javascript" value={result} theme="vs-dark" />
      </div>
    </div>
  );
}
