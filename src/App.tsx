import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Rota Principal */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rotas de Produtos */}
      <Route path="/products" element={<ProductsPage />} />
      
      {/* Rota 404 - Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
