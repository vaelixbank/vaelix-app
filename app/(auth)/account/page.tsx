'use client';

import { useStore } from '../../../lib/store';

export default function Account() {
  const user = useStore((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Email:</strong> {user.email}</p>
        {user.name && <p><strong>Name:</strong> {user.name}</p>}
        <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}