## Passo 1: Criando o Projeto React

```bash
npx create-react-app painel-bancario
```

## Passo 2: Estrutura Inicial do Projeto

Instalando as bibliotecas necessárias para o estilo e componentes do painel bancário:

```bash
npm install -D tailwindcss postcss autoprefixer 
npx tailwindcss init
```

## Dentro do arquivo tailwind.config.js, adicionarei a configuração básica para o React.

```bash
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
##  Dentro arquivo chamado index.css e adicione o seguinte código para importar o Tailwind CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Dentro do arquivo src/index.js adicionei o import.

No arquivo ```bash src/index.js```, importe o CSS

## Passo 3: Instalando o shadcn (UI Components)

```bash
npm install @shadcn/ui
```

## Passo 4: Configuração de Animações com Framer Motion

```bash
npm install framer-motion
```

## Passo 5: Estrutura do Projeto.

```css
src/
  components/
    AccountSummary.js
    CreateAccountAdmin.js
    Dashboard.js
    Login.js
    Statement.js
    TotalBalance.js
    Transaction.js
  pages/
    AdminDashboard.js
  App.js
  ```

## Criando o dashboard simples:

```bash
// src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Painel Bancário - Administrador</h1>
      <div className="mt-4">
        <h2 className="text-xl">Resumo das Contas</h2>
        <p>Resumo das contas abertas e saldo total.</p>
      </div>
    </div>
  );
};

export default Dashboard;
```

## Passo 6: Conectar à API de Simulação BaaS

Agora, vou integrar a API de simulação BaaS. A primeira coisa é configurar o login e obter o access_token, que será necessário para fazer as requisições.

Instalando o Axios para facilitar a requisição HTTP:

```bash
npm install axios
```

## Agora irei configurar a requisição de autenticação: 
## Irei criar a função para se autenticar e obter o token de acesso.

```bash
// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://mock-ica.aquarela.win';

export const login = async (clientId, clientSecret) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        clientId,
        clientSecret,
      },
      { headers: { 'X-Mock': 'true' } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    return null;
  }
};
```

## Vamos alterar o Dashboard para permitir login e mostrar o token de acesso e foi adicionado a biblioteca js-cookie.

```bash
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Importar a biblioteca js-cookie
import { Link, useNavigate } from "react-router-dom"; // useNavigate para navegação programática

const Dashboard = () => {
  const [clientId, setClientId] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Lê o clientId do cookie
    const storedClientId = Cookies.get("clientId");
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      console.error("Client ID não encontrado no cookie.");
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    // Remove o clientId do cookie
    Cookies.remove("clientId");

    // Redireciona o usuário para a página de login ou para a tela inicial
    navigate("/login"); // Substitua "/login" pela sua rota de login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Painel</h1>
      <div className="space-y-4">
        <Link
          to="/statement"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver Extrato
        </Link>
        <Link
          to="/transaction"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Realizar Transferência
        </Link>
        <Link
          to="/account-summary"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Resumo das Contas Abertas
        </Link>
        <Link
          to="/total-balance"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Saldo Total de Todas as Contas
        </Link>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
```

## Passo 7: Rotas

## Instalando React Router

```bash
npm install react-router-dom
```

## Agora irei configurar o Roteamento no App.js

```bash
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Statement from "./components/Statement";
import Transaction from "./components/Transaction";
import CreateAccountAdmin from "./components/CreateAccountAdmin";
import AccountSummary from "./components/AccountSummary";
import TotalBalance from "./components/TotalBalance";

const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<CreateAccountAdmin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/account-summary" element={<AccountSummary />} />
        <Route path="/total-balance" element={<TotalBalance />} />
      </Routes>
    </Router>
  );
};

export default App;
```

## Agora irei implementar as funcionalidades de visualização e criação de contas bancárias.

## 1. Visualização de Contas Bancárias: Consultar a API para listar as contas bancárias existentes.
## 2. Criação de Contas Bancárias: Enviar uma solicitação para criar uma nova conta bancária, com o tipo (pessoal ou empresarial), nome do titular e número do documento.

## Primeiro, vou criar uma função para listar as contas bancárias usando a API. Para isso, irei adicionar uma nova função na nossa api.js para buscar as contas.

## Criando a função de listagem de Contas

```bash
// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://mock-ica.aquarela.win';

export const login = async (clientId, clientSecret) => {
    try {
      const response = await axios.post(
        'https://mock-ica.aquarela.win/auth/login',
        { clientId, clientSecret },
        { headers: { 'X-Mock': 'true' } }
      );
      console.log('Login bem-sucedido:', response.data); // Adicione o log aqui
      return response.data.access_token;
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      return null;
    }
  };

export const fetchAccounts = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/account`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return [];
  }
};

export const createAccount = async (accessToken, accountData) => {
    try {
      const response = await axios.post(
        'https://mock-ica.aquarela.win/account',
        accountData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Conta criada:', response.data); // Adicione o log aqui
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      return null;
    }
  };
```

## Agora a criação das Contas.

## Agora, irei adicionar a funcionalidade para criar novas contas bancárias. Vou criar um formulário onde o usuário possa inserir o tipo de conta, nome do titular e documento.

Função.

```bash
export const createAccount = async (accessToken, accountData) => {
  try {
    const response = await axios.post(
      `${API_URL}/account`,
      accountData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return null;
  }
};
```

## No CreateAccountAdmin, agora vou adicionar o formulário para criação da conta.

```bash
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
  const saveToSupabase = async (clientId, clientSecret, accessToken, expiresAt) => {
    try {
      const { data, error } = await supabase
        .from('authentication') // Nome da tabela no Supabase
        .insert([{ 
          client_id: clientId, 
          client_secret: clientSecret, 
          access_token: accessToken,
          expiresAt: expiresAt
         }]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
      } else {
        console.log('Dados salvos no Supabase:', data);
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar no Supabase:', error);
    }
  };

  // Função para verificar se o usuário está registrado na tabela de autenticação
  const checkAuthentication = async () => {
    try {
      // Verifica se o cliente está registrado na tabela authentication
      const { data, error } = await supabase
        .from('authentication')
        .select('*')
        .eq('client_id', clientId)
        .eq('client_secret', clientSecret);

      if (error || !data || data.length === 0) {
        // Limpar dados de autenticação
        setAccessToken(null);
        setClientId(''); // Limpar o clientId
        setClientSecret(''); // Limpar o clientSecret
        alert('Você não está autenticado! O registro foi removido ou está inválido.');

        // Limpar o cache
        localStorage.clear();
        sessionStorage.clear();

        // Recarregar a página para limpar qualquer dado em cache
        window.location.reload();
      } else {
        console.log('Usuário autenticado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao verificar a autenticação:', error);
      setAccessToken(null); // Limpa o token de acesso caso ocorra algum erro
      setClientId(''); // Limpar o clientId
      setClientSecret(''); // Limpar o clientSecret

      // Limpar o cache
      localStorage.clear();
      sessionStorage.clear();

      // Recarregar a página para limpar qualquer dado em cache
      window.location.reload();
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
    // Verificar se todos os campos estão preenchidos
    if (!accountType || !name || !document) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
  
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

      // Verificar a autenticação a cada 10 segundos
      const intervalId = setInterval(() => {
        checkAuthentication();
      }, 10000); // 10 segundos

      // Limpar o intervalo quando o componente for desmontado ou o accessToken for removido
      return () => clearInterval(intervalId);
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
```

## Login.js.

```bash
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";  // Importar a biblioteca js-cookie

const Login = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://mock-ica.aquarela.win/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.access_token);
        Cookies.set("clientId", clientId, { expires: 7 }); // Armazena o clientId no cookie por 7 dias
        navigate("/dashboard");
      } else {
        alert("Erro no login: " + data.message);
      }
    } catch (error) {
      alert("Erro de rede: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img 
        src="https://icabank.com.br/static/media/Logo.6e249b4f.svg" 
        alt="Logo ICABank" 
        className="w-48 h-48 mr-4" 
      />
      <h1 className="text-2xl font-bold mb-4">Login na Conta</h1>
      <input
        type="text"
        placeholder="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      />
      <input
        type="password"
        placeholder="Client Secret"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        className="p-2 border rounded mb-4 w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Entrar
      </button>
    </div>
  );
};

export default Login;
```

### Transaction - Transferencia

```bash
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
```

### AccountSummary - Resumo das Contas Abertas

```bash
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
```


### Statement - Extrato de Contas.

```bash
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
```

### No TotalBalance

```bash
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
```

### E para visualizar os prints vá em;

painel-bancario/public
- Pasta: Print Dashboard
- Pasta: Print Postman


### Links

#### Painel Bancário
- http://localhost:3000/

#### Login
- http://localhost:3000/login

#### Dashboard
- http://localhost:3000/dashboard

#### Extrato
- http://localhost:3000/statement

#### Transferência
- http://localhost:3000/transaction

#### Resumo das contas abertas
- http://localhost:3000/account-summary

#### Saldo total de todas as contas
- http://localhost:3000/total-balance