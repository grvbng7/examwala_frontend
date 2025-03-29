import React from 'react';
import ReactDOM from 'react-dom/client';
import Lander from './components/common/Lander';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Lander/>
    </BrowserRouter>
  </React.StrictMode>
);
