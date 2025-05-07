import React, { useEffect, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user: '', activity_type: '', duration: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchActivities = () => {
    setLoading(true);
    fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/activity/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar atividades');
        }
        return response.json();
      })
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActivities();
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
        ? `https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/activity/${editId}/`
        : 'https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/activity/';
      const method = editId ? 'PUT' : 'POST';
      const payload = { ...formData, duration: parseInt(formData.duration, 10) };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ user: '', activity_type: '', duration: '', date: '' });
        setEditId(null);
        setSuccess(editId ? 'Atividade atualizada!' : 'Atividade cadastrada!');
        fetchActivities();
      } else {
        setError('Erro ao salvar atividade.');
      }
    } catch (err) {
      setError('Erro ao salvar atividade.');
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      user: activity.user,
      activity_type: activity.activity_type,
      duration: activity.duration,
      date: activity.date
    });
    setEditId(activity._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/activity/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Atividade excluída!');
        fetchActivities();
      } else {
        setError('Erro ao excluir atividade.');
      }
    } catch (err) {
      setError('Erro ao excluir atividade.');
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Atividades</h2>
        {loading && <div className="alert alert-info">Carregando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setEditId(null); setFormData({ user: '', activity_type: '', duration: '', date: '' }); }}>Nova Atividade</button>
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.2)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Editar Atividade' : 'Nova Atividade'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 text-start">
                      <label className="form-label">Usuário</label>
                      <input type="text" className="form-control" name="user" value={formData.user} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Tipo</label>
                      <input type="text" className="form-control" name="activity_type" value={formData.activity_type} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Duração (min)</label>
                      <input type="number" className="form-control" name="duration" value={formData.duration} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Data</label>
                      <input type="date" className="form-control" name="date" value={formData.date} onChange={handleFormChange} required />
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
                <th>Tipo</th>
                <th>Duração (min)</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(activities) && activities.map((activity, idx) => (
                <tr key={activity._id || idx}>
                  <td>{activity.user}</td>
                  <td>{activity.activity_type}</td>
                  <td>{activity.duration}</td>
                  <td>{activity.date}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(activity)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(activity._id)}>Excluir</button>
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

export default Activities;
