import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import withAuth from '@/utils/withAuth';

function EditorPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const router = useRouter();
  const { projectId } = router.query;

  const handleSubmit = async () => {
    const res = await axios.post('http://localhost:8000/generate', { prompt });
    setResult(res.data.result);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h1 className="text-3xl mb-5">Project: {projectId}</h1>
        <textarea 
          className="w-full p-4 text-black" 
          rows="5" 
          placeholder="Describe what you want AI to code..." 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={handleSubmit} className="mt-4 px-5 py-2 bg-blue-600 rounded-lg">Generate Code</button>

        <div className="mt-10">
          <h2 className="text-xl mb-3">AI Generated Code:</h2>
          <Editor height="400px" defaultLanguage="javascript" value={result} theme="vs-dark" />
        </div>
      </div>
    </>
  );
}

export default withAuth(EditorPage);
