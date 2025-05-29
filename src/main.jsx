import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css';

import React from 'react'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/*<ChakraProvider>*/}
        <Router>
            <App />
        </Router>
        {/*</ChakraProvider>*/}
    </React.StrictMode>,
)
