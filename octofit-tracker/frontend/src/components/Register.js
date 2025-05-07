import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Erro ao registrar. E-mail pode já estar em uso.');
      }
    } catch (err) {
      setError('Erro ao registrar.');
    }
  };

  return (
    <div className="card shadow-sm mx-auto my-5" style={{maxWidth: 400}}>
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Registrar</h2>
        {success && <div className="alert alert-success">Cadastro realizado! Redirecionando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
