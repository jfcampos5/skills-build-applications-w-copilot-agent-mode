import React, { useEffect, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user: '', workout_type: '', details: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchWorkouts = () => {
    setLoading(true);
    fetch('https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/workouts/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar treinos');
        }
        return response.json();
      })
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts();
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
        ? `https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/workouts/${editId}/`
        : 'https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/workouts/';
      const method = editId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ user: '', workout_type: '', details: '', date: '' });
        setEditId(null);
        setSuccess(editId ? 'Treino atualizado!' : 'Treino cadastrado!');
        fetchWorkouts();
      } else {
        setError('Erro ao salvar treino.');
      }
    } catch (err) {
      setError('Erro ao salvar treino.');
    }
  };

  const handleEdit = (workout) => {
    setFormData({
      user: workout.user,
      workout_type: workout.workout_type,
      details: workout.details,
      date: workout.date
    });
    setEditId(workout._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este treino?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`https://curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev/api/workouts/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Treino excluído!');
        fetchWorkouts();
      } else {
        setError('Erro ao excluir treino.');
      }
    } catch (err) {
      setError('Erro ao excluir treino.');
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Treinos</h2>
        {loading && <div className="alert alert-info">Carregando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary mb-3" onClick={() => { setShowForm(true); setEditId(null); setFormData({ user: '', workout_type: '', details: '', date: '' }); }}>Novo Treino</button>
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.2)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Editar Treino' : 'Novo Treino'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 text-start">
                      <label className="form-label">Usuário</label>
                      <input type="text" className="form-control" name="user" value={formData.user} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Tipo de Treino</label>
                      <input type="text" className="form-control" name="workout_type" value={formData.workout_type} onChange={handleFormChange} required />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label">Detalhes</label>
                      <input type="text" className="form-control" name="details" value={formData.details} onChange={handleFormChange} required />
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
                <th>Tipo de Treino</th>
                <th>Detalhes</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(workouts) && workouts.map((workout, idx) => (
                <tr key={workout._id || idx}>
                  <td>{workout.user}</td>
                  <td>{workout.workout_type}</td>
                  <td>{workout.details}</td>
                  <td>{workout.date}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(workout)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(workout._id)}>Excluir</button>
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

export default Workouts;
