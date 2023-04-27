import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { DARK_THEME, FontsVTBGroup, DropdownProvider, ToastProvider, Toast } from '@admiral-ds/react-ui'

import './index.css'
import { App } from './App'

import reportWebVitals from './reportWebVitals'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ThemeProvider theme={DARK_THEME}>
          <DropdownProvider>
            <FontsVTBGroup />
            <ToastProvider autoDeleteTime={3000}>
              <Toast style={{ top: 'calc(48px + 16px)' }} />
              <App />
            </ToastProvider>
          </DropdownProvider>
        </ThemeProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
)

reportWebVitals()
