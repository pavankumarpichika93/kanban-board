import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import KanbanBoard from './KanbanBoard';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KanbanBoard />
  </React.StrictMode>
);
reportWebVitals();
