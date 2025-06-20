import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { loginUser } from '../utils/api';

<Navbar />

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem('token', res.data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setMsg('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-5">Login</h1>
      <input className="p-2 m-2 text-black" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="p-2 m-2 text-black" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 p-2 rounded" onClick={handleSubmit}>Login</button>
      <div>{msg}</div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/auth/login', form);
      login(res.data.access_token);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-10 rounded-lg">
        <h1 className="text-3xl mb-5">Login</h1>
        <input className="w-full p-2 text-black" name="username" placeholder="Username" onChange={handleChange} />
        <input className="w-full p-2 text-black" type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button className="bg-blue-600 px-5 py-2 rounded-lg" type="submit">Login</button>
      </form>
    </div>
  );
}