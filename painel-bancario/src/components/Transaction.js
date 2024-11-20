import React, { useState } from "react";

const Transaction = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleTransfer = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch("https://mock-ica.aquarela.win/transaction/internal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          sourceAccountId: "1", // Substitua pelo ID da conta do titular
          targetAccountId: recipient,
        }),
      });

      if (response.ok) {
        alert("Transferência realizada com sucesso!");
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
      <input
        type="text"
        placeholder="Valor (R$)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      />
      <input
        type="text"
        placeholder="ID do Destinatário"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="p-2 border rounded mb-4 w-64"
      />
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
