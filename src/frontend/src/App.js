import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { Login, Signup } from "./pages";
import Home from "./pages/Home";
import { useState, useEffect } from 'react';
import Landing from "./pages/Landing";
import axios from "axios";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
console.log('isAuthenticated', isAuthenticated)
console.log('isLoading', isLoading)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const routes = useRoutes([
    { path: '/', element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/home', element: <Home /> },
    { path: '*', element: <h1>404 Not Found</h1> },
  ]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {routes}
    </>
  );
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  console.log('navigate', navigate)
  useEffect(() => {
    // Use Axios to verify the token via API
    axios.get("http://localhost:5000/verify", {
      withCredentials: true, // Ensure credentials (cookies) are sent
    })
    .then((res) => {
      console.log('res.....', res)
      if (res.data.user) {
        localStorage.setItem('username', (res.data.user.username));
        setIsAuthenticated(true);
      // Redirect to home if logged in
      } else {
        setIsAuthenticated(false); // Set authentication to false if not logged in
      }
    })
    .catch(() => {
      setIsAuthenticated(false); // Handle any errors, set authentication to false
    })
    .finally(() => {
      setIsLoading(false); // Mark loading as done regardless of success or failure
    });
  }, [navigate]);

  return { isAuthenticated, isLoading };
};

export default App;