import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App as AntdApp } from 'antd';
const clientId1 = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId={clientId1}>
      <AntdApp>
      <App/>
    </AntdApp>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
