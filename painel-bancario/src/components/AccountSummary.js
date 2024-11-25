import React, { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'; // Certifique-se de que o Supabase esteja configurado corretamente

const AccountSummary = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as contas do banco de dados
  const fetchAccounts = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Token de autenticação não encontrado!");
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("news_account") // Supondo que a tabela de contas seja "news_account"
        .select("account_id, account_type, balance");

      if (fetchError) {
        throw new Error("Erro ao buscar contas: " + fetchError.message);
      }

      setAccounts(data || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Função para calcular o saldo total de todas as contas
  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Função para contar o número de contas por tipo
  const countAccountTypes = () => {
    return accounts.reduce(
      (counts, account) => {
        if (account.account_type === "PERSONAL") counts.personal += 1;
        if (account.account_type === "BUSINESS") counts.business += 1;
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
