// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { login, fetchAccounts, createAccount } from '../utils/api';

const Dashboard = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('PERSONAL');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');

  const handleLogin = async () => {
    const token = await login(clientId, clientSecret);
    if (token) {
      setAccessToken(token);
    } else {
      alert('Erro ao fazer login!');
    }
  };

  const handleCreateAccount = async () => {
    const newAccount = { accountType, name, document };
    const account = await createAccount(accessToken, newAccount);
    if (account) {
      alert('Conta criada com sucesso!');
      setAccounts([...accounts, account]);
    } else {
      alert('Erro ao criar conta.');
    }
  };

  useEffect(() => {
    if (accessToken) {
      const getAccounts = async () => {
        const data = await fetchAccounts(accessToken);
        setAccounts(data);
      };
      getAccounts();
    }
  }, [accessToken]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Painel Bancário</h1>

      {/* Login Form */}
      {!accessToken ? (
        <div className="mt-4">
          <h2 className="text-xl">Login de Administrador</h2>
          <input
            type="text"
            placeholder="Client ID"
            className="border p-2 mt-2"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Client Secret"
            className="border p-2 mt-2"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 mt-2"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      ) : (
        // After login, show account creation and account list
        <div className="mt-4">
          <h2 className="text-xl">Criar Nova Conta</h2>
          <div className="mt-2">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="border p-2"
            >
              <option value="PERSONAL">Pessoal</option>
              <option value="BUSINESS">Empresarial</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Nome do Titular"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mt-2"
          />
          <input
            type="text"
            placeholder="Número do Documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="border p-2 mt-2"
          />
          <button
            className="bg-blue-500 text-white p-2 mt-2"
            onClick={handleCreateAccount}
          >
            Criar Conta
          </button>

          <h2 className="text-xl mt-4">Contas Bancárias</h2>
          <ul>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <li key={account.id} className="mt-2">
                  <strong>{account.name}</strong> - {account.accountType}
                </li>
              ))
            ) : (
              <p>Nenhuma conta encontrada.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
