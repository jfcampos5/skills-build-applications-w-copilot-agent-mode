import React, { useEffect, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', members: '' });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchTeams = () => {
    setLoading(true);
    fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/teams/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar times');
        }
        return response.json();
      })
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeams();
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
        ? `https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/teams/${editId}/`
        : 'https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/teams/';
      const method = editId ? 'PUT' : 'POST';
      // Membros separados por vírgula
      const membersArr = formData.members.split(',').map(m => m.trim()).filter(Boolean);
      const payload = { ...formData, members: membersArr };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ name: '', members: '' });
        setEditId(null);
        setSuccess(editId ? 'Time atualizado!' : 'Time cadastrado!');
        fetchTeams();
      } else {
        setError('Erro ao salvar time.');
      }
    } catch (err) {
      setError('Erro ao salvar time.');
    }
  };

  const handleEdit = (team) => {
    setFormData({ name: team.name, members: (team.members || []).join(', ') });
    setEditId(team._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este time?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/teams/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Time excluído!');
        fetchTeams();
      } else {
        setError('Erro ao excluir time.');
      }
    } catch (err) {
      setError('Erro ao excluir time.');
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Times</h2>
        {loading && <div className="alert alert-info">Carregando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: '', members: '' }); }}>Novo Time</button>
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.2)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Editar Time' : 'Novo Time'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 text-start">
                      <label className="form-label">Nome</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Membros (separados por vírgula)</label>
                      <input type="text" className="form-control" name="members" value={formData.members} onChange={handleFormChange} />
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
                <th>Membros</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(teams) && teams.map((team) => (
                <tr key={team._id || team.name}>
                  <td>{team.name}</td>
                  <td>{team.members && team.members.join(', ')}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(team)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(team._id)}>Excluir</button>
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

export default Teams;
