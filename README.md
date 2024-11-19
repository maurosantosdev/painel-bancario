# Teste de Desenvolvedor de Painel Bancário

#@ NOVO! - Documentação da API

https://mock-ica.aquarela.win/api

Visão geral
Bem-vindo ao nosso teste de desenvolvedor! Este projeto tem como objetivo avaliar suas habilidades na criação de um dashboard bancário com acesso de administrador. Você trabalhará com uma API simulada de Banking as a Service (BaaS) localizada em https://mock-ica.aquarela.win/ .

Objetivo
Sua tarefa é criar um painel bancário que permita aos administradores:

Visualizar e criar contas bancárias
Ver extratos de conta
Veja um resumo das contas abertas
Visualizar o saldo total de todas as contas (simulando o valor total no banco de dados)
Além disso, como um recurso bônus, você pode criar uma interface de usuário para que os titulares de contas:

Entre na conta bancária deles
Realizar operações financeiras
Ver o extrato e o saldo da conta
Critérios de avaliação
Avaliaremos sua solução com base em:

Segurança
Usabilidade
Desempenho
Escalabilidade
Se você for um desenvolvedor full-stack, avaliaremos suas implementações de backend e frontend. Se você for especialista em uma área, daremos mais ênfase à sua expertise.

A consideração cuidadosa do cache e das medidas de segurança é crucial para componentes de front-end e back-end.

Pilha de tecnologia
Front-end
React (com Next.js, Remix ou similar)
Esbelto
Bibliotecas recomendadas:

Tailwind CSS para estilo
shadcn para componentes de IU
Framer Motion para animações
Back-end
Pitão
TypeScript (Node.js, Bun ou Deno)
Estrutura recomendada:

NinhoJS
Banco de dados
Sua escolha, incluindo opções gratuitas como Supabase

Documentação da API
A API BaaS simulada está disponível em https://mock-ica.aquarela.win/ . Aqui está uma visão geral dos endpoints disponíveis e seu uso:

Notas importantes
Você deve criar um locatário antes de acessar outras rotas.
O segredo do JWT é:758603a3-cb1c-4d3f-b4b4-aa8975236894
A chave pix é:pix@mock.icabank.com.br
Autenticação
Criar inquilino
PUBLICAR /tenant
Cabeçalhos :X-Mock: true
Resposta : Retorna detalhes do inquilino, incluindo clientIdeclientSecret
Conecte-se
PUBLICAR /auth/login
Corpo :
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}

Resposta : Retorna umaccess_token
Gerenciamento de contas
Todas as rotas de gerenciamento de contas exigem o seguinte cabeçalho:

Authorization: Bearer your_access_token
Criar uma conta
PUBLICAR /account
Corpo :
{
  "accountType": "PERSONAL" | "BUSINESS",
  "name": "Account Holder Name",
  "document": "Document Number"
}

Obter detalhes da conta
PEGAR /account/:id
Obter conta por documento
PEGAR /account/document/:document
Obter extrato de conta
PEGAR /account/:id/statement
Transações
Todas as rotas de transação exigem os seguintes cabeçalhos:

Authorization: Bearer your_access_token
X-Payer-Id: payer_document_number
Transferência TED
PUBLICAR /transaction/ted
Corpo :

{
  "accountId": "source_account_id",
  "amount": 500,
  "recipientName": "Recipient Name",
  "recipientDocument": "Recipient Document",
  "recipientBank": "Bank Code",
  "recipientBranch": "Branch Number",
  "recipientAccount": "Account Number"
}

PIX Encontrar Chave
PEGAR /transaction/pix/:pixKey
Transferência PIX
PUBLICAR /transaction/pix/:accountId/pay
Corpo :

{
  "amount": 200,
  "pixKey": "pix@example.com",
  "description": "its my description"
  "e2eId": "end_to_end_id"
}

Pagar boleto
PUBLICAR /transaction/billet
Corpo :
{
  "accountId": "source_account_id",
  "amount": 150,
  "billetCode": "billet_code",
  "dueDate": "YYYY-MM-DD"
}
Transferência interna
PUBLICAR /transaction/internal
Corpo :
{
  "amount": 100,
  "sourceAccountId": "source_account_id",
  "targetAccountId": "target_account_id"
}