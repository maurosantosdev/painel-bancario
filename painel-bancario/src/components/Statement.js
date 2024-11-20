import React, { useEffect, useState } from "react";

const Statement = () => {
  const [statement, setStatement] = useState([]);

  useEffect(() => {
    const fetchStatement = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("https://mock-ica.aquarela.win/account/1/statement", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStatement(data.transactions || []);
    };

    fetchStatement();
  }, []);

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Extrato</h1>
      <ul className="space-y-2">
        {statement.map((item, index) => (
          <li key={index} className="p-4 bg-white shadow rounded">
            <p>{item.date}</p>
            <p>{item.type === "CREDIT" ? "Crédito" : "Débito"}: R$ {item.amount}</p>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statement;
