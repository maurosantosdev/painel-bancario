import React, { useState, useEffect } from 'react';
import { login, fetchAccounts, createAccount } from '../utils/api';
import { supabase } from '../utils/supabaseClient'; // Importando a configuração do Supabase
import loginImg from '../assets/login.jpg';

const CreateAccountAdmin = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('PERSONAL');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');

  // Salvar dados no Supabase
  const saveToSupabase = async (clientId, clientSecret, accessToken) => {
    try {
      const { data, error } = await supabase
        .from('authentication') // Nome da tabela no Supabase
        .insert([{ client_id: clientId, client_secret: clientSecret, access_token: accessToken }]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
      } else {
        console.log('Dados salvos no Supabase:', data);
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar no Supabase:', error);
    }
  };

  const handleLogin = async () => {
    const token = await login(clientId, clientSecret);
    if (token) {
      setAccessToken(token);
      // Salva os dados no Supabase após o login bem-sucedido
      saveToSupabase(clientId, clientSecret, token);
    } else {
      alert('Erro ao fazer login!');
    }
  };

  const handleCreateAccount = async () => {
    const newAccount = { accountType, name, document };
  
    // Criação da conta na API
    const account = await createAccount(accessToken, newAccount);
    if (account) {
      try {
        // Verificar se a conta já existe no Supabase
        const { data: existingAccounts, error: selectError } = await supabase
          .from('news_account') // Nome da tabela no Supabase
          .select('account_id, document')
          .or(`account_id.eq.${account.id},document.eq.${account.document}`);
  
        if (selectError) {
          console.error('Erro ao verificar se a conta já existe:', selectError.message);
          alert('Erro ao verificar os detalhes no banco de dados.');
          return;
        }
  
        if (existingAccounts && existingAccounts.length > 0) {
          alert('Conta já existente!');
          return;
        }
  
        // Inserir a nova conta no Supabase
        const { error: insertError } = await supabase
          .from('news_account') // Nome da tabela no Supabase
          .insert({
            client_id: clientId,           // ID do cliente que criou a conta
            balance: account.balance,      // Money
            branch: account.branch,
            document: account.document,
            account_id: account.id,        // ID da conta
            name: account.name,
            number: account.number,
            status: account.status,
            tenantId: account.tenantId,    // ID
            account_type: account.accountType, // Tipo da conta
            updatedAt: account.updatedAt,
          });
  
        if (insertError) {
          console.error('Erro ao salvar na tabela news_account:', insertError.message);
          alert('Erro ao salvar os detalhes no banco de dados.');
        } else {
          alert('Conta salva com sucesso na tabela news_account.');
          setAccounts([...accounts, account]); // Atualiza a lista local de contas
        }
      } catch (error) {
        console.error('Erro inesperado ao salvar/verificar na tabela news_account:', error);
      }
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
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={loginImg} alt="" />
      </div>

      <div className="bg-gray-800 flex flex-col justify-center">
        {/* Login Form */}
        {!accessToken ? (
          <div className="max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8">
            <h2 className="text-4xl dark:text-white font-bold text-center">
              Painel Bancário
            </h2>
            <br />
            <div className="flex flex-col text-gray-400 py-2">
              <label>Client ID</label>
              <input
                className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div className="flex flex-col text-gray-400 py-2">
              <label>Client Secret</label>
              <input
                className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
            <button
              className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        ) : (
          // After login, show account creation and account list
          <div className="text-4xl dark:text-white font-bold text-center">
            <div className="form-container">
              <h2 className="text-3xl dark:text-white font-bold text-center">
                Criar Nova Conta
              </h2>
              <br />
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="text-inputs tamanho-inputs p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              >
                <option value="PERSONAL">Pessoal</option>
                <option value="BUSINESS">Empresarial</option>
              </select>
              <br />
              <input
                type="text"
                placeholder="Nome do Titular"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-inputs tamanho-inputs p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              />
              <br />
              <input
                type="text"
                placeholder="Número do Documento"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="text-inputs tamanho-inputs p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              />
            </div>
            <button
              className="text-inputs tamanho-inputs w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg"
              onClick={handleCreateAccount}
            >
              Criar Conta
            </button>

            <h2 className="text-inputs">Contas Bancárias</h2>
            <ul>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <li className="text-inputs-create" key={account.id}>
                    <strong>{account.name}</strong> - {account.accountType}
                  </li>
                ))
              ) : (
                <p className="text-inputs alerta-erro">Nenhuma conta encontrada.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAccountAdmin;
