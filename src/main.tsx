import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.tsx'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { ThemeProvider } from './components/shared/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
          </ThemeProvider>
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>

  </React.StrictMode>,
)
