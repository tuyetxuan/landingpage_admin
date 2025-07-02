import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import App from './App';
import React from 'react';

const __root = ReactDOM.createRoot(document.getElementById('__root'));

__root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
