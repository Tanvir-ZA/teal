import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================= */}
          {/* CUSTOMER WEBSITE */}
          {/* ========================= */}

          <Route
            path="/*"
            element={
              <>
                <Navbar />

                <Routes>
                  <Route
                    path="/"
                    element={<Home />}
                  />

                  <Route
                    path="/shop"
                    element={<Shop />}
                  />

                  <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                  />

                  <Route
                    path="/cart"
                    element={<Cart />}
                  />

                  <Route
                    path="/checkout"
                    element={<Checkout />}
                  />

                  <Route
                    path="/order-success"
                    element={<OrderSuccess />}
                  />
                </Routes>
              </>
            }
          />

          {/* ========================= */}
          {/* ADMIN LOGIN */}
          {/* ========================= */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          {/* ========================= */}
          {/* ADMIN DASHBOARD */}
          {/* ========================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ========================= */}
          {/* ADMIN PRODUCTS */}
          {/* ========================= */}

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;