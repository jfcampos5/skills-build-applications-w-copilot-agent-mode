import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user: '', points: '' });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/leaderboard/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar leaderboard');
        }
        return response.json();
      })
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
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
        ? `https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/leaderboard/${editId}/`
        : 'https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/leaderboard/';
      const method = editId ? 'PUT' : 'POST';
      const payload = { ...formData, points: parseInt(formData.points, 10) };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ user: '', points: '' });
        setEditId(null);
        setSuccess(editId ? 'Pontuação atualizada!' : 'Pontuação cadastrada!');
        fetchLeaderboard();
      } else {
        setError('Erro ao salvar pontuação.');
      }
    } catch (err) {
      setError('Erro ao salvar pontuação.');
    }
  };

  const handleEdit = (entry) => {
    setFormData({ user: entry.user, points: entry.points });
    setEditId(entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pontuação?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/leaderboard/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Pontuação excluída!');
        fetchLeaderboard();
      } else {
        setError('Erro ao excluir pontuação.');
      }
    } catch (err) {
      setError('Erro ao excluir pontuação.');
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Leaderboard</h2>
        {loading && <div className="alert alert-info">Carregando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setEditId(null); setFormData({ user: '', points: '' }); }}>Nova Pontuação</button>
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.2)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Editar Pontuação' : 'Nova Pontuação'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 text-start">
                      <label className="form-label">Usuário</label>
                      <input type="text" className="form-control" name="user" value={formData.user} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Pontos</label>
                      <input type="number" className="form-control" name="points" value={formData.points} onChange={handleFormChange} required />
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
                <th>Usuário</th>
                <th>Pontos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(leaderboard) && leaderboard.map((entry, idx) => (
                <tr key={entry._id || idx}>
                  <td>{entry.user}</td>
                  <td>{entry.points}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(entry)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry._id)}>Excluir</button>
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

export default Leaderboard;
