import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileForm from "./component/data/ProfileForm";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfileForm /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
