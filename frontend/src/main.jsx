// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { theme } from './components/theme'
import { Notifications } from '@mantine/notifications'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </MantineProvider>
  </React.StrictMode>
)
