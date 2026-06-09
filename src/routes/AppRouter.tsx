import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const HomePage = lazy(() => import('../pages/public/HomePage').then((module) => ({ default: module.HomePage })));
const MenuPage = lazy(() => import('../pages/public/MenuPage').then((module) => ({ default: module.MenuPage })));
const CheckoutPage = lazy(() => import('../pages/public/CheckoutPage').then((module) => ({ default: module.CheckoutPage })));
const SuccessPage = lazy(() => import('../pages/public/SuccessPage').then((module) => ({ default: module.SuccessPage })));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })));
const AdminDashboardPage = lazy(() =>
  import('../pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminOrdersPage = lazy(() =>
  import('../pages/admin/AdminOrdersPage').then((module) => ({ default: module.AdminOrdersPage })),
);
const AdminProductsPage = lazy(() =>
  import('../pages/admin/AdminProductsPage').then((module) => ({ default: module.AdminProductsPage })),
);
const AdminSettingsPage = lazy(() =>
  import('../pages/admin/AdminSettingsPage').then((module) => ({ default: module.AdminSettingsPage })),
);

function RouteLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink text-cream">
      <div className="rounded-lg border border-cream/10 bg-coal p-6 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cream/15 border-t-flame" />
        <p className="mt-4 text-sm font-bold text-cream/70">Cargando Rikki-Tikki...</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
