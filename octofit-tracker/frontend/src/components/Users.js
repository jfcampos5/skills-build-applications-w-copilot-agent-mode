
import React, { useEffect, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar usuários');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const url = editId
        ? `https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/${editId}/`
        : 'https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/';
      const method = editId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ name: '', email: '', password: '' });
        setEditId(null);
        setSuccess(editId ? 'Usuário atualizado!' : 'Usuário cadastrado!');
        fetchUsers();
      } else {
        setError('Erro ao salvar usuário.');
      }
    } catch (err) {
      setError('Erro ao salvar usuário.');
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, password: user.password || '' });
    setEditId(user._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/users/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Usuário excluído!');
        fetchUsers();
      } else {
        setError('Erro ao excluir usuário.');
      }
    } catch (err) {
      setError('Erro ao excluir usuário.');
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Usuários</h2>
        {loading && <div className="alert alert-info">Carregando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: '', email: '', password: '' }); }}>Novo Usuário</button>
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.2)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Editar Usuário' : 'Novo Usuário'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 text-start">
                      <label className="form-label">Nome</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">E-mail</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Senha</label>
                      <input type="password" className="form-control" name="password" value={formData.password} onChange={handleFormChange} required={!editId} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.map((user) => (
                <tr key={user._id || user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
