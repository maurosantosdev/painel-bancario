import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Painel</h1>
      <div className="space-y-4">
        <Link
          to="/statement"
          className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver Extrato
        </Link>
        <Link
          to="/transaction"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Realizar Transferência
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
