import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';

// Disable React error overlay (red screen)
if (typeof window !== "undefined") {
  window.addEventListener("error", e => {
    e.preventDefault();
  });
  window.addEventListener("unhandledrejection", e => {
    e.preventDefault();
  });
}

// For Create React App / react-scripts
if (typeof window !== "undefined" && window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.dismissRuntimeErrors();
}

// Completely nuke the overlay
if (typeof window !== "undefined") {
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
    showRuntimeError: () => {},
    dismissRuntimeErrors: () => {},
  };
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
