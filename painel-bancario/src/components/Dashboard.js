import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Importar a biblioteca js-cookie
import { Link, useNavigate } from "react-router-dom"; // useNavigate para navegação programática

const Dashboard = () => {
  const [clientId, setClientId] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Lê o clientId do cookie
    const storedClientId = Cookies.get("clientId");
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      console.error("Client ID não encontrado no cookie.");
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    // Remove o clientId do cookie
    Cookies.remove("clientId");

    // Redireciona o usuário para a página de login ou para a tela inicial
    navigate("/login"); // Substitua "/login" pela sua rota de login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Painel</h1>
      <div className="space-y-4">
        <Link
          to="/statement"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver Extrato
        </Link>
        <Link
          to="/transaction"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Realizar Transferência
        </Link>
        <Link
          to="/account-summary"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Resumo das Contas Abertas
        </Link>
        <Link
          to="/total-balance"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Saldo Total de Todas as Contas
        </Link>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
