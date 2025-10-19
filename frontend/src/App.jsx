import React, { useState } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PriceListTable from './components/PriceListTable';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          <PriceListTable />
        </main>
      </div>
    </div>
  );
}