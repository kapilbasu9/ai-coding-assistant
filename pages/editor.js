import { useEffect, useState } from 'react';
import { getProjectById } from '../utils/api';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Editor from '@monaco-editor/react';

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      getProjectById(token, id).then(res => setProject(res.data));
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl">{project.name}</h2>
        <p>{project.description}</p>
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          value={project.content}
          theme="vs-dark"
        />
      </div>
    </>
  );
}
