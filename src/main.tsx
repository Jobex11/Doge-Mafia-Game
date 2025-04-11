
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/custom.css'
import { Toaster } from "@/components/ui/toaster"
import { TonConnectUIProvider } from '@tonconnect/ui-react'

// Console logs for debugging
console.log('Application starting with multilingual support')
console.log('Loading Mafia Mystery game mechanics...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://f9155e71-9ead-46bd-a3d5-c91d2f2a938c.lovableproject.com/tonconnect-manifest.json">
      <App />
      <Toaster />
    </TonConnectUIProvider>
  </React.StrictMode>,
)
