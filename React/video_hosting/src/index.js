import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App'
import './css/main.css'


const page = document.getElementById('app')
const app = ReactDOMClient.createRoot(page)
app.render(<App />)