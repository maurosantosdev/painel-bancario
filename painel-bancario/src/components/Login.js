import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
