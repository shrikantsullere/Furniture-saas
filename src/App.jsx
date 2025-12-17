import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/orders/Orders";
import ProductionSheet from "./pages/production/ProductionSheet";
import LabelGenerator from "./pages/labels/LabelGenerator";
import Integrations from "./pages/integrations/Integrations";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/pending" element={<Orders />} />
                      <Route path="/production" element={<ProductionSheet />} />
                      <Route path="/labels" element={<LabelGenerator />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/integrations/amazon" element={<Integrations />} />
                      <Route path="/integrations/ebay" element={<Integrations />} />
                      <Route path="/integrations/shopify" element={<Integrations />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
