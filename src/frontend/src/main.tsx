import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './store/useThemeStore.tsx'
import { DynamicAntdProvider } from './DynamicAntdProvider.tsx'
import './index.css'
import './themes.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DynamicAntdProvider>
        <App />
      </DynamicAntdProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
