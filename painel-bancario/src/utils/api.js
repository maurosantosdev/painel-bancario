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

// export const fetchAccounts = async (accessToken) => {
//   try {
//     const response = await axios.get('https://mock-ica.aquarela.win/account', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data; // Retorna a lista de contas
//   } catch (error) {
//     console.error('Erro ao buscar contas:', error);
//     return [];
//   }
// };

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
