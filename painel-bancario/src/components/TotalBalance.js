import React, { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'; // Importando o cliente Supabase
import Cookies from "js-cookie"; // Importando o Cookies para pegar o clientId

const TotalBalance = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as contas do banco de dados
  const fetchAccounts = async () => {
    const clientId = Cookies.get("clientId"); // Recupera o clientId do cookie

    if (!clientId) {
      setError("Client ID não encontrado no cookie!");
      setLoading(false);
      return;
    }

    try {
      // Buscar as contas associadas ao clientId
      const { data, error } = await supabase
        .from("news_account") // Substitua pela tabela correta
        .select("account_id, balance") // Seleciona o saldo de cada conta
        .eq("client_id", clientId); // Filtra pelo clientId

      if (error) {
        throw new Error(error.message);
      }

      setAccounts(data || []);
      setLoading(false);
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
