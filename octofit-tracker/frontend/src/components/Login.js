import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setAuthUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Simulação de autenticação (substitua por chamada real ao backend)
    try {
      const response = await fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/');
      const users = await response.json();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setAuthUser(user);
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } catch (err) {
      setError('Erro ao autenticar.');
    }
  };

  return (
    <div className="card shadow-sm mx-auto my-5" style={{maxWidth: 400}}>
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Entrar</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
