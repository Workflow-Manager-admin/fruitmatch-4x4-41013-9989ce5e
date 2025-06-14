import React from 'react';
import './App.css';
import FruitMatch4x4 from './FruitMatch4x4';

// No direct usage of PUBLIC_URL found, no changes necessary here

function App() {
  return (
    <div className="app" style={{ minHeight: "100vh", background: "#f8faf7" }}>
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "#4CAF50" }}>*</span> FruitMatch
            </div>
            <span className="subtitle" style={{ color: '#FF5722', fontSize: '1.05em', fontWeight: 600 }}>
              Modern React 4x4 Memory Game
            </span>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ paddingTop: 100 }}>
          <FruitMatch4x4 />
        </div>
      </main>
    </div>
  );
}

export default App;