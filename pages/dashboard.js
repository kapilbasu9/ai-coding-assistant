import { useEffect, useState } from 'react';
import { getProjects, createProject } from '../utils/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    const res = await getProjects(token);
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async () => {
    await createProject(token, { name, description: desc, content: '' });
    fetchProjects();
  };

  return (
    <>
      <Navbar />
      <div className="p-5">
        <h2 className="text-2xl mb-3">Create New Project</h2>
        <input className="p-2 m-2 text-black" placeholder="Name" onChange={e => setName(e.target.value)} />
        <input className="p-2 m-2 text-black" placeholder="Description" onChange={e => setDesc(e.target.value)} />
        <button className="bg-green-600 p-2 rounded" onClick={handleCreate}>Create</button>

        <h2 className="text-2xl mt-10">Projects</h2>
        <ul>
          {projects.map(p => (
            <li key={p.id}>
              <a href={`/editor?id=${p.id}`} className="text-blue-400">{p.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
