import React from 'react';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';  // Move Router here
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router> {/* Wrap the entire App with Router */}
      <AppRoutes />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </Router>
  );
}

export default App;
