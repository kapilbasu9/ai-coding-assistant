// pages/index.js
import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setResult('❗ Please enter a prompt before generating.');
      return;
    }

    setLoading(true);
    setResult(''); // Clear previous result

    try {
      const res = await axios.post('http://localhost:8000/generate', { prompt });
      console.log("Response from backend:", res.data); // Debug log
      setResult(res.data.result);
    } catch (error) {
      console.error("API Error:", error);
      setResult('🚫 Error: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">🤖 AI Coding Assistant</h1>

      <textarea
        className="w-full p-4 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        placeholder="Describe your coding problem or request (e.g., 'Create a React login form')..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-200"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {result && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">🧠 Generated Code:</h2>
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={result}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
      )}
    </div>
  );
}
