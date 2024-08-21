import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { ThemeProvider } from '@pexip/components'

import '@pexip/components/src/fonts.css'
import '@pexip/components/dist/style.css'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <ThemeProvider colorScheme="light">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
