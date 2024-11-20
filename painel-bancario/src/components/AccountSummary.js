import React, { useEffect, useState } from "react";

const AccountSummary = () => {
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

  // Função para contar o número de contas por tipo
  const countAccountTypes = () => {
    return accounts.reduce(
      (counts, account) => {
        if (account.accountType === "PERSONAL") counts.personal += 1;
        if (account.accountType === "BUSINESS") counts.business += 1;
        return counts;
      },
      { personal: 0, business: 0 }
    );
  };

  // Buscar contas ao carregar o componente
  useEffect(() => {
    fetchAccounts();
  }, []);

  const { personal, business } = countAccountTypes();
  const totalBalance = calculateTotalBalance();

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Resumo das Contas Abertas</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded shadow-lg mb-4">
        <h2 className="text-xl font-semibold mb-3">Informações Gerais</h2>
        <p><strong>Total de Contas Abertas:</strong> {accounts.length}</p>
        <p><strong>Total de Contas Pessoais:</strong> {personal}</p>
        <p><strong>Total de Contas Empresariais:</strong> {business}</p>
        <p><strong>Saldo Total de Todas as Contas:</strong> R$ {totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default AccountSummary;
