import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider, theme } from 'antd'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
            token: {
                colorPrimary: '#00d2ff',
                borderRadius: 10,
                colorBgContainer: '#0f1422',
                colorBgElevated: '#141a2e',
                colorBorder: 'rgba(255,255,255,0.10)',
                colorText: '#e8ecf4',
                colorTextSecondary: '#7d8aa6',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            },
            components: {
                Card: { colorBgContainer: 'transparent', colorBorderSecondary: 'transparent' },
                Input: { colorBgContainer: '#141a2e', colorBorder: 'rgba(255,255,255,0.10)' },
                InputNumber: { colorBgContainer: '#141a2e', colorBorder: 'rgba(255,255,255,0.10)' },
                Select: { colorBgContainer: '#141a2e', colorBorder: 'rgba(255,255,255,0.10)' },
                Collapse: { colorBgContainer: 'transparent' },
            }
        }}>
            <App />
        </ConfigProvider>
    </React.StrictMode>,
)
