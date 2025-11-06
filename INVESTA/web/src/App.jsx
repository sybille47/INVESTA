import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./component/Layout";
import ProtectedRoute from "./component/ProtectedRoute";
import TopNav from "./component/data/TopNav";
import Charts from "./component/data/Charts";
import ProjectDocumentation from "./component/data/Documentation";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import FundListPage from "./pages/FundListPage.jsx";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderHistory from "./pages/OrderHistory";
import { useFundList } from "./hooks/useFundList";
import { Toaster } from "react-hot-toast";
import SubNavBar from "./component/data/SubNavBar";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const { hasFunds, loading: fundsLoading } = useFundList();

  if (isLoading || (isAuthenticated && fundsLoading)) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppContent />
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

// ⬇️ Split out main app content so we can use useLocation()
function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth0();

  const { hasFunds } = useFundList();

  // Only show NavBar if NOT on "/" route
  const showNavBar = location.pathname !== "/";

  return (
    <Layout>
      {showNavBar && isAuthenticated && <TopNav />}
      <SubNavBar />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated || hasFunds ? (
              <Navigate to="/funds" replace />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/funds"
          element={
            <ProtectedRoute>
              <FundListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <Charts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placeOrder"
          element={
            <ProtectedRoute>
              <PlaceOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div style={{ padding: 20 }}>
              No routes matched location. Try /funds or /charts
            </div>
          }
        />
        <Route
          path="/documentation"
          element={
            // <ProtectedRoute>
            <ProjectDocumentation />
            // {/* </ProtectedRoute> */}
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
