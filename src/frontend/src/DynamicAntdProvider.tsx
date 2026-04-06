import React, { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from './store/useThemeStore';

/**
 * 动态 Ant Design 主题配置
 * 根据 current theme 自动切换 dark/light algorithm 和 token 颜色
 */
export const DynamicAntdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: currentTheme } = useTheme();
  const isCyber = currentTheme === 'cyber';

  const antdTheme = useMemo(() => ({
    algorithm: isCyber ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: isCyber ? {
      // Cyber Dark Theme
      colorPrimary: '#58a6ff',
      colorBgContainer: '#1c2128',
      colorBgElevated: '#161b22',
      colorBorder: 'rgba(255,255,255,0.10)',
      colorText: '#f0f6fc',
      colorTextSecondary: '#8b949e',
      colorTextPlaceholder: '#6e7681',
      colorBgSpotlight: '#161b22',
      controlItemBgHover: 'rgba(255,255,255,0.05)',
      controlItemBgActive: 'rgba(88,166,255,0.15)',
      colorBorderSecondary: '#30363d',
      borderRadius: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    } : {
      // Industrial Light Theme
      colorPrimary: '#cc5200',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#f5f4f0',
      colorBorder: '#d4d0c8',
      colorText: '#1a1a1a',
      colorTextSecondary: '#666666',
      colorTextPlaceholder: '#999999',
      colorBgSpotlight: '#ffffff',
      controlItemBgHover: 'rgba(0,0,0,0.03)',
      controlItemBgActive: 'rgba(204,82,0,0.08)',
      colorBorderSecondary: '#e8e6e1',
      borderRadius: 6,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    components: isCyber ? {
      // Cyber component overrides
      Card: {
        colorBgContainer: '#1c2128',
        colorBorderSecondary: '#30363d',
        colorText: '#f0f6fc'
      },
      Input: {
        colorBgContainer: '#0d1117',
        colorBorder: '#30363d',
        colorText: '#f0f6fc',
        colorTextPlaceholder: '#6e7681'
      },
      InputNumber: {
        colorBgContainer: '#0d1117',
        colorBorder: '#30363d',
        colorText: '#f0f6fc'
      },
      Select: {
        colorBgContainer: '#0d1117',
        colorBorder: '#30363d',
        colorText: '#f0f6fc',
        colorTextPlaceholder: '#6e7681',
        optionSelectedColor: '#58a6ff',
        optionSelectedBg: 'rgba(88,166,255,0.15)'
      },
      Button: {
        colorText: '#f0f6fc',
        colorBgContainer: '#1c2128',
        colorBorder: '#30363d',
        primaryColor: '#ffffff',
        colorPrimaryBg: '#238636',
        colorPrimaryHover: '#2ea043',
        colorPrimaryBorder: '#238636',
      },
      Collapse: {
        colorBgContainer: '#1c2128',
        colorText: '#f0f6fc',
        colorTextHeading: '#f0f6fc'
      },
      Tabs: {
        colorText: '#8b949e',
        colorTextSelected: '#58a6ff',
        colorTextHover: '#f0f6fc',
        inkBarColor: '#58a6ff',
      },
      Tree: {
        colorBgContainer: '#1c2128',
        colorText: '#f0f6fc',
        colorTextSelected: '#58a6ff',
      },
      Tooltip: {
        colorBg: '#161b22',
        colorText: '#f0f6fc',
        colorTextLightSolid: '#f0f6fc',
      },
      Modal: {
        colorBg: '#1c2128',
        colorText: '#f0f6fc',
        colorTextHeading: '#f0f6fc',
        colorBorder: '#30363d',
      },
      Form: {
        labelColor: '#c9d1d9',
      },
      Switch: {
        colorText: '#f0f6fc',
      },
      Slider: {
        colorText: '#f0f6fc',
      },
      Checkbox: {
        colorText: '#f0f6fc',
      },
      Radio: {
        colorText: '#f0f6fc',
      },
      Tag: {
        colorText: '#f0f6fc',
      },
      Badge: {
        colorText: '#f0f6fc',
      },
      Divider: {
        colorText: '#f0f6fc',
        colorSplit: '#30363d',
      },
      Typography: {
        colorText: '#f0f6fc',
        colorTextHeading: '#f0f6fc',
        colorTextSecondary: '#8b949e',
      },
    } : {
      // Industrial component overrides
      Card: {
        colorBgContainer: '#ffffff',
        colorBorderSecondary: '#e8e6e1',
        colorText: '#1a1a1a',
        colorTextHeading: '#1a1a1a',
      },
      Input: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d4d0c8',
        colorText: '#1a1a1a',
        colorTextPlaceholder: '#999999'
      },
      InputNumber: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d4d0c8',
        colorText: '#1a1a1a'
      },
      Select: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d4d0c8',
        colorText: '#1a1a1a',
        colorTextPlaceholder: '#999999',
        optionSelectedColor: '#cc5200',
        optionSelectedBg: 'rgba(204,82,0,0.08)'
      },
      Button: {
        colorText: '#1a1a1a',
        colorBgContainer: '#f5f4f0',
        colorBorder: '#d4d0c8',
        primaryColor: '#ffffff',
        colorPrimaryBg: '#cc5200',
        colorPrimaryHover: '#e05e00',
        colorPrimaryBorder: '#cc5200',
      },
      Collapse: {
        colorBgContainer: '#ffffff',
        colorText: '#1a1a1a',
        colorTextHeading: '#1a1a1a'
      },
      Tabs: {
        colorText: '#666666',
        colorTextSelected: '#cc5200',
        colorTextHover: '#1a1a1a',
        inkBarColor: '#cc5200',
      },
      Tree: {
        colorBgContainer: '#ffffff',
        colorText: '#1a1a1a',
        colorTextSelected: '#cc5200',
      },
      Tooltip: {
        colorBg: '#1a1a1a',
        colorText: '#f5f4f0',
        colorTextLightSolid: '#f5f4f0',
      },
      Modal: {
        colorBg: '#ffffff',
        colorText: '#1a1a1a',
        colorTextHeading: '#1a1a1a',
        colorBorder: '#d4d0c8',
      },
      Form: {
        labelColor: '#3a3a3a',
      },
      Switch: {
        colorText: '#1a1a1a',
      },
      Slider: {
        colorText: '#1a1a1a',
      },
      Checkbox: {
        colorText: '#1a1a1a',
      },
      Radio: {
        colorText: '#1a1a1a',
      },
      Tag: {
        colorText: '#1a1a1a',
      },
      Badge: {
        colorText: '#1a1a1a',
      },
      Divider: {
        colorText: '#1a1a1a',
        colorSplit: '#d4d0c8',
      },
      Typography: {
        colorText: '#1a1a1a',
        colorTextHeading: '#1a1a1a',
        colorTextSecondary: '#666666',
      },
    }
  }), [isCyber]);

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
};
