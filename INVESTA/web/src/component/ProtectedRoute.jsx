import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth0();

  try {
    console.log(
      "ProtectedRoute: isAuthenticated=",
      isAuthenticated,
      "children=",
      children && children.type
        ? children.type.name || children.type
        : typeof children
    );
  } catch (e) {
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
