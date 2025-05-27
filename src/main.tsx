import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId1 = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId1);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId={clientId1}>
    <App/>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
