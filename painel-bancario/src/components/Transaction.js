import React, { useState, useEffect } from "react";
import { supabase } from '../utils/supabaseClient'; // Certifique-se de ter o supabaseClient configurado
import Cookies from "js-cookie"; // Importar a biblioteca js-cookie

const Transaction = () => {
  const [amount, setAmount] = useState(""); // Valor da transferência
  const [recipient, setRecipient] = useState(""); // ID do destinatário
  const [accounts, setAccounts] = useState([]); // Lista de contas do usuário
  const [sourceAccountId, setSourceAccountId] = useState(""); // Conta de origem

  useEffect(() => {
    // Função para buscar as contas do clientId específico
    const fetchAccounts = async () => {
      const clientId = Cookies.get("clientId"); // Recupera o clientId do cookie

      if (!clientId) {
        console.error("Client ID não encontrado no cookie!");
        return;
      }

      try {
        // Buscar as contas associadas ao clientId
        const { data, error } = await supabase
          .from("news_account") // Substitua pela tabela de contas
          .select("account_id, name, account_type, balance") // Inclui o balance
          .eq("client_id", clientId); // Busca pelo clientId

        if (error) {
          console.error("Erro ao buscar contas:", error.message);
        } else {
          setAccounts(data); // Armazena as contas na variável de estado
        }
      } catch (err) {
        console.error("Erro ao buscar contas:", err.message);
      }
    };

    fetchAccounts(); // Chama a função para buscar as contas
  }, []); // O useEffect roda apenas uma vez após o carregamento do componente

  const handleTransfer = async () => {
    if (!amount || !recipient || !sourceAccountId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      // Realiza a transferência (via API ou lógica do seu sistema)
      const response = await fetch("https://mock-ica.aquarela.win/transaction/internal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          sourceAccountId: sourceAccountId, // Conta de origem
          targetAccountId: recipient, // Conta de destino
        }),
      });

      if (response.ok) {
        alert("Transferência realizada com sucesso!");

        // 1. Buscar o saldo atual das contas (origem e destino)
        const { data: sourceAccountData, error: sourceError } = await supabase
          .from("news_account")
          .select("balance")
          .eq("account_id", sourceAccountId)
          .single(); // A única conta correspondente

        const { data: recipientAccountData, error: recipientError } = await supabase
          .from("news_account")
          .select("balance")
          .eq("account_id", recipient)
          .single(); // A única conta correspondente

        if (sourceError || recipientError) {
          console.error("Erro ao buscar o saldo:", sourceError?.message || recipientError?.message);
          return;
        }

        // 2. Calcular os novos saldos:
        const newSourceBalance = sourceAccountData.balance - parseFloat(amount); // Subtrai da conta de origem
        const newRecipientBalance = recipientAccountData.balance + parseFloat(amount); // Soma na conta de destino

        // 3. Atualizar os saldos no banco de dados
        const { error: updateSourceError } = await supabase
          .from("news_account")
          .update({ balance: newSourceBalance }) // Atualiza o saldo da conta de origem
          .eq("account_id", sourceAccountId);

        const { error: updateRecipientError } = await supabase
          .from("news_account")
          .update({ balance: newRecipientBalance }) // Atualiza o saldo da conta de destino
          .eq("account_id", recipient);

        if (updateSourceError || updateRecipientError) {
          console.error("Erro ao atualizar saldos:", updateSourceError?.message || updateRecipientError?.message);
          return;
        }

        // 4. Registrar a transferência na tabela transaction_register
        const { error: transactionError } = await supabase
          .from("transaction_register")
          .insert({
            source_account_id: sourceAccountId,
            target_account_id: recipient,
            amount: parseFloat(amount),
            created_at: new Date().toISOString(), // Data e hora da transação
          });

        if (transactionError) {
          console.error("Erro ao registrar a transferência:", transactionError.message);
        } else {
          console.log("Transferência registrada com sucesso!");
        }
      } else {
        const error = await response.json();
        alert("Erro na transferência: " + error.message);
      }
    } catch (error) {
      alert("Erro de rede: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Realizar Transferência</h1>

      {/* Selecione a conta de origem */}
      <h1>Conta origem</h1>
      <select
        value={sourceAccountId}
        onChange={(e) => setSourceAccountId(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      >
        <option value="">Selecione a conta de origem</option>
        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.account_id} - {account.name} ({account.account_type})
          </option>
        ))}
      </select>

      {/* Selecione a conta de destino */}
      <h1>Conta de destino</h1>
      <select
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      >
        <option value="">Selecione a conta de destino</option>
        {accounts.map((account) => (
          <option key={account.account_id} value={account.account_id}>
            {account.account_id} - {account.name} ({account.account_type})
          </option>
        ))}
      </select>

      {/* Campo para valor */}
      <input
        type="text"
        placeholder="Valor (R$)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      />

      {/* Botão de transferência */}
      <button
        onClick={handleTransfer}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Transferir
      </button>
    </div>
  );
};

export default Transaction;
