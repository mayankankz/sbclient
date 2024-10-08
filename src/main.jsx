import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { persistStore, persistReducer } from "redux-persist"; // Import persistStore and persistReducer
import storage from "redux-persist/lib/storage"; // Import the storage option
import rootReducer from "./store/reducer/rootReducer";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from '@tanstack/react-query'
  
  const queryClient = new QueryClient()
// const store = configureStore({
//   reducer: rootReducer,
// });
// Create the persistConfig
const persistConfig = {
  key: "root",
  storage,
};

// Create the persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer, // Use the persistedReducer
});

// Create the persisted store
export const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          
        </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </>
);
