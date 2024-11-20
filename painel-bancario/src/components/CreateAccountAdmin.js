// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { login, fetchAccounts, createAccount } from '../utils/api';

const CreateAccountAdmin = () => {
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
    <div className="painel">
  <div className="flex justify-center items-center mb-4">
    <img 
      src="https://icabank.com.br/static/media/Logo.6e249b4f.svg" 
      alt="Logo ICABank" 
      className="w-48 h-48 mr-4" 
    />
    <h1 className="painel-titulo text-3xl font-bold">Painel Bancário</h1>
  </div>

  {/* Login Form */}
  {!accessToken ? (
    <div className="formulario">
      <div>
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-radius"
        />
        <input
          type="password"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 input-radius"
        />
      </div>
      <button className="botao bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4" onClick={handleLogin}>
        Login
      </button>
    </div>
  ) : (
    // After login, show account creation and account list
    <div className="formulario">
      <div className="form-container">
        <h2>Criar Nova Conta</h2>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="border p-2 input-radius"
        >
          <option value="PERSONAL">Pessoal</option>
          <option value="BUSINESS">Empresarial</option>
        </select>
        <input
          type="text"
          placeholder="Nome do Titular"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mt-4 input-radius"
        />
        <input
          type="text"
          placeholder="Número do Documento"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          className="border p-2 mt-4 input-radius"
        />
      </div>
      <button className="botao bg-green-500 text-white p-2 mt-4" onClick={handleCreateAccount}>
        Criar Conta
      </button>

      <h2>Contas Bancárias</h2>
      <ul>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <li key={account.id}>
              <strong>{account.name}</strong> - {account.accountType}
            </li>
          ))
        ) : (
          <p className="alerta-erro">Nenhuma conta encontrada.</p>
        )}
      </ul>
    </div>
  )}
</div>
  );
};

export default CreateAccountAdmin;