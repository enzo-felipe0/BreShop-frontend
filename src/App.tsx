import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductFormPage from './pages/ProductFormPage';
import CartPage from './pages/CartPage.tsx';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import SalesHistoryPage from './pages/SalesHistoryPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota Principal */}
        <Route path="/" element={<HomePage />} />

        {/* Rotas Públicas (redirecionam para home se autenticado) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Produtos - Pública para todos verem, mas com funcionalidades restritas para não autenticados */}
        <Route path="/products" element={<ProductsPage />} />

        {/* Rota de cadastro de produto - Protegida */}
        <Route
          path="/seller/products/new"
          element={
            <ProtectedRoute>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
      {/* Rotas de exibição do histórico de compras e vendas (protegida)*/}
        <Route path="/comprador/historico" element={<ProtectedRoute><PurchaseHistoryPage /></ProtectedRoute>} />

        <Route path="/vendedor/historico" element={<ProtectedRoute><SalesHistoryPage /></ProtectedRoute>} />

        {/*Rota do carrinho*/}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Rota 404 - Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
