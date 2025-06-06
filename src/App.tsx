import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { TokenGateForm } from './components/TokenGateForm';
import { TestnetTokenGateForm } from './components/TestnetTokenGateForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mainnet" element={<TokenGateForm />} />
          <Route path="/testnet" element={<TestnetTokenGateForm />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;