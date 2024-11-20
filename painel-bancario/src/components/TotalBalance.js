import React, { useEffect, useState } from "react";

const TotalBalance = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as contas
  const fetchAccounts = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("https://mock-ica.aquarela.win/account", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data || []);
        setLoading(false);
      } else {
        throw new Error("Erro ao buscar contas");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Função para calcular o saldo total das contas
  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Buscar contas ao carregar o componente
  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = calculateTotalBalance();

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Saldo Total de Todas as Contas</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Resumo do Saldo</h2>
        <p><strong>Saldo Total de Todas as Contas:</strong> R$ {totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TotalBalance;
