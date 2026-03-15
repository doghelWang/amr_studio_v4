import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider, theme, App as AntdApp } from 'antd'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00d2ff' } }}>
            <AntdApp>
                <App />
            </AntdApp>
        </ConfigProvider>
    </React.StrictMode>,
)
