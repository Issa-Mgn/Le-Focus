import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import AllArticles from './pages/AllArticles';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import DebugArticles from './pages/DebugArticles';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewArticle from './pages/AdminNewArticle';
import AdminArticles from './pages/AdminArticles';
import AdminSettings from './pages/AdminSettings';
import OrderInsertion from './pages/OrderInsertion';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// Wrapper for Main Layout Routes
const MainRoute = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

// Wrapper for Admin Layout Routes
const AdminRoute = ({ children }) => (
  <AdminLayout>{children}</AdminLayout>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainRoute><Home /></MainRoute>} />
      <Route path="/article/:id" element={<MainRoute><ArticleDetail /></MainRoute>} />
      <Route path="/search" element={<MainRoute><SearchResults /></MainRoute>} />
      <Route path="/category/:category" element={<MainRoute><CategoryPage /></MainRoute>} />
      <Route path="/articles" element={<MainRoute><AllArticles /></MainRoute>} />
      <Route path="/about" element={<MainRoute><About /></MainRoute>} />
      <Route path="/contact" element={<MainRoute><Contact /></MainRoute>} />
      <Route path="/order-insertion" element={<MainRoute><OrderInsertion /></MainRoute>} />
      <Route path="/debug" element={<DebugArticles />} />
      
      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminRoute><AdminDashboard /></AdminRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/articles" 
        element={
          <ProtectedRoute>
            <AdminRoute><AdminArticles /></AdminRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/new-article" 
        element={
          <ProtectedRoute>
            <AdminRoute><AdminNewArticle /></AdminRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute>
            <AdminRoute><AdminSettings /></AdminRoute>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback - 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
