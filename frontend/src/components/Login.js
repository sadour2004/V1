import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://192.168.11.111:5000';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '100px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Se connecter</h2>
      <input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Connexion</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
} 