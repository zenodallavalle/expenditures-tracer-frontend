import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from '/src/rdx/store';

import App from './App';
import Build from './Build';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/build" element={<Build />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
);
