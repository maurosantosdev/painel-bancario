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
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
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
    Dashboard.js
    AccountList.js
    AccountDetails.js
    TransactionHistory.js
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

## Vamos alterar o Dashboard para permitir login e mostrar o token de acesso.

```bash
// src/components/Dashboard.js
import React, { useState } from 'react';
import { login } from '../utils/api';

const Dashboard = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = async () => {
    const token = await login(clientId, clientSecret);
    setAccessToken(token);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Painel Bancário - Administrador</h1>
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
        <div className="mt-4">
          <h2 className="text-xl">Token de Acesso</h2>
          <p>{accessToken}</p>
        </div>
      )}
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
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

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
      `${API_URL}/auth/login`,
      { clientId, clientSecret },
      { headers: { 'X-Mock': 'true' } }
    );
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
```
## Exibindo as contas no Dashboard.

```bash
// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { login, fetchAccounts } from '../utils/api';

const Dashboard = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const handleLogin = async () => {
    const token = await login(clientId, clientSecret);
    setAccessToken(token);
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
      <h1 className="text-3xl font-bold">Painel Bancário - Administrador</h1>

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
        <div className="mt-4">
          <h2 className="text-xl">Contas Bancárias</h2>
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

## De novo no Dashboard, agora vou adicionar o formulário para criação da conta.

```bash
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
      <h1 className="text-3xl font-bold">Painel Bancário - Administrador</h1>

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
```

## Estrutura final do App.js

```bash
// src/App.js
import React from 'react';
import Dashboard from './components/Dashboard'; // Importa o componente de Dashboard

function App() {
  return (
    <div className="App">
      <Dashboard /> {/* Renderiza o painel do administrador */}
    </div>
  );
}

export default App;
```

### Para realizar a transação.

Vá em: /components/Transaction.js
Na linha 18, substitua pelo ID da conta do titular.

```bash
sourceAccountId: "6a2a53f7-4002-4ec3-9d03-c06e322ca5b1",
```

### Para visualizar o Extrato.

Vá em: /components/Statement.js
Na linha 9, adicione o mesmo ID da conta do titular.

```bash
const response = await fetch("https://mock-ica.aquarela.win/account/6a2a53f7-4002-4ec3-9d03-c06e322ca5b1/statement"
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