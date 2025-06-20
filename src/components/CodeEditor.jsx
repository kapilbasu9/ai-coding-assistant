import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { generateCode, explainCode, editCode, debugCode } from '../services/api';

const CodeEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [instruction, setInstruction] = useState('');
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    const res = await generateCode(prompt);
    setResult(res.data.result);
  };

  const handleExplain = async () => {
    const res = await explainCode(code);
    setResult(res.data.explanation);
  };

  const handleEdit = async () => {
    const res = await editCode(code, instruction);
    setResult(res.data.edited_code);
  };

  const handleDebug = async () => {
    const res = await debugCode(code);
    setResult(res.data.debugged_code);
  };

  return (
    <div className="container">
      <h2>AI Coding Assistant</h2>

      <div>
        <textarea placeholder="Enter prompt" onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={handleGenerate}>Generate Code</button>
      </div>

      <div>
        <MonacoEditor
          height="400"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
        />
      </div>

      <div>
        <button onClick={handleExplain}>Explain</button>
        <input placeholder="Instruction" onChange={(e) => setInstruction(e.target.value)} />
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDebug}>Debug</button>
      </div>

      <div>
        <h3>Result:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
