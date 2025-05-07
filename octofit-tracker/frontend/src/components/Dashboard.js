import React from 'react';

function Dashboard({ authUser }) {
  return (
    <div className="my-5">
      <h2 className="mb-4 text-primary">Bem-vindo ao Painel, {authUser ? (authUser.name || authUser.username) : 'visitante'}!</h2>
      <p className="lead">Aqui você pode acompanhar suas atividades, treinos, equipes e desempenho no OctoFit.</p>
    </div>
  );
}

export default Dashboard;
