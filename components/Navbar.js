import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">AI Coding Assistant</div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/dashboard" className="text-white">Dashboard</Link>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded-lg">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-white">Login</Link>
            <Link href="/register" className="text-white">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
