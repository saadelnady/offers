import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider, DarkModeProvider } from './contexts';
import { HashRouter } from 'react-router-dom';
import MenuProvider from './contexts/Menu.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <HashRouter basename='/'>
          <MenuProvider>
            <App />
          </MenuProvider>
        </HashRouter>
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
