import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from "./redux/store.jsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import axios from 'axios';

axios.defaults.withCredentials = true;




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, }}>
          <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
