import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CatalogModal } from './components/layout/CatalogModal';
import { QuickBuyModal } from './components/common/QuickBuyModal';
import { Toast } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ComparePage } from './pages/ComparePage';
import { StoresPage } from './pages/StoresPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

import { PageTransition } from './components/common/PageTransition';

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 antialiased selection:bg-amber-300 selection:text-black">
          {/* Header */}
          <Header />

          {/* Mega-menu Catalog Modal */}
          <CatalogModal />

          {/* 1-Click Quick Buy Modal */}
          <QuickBuyModal />

          {/* Main Content View with Smooth Page Transition */}
          <main className="flex-1">
            <PageTransition>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </PageTransition>
          </main>

          {/* Toast Alerts */}
          <Toast />

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
