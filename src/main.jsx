import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Provider } from "react-redux";
import store from "./features/store.js";
import { AuthProvider } from './contexts/authContext.jsx';
import { SnackbarProvider } from 'notistack';
localStorage.clear();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={10} // Adjust the number of visible snackbars at a time
          autoHideDuration={5000} // Snackbar auto-hide duration
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Position of the Snackbar
        >
          
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
