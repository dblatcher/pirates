import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initalState } from './game-state/intial.ts'
import { buildMatrixFromGameState } from './lib/path-finding/build-matrix.ts'

const matrix = buildMatrixFromGameState(1000, 1000, initalState)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
