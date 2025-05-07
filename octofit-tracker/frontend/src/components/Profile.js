import React from 'react';

function Profile({ authUser }) {
  if (!authUser) {
    return <div className="alert alert-warning mt-4">Você precisa estar logado para ver o perfil.</div>;
  }
  return (
    <div className="card shadow-sm mx-auto my-5" style={{maxWidth: 400}}>
      <div className="card-body">
        <h2 className="card-title mb-4 text-primary">Perfil</h2>
        <p><strong>Nome:</strong> {authUser.name || authUser.username}</p>
        <p><strong>E-mail:</strong> {authUser.email}</p>
      </div>
    </div>
  );
}

export default Profile;
