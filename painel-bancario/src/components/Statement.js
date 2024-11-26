import React, { useEffect, useState } from "react";
import { supabase } from '../utils/supabaseClient'; // Certifique-se de que você tem o Supabase configurado corretamente
import Cookies from "js-cookie"; // Importar a biblioteca js-cookie

const Statement = () => {
  const [statements, setStatements] = useState([]); // Para armazenar extratos de todas as contas
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatements = async () => {
      const token = localStorage.getItem("accessToken");
      const clientId = Cookies.get("clientId"); // Recupera o clientId do cookie

      if (!token || !clientId) {
        setError("Token de autenticação ou clientId não encontrado!");
        setLoading(false);
        return;
      }

      try {
        // Busca todas as contas associadas ao client_id
        const { data: accounts, error: accountsError } = await supabase
          .from("news_account")
          .select("account_id, name, account_type, created_at, branch, document, number, status, balance")
          .eq("client_id", clientId); // Utiliza o clientId do cookie

        if (accountsError) {
          setError("Erro ao buscar contas no banco de dados: " + accountsError.message);
          setLoading(false);
          return;
        }

        if (!accounts || accounts.length === 0) {
          setError("Nenhuma conta encontrada para o client_id.");
          setLoading(false);
          return;
        }

        // Para cada conta, busca o extrato
        const fetchedStatements = await Promise.all(
          accounts.map(async (account) => {
            const response = await fetch(`https://mock-ica.aquarela.win/account/${account.account_id}/statement`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();

              // Calcular o saldo inicial, créditos e débitos
              let balance = account.balance || 0; // Começar com o saldo inicial da conta, se disponível
              let initialDeposit = null; // Variável para armazenar o depósito inicial
              let transactions = data.transactions || [];

              // Atualiza o saldo com base nas transações
              transactions.forEach((item) => {
                const amount = parseFloat(item.amount);
                if (item.type === "CREDIT") {
                  balance += amount; // Se for crédito, aumenta o saldo
                } else if (item.type === "DEBIT") {
                  balance -= amount; // Se for débito, diminui o saldo
                }

                // Identificar o "initial deposit" como o primeiro crédito
                if (!initialDeposit && item.type === "CREDIT") {
                  initialDeposit = { amount, date: item.date };
                }
              });

              // Atualiza o saldo no banco de dados para esta conta
              await supabase
                .from("news_account")
                .update({ balance }) // Atualiza o saldo final
                .eq("account_id", account.account_id);

              return {
                ...account, // Adiciona as informações da conta
                transactions,
                finalBalance: balance,
                initialDeposit,
              };
            } else {
              console.error("Erro ao buscar o extrato para a conta " + account.account_id);
              return { ...account, transactions: [] };
            }
          })
        );

        setStatements(fetchedStatements);
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []); // O useEffect roda apenas uma vez após o carregamento do componente

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Extratos de Contas</h1>
      {loading && <p>Carregando extratos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {statements.length > 0 ? (
          statements.map((statement, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold">Conta: {statement.account_id}</h2> {/* Exibe o account_id */}
              <p><strong>Nome:</strong> {statement.name || "Conta " + statement.account_id}</p>
              <p><strong>Tipo de Conta:</strong> {statement.account_type}</p>
              <p><strong>Data de Criação:</strong> {new Date(statement.created_at).toLocaleDateString()}</p>
              <p><strong>Agência:</strong> {statement.branch}</p>
              <p><strong>Documento:</strong> {statement.document}</p>
              <p><strong>Número:</strong> {statement.number}</p>
              <p><strong>Status:</strong> {statement.status}</p>
              <p><strong>Saldo em Conta:</strong> R$ {statement.finalBalance}</p>

              {/* Exibindo o Depósito Inicial */}
              {statement.initialDeposit && (
                <p>
                  <strong>Depósito Inicial:</strong> R$ {statement.initialDeposit.amount} em {new Date(statement.initialDeposit.date).toLocaleDateString()}
                </p>
              )}

              <ul className="space-y-2">
                {statement.transactions.length > 0 ? (
                  statement.transactions.map((item, transIndex) => (
                    <li key={transIndex} className="p-4 bg-white shadow rounded">
                      <p>{item.date}</p>
                      <p>{item.type === "CREDIT" ? "Crédito" : "Débito"}: R$ {item.amount}</p>
                      <p>{item.description}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma transação encontrada para esta conta.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>Nenhuma conta encontrada ou erro ao carregar os extratos.</p>
        )}
      </div>
    </div>
  );
};

export default Statement;
