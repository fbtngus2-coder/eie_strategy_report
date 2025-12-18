import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputPage from './pages/InputPage';
import StrategyPage from './pages/StrategyPage';



import MarketingPage from './pages/MarketingPage';
import SavedReportsPage from './pages/SavedReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="input" element={<InputPage />} />
          <Route path="strategy" element={<StrategyPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="saved-reports" element={<SavedReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
