import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Layout from "./components/Layout";
import PlanLayout from './components/PlanLayout';
import RecipesPage from './components/RecipesPage';
import PlanPage from './components/PlanPage';
import SignPage from './components/SignPage';
import Missing from './components/Missing';
import LoginPage from './components/LoginPage';
import HomePage from "./components/HomePage";
import PantryPage from "./components/PantryPage";
import ProtectedRoute from './components/ProtectedRoute';
import RecipeEdit from './components/RecipeEdit'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AuthLayout from './components/AuthLayout';


const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={'/'}>
        <Routes>
          <Route path ='/' element={<AuthLayout/>}>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='sign' element={<SignPage/>}/>
            <Route path="*" element={<Missing />} />
          </Route>
          <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>}/>
              <Route path="pantry" element={<ProtectedRoute> <PantryPage /> </ProtectedRoute>}/>
              <Route path="plan" element={<PlanLayout />}>
                <Route path="" element={<ProtectedRoute> <PlanPage /> </ProtectedRoute>} />
              </Route>
              <Route path="recipes/:name" element={<ProtectedRoute> <RecipeEdit/> </ProtectedRoute>} />
              <Route path="recipes" element={<ProtectedRoute> <RecipesPage /> </ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter> 
    </QueryClientProvider>

  );
}

export default App