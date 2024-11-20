import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Statement from "./components/Statement";
import Transaction from "./components/Transaction";
import CreateAccountAdmin from "./components/CreateAccountAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateAccountAdmin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
};

export default App;
