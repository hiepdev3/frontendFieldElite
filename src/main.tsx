import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { App as AntdApp } from 'antd'
import { ConfigProvider } from 'antd'

import ReactGA from 'react-ga4'

const clientId1 = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GA_MEASUREMENT_ID = 'G-VPCVQ7Z17H' // ← Thay bằng ID của bạn

// Khởi tạo GA
ReactGA.initialize(GA_MEASUREMENT_ID)
ReactGA.send({ hitType: "pageview", page: window.location.pathname })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId1}>
      <ConfigProvider>
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
