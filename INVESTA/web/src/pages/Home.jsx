import { useAuth0 } from "@auth0/auth0-react";
import Button from "../component/ui/button";
import ProjectInfoCard from "../component/data/ProjectInfoCard";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);



function HomePage() {
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();

  const testApiCall = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:3000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert(`API call failed: ${res.status}`);
        return;
      }

      const data = await res.json();
      alert(`API call successful: ${data?.message || res.status}`);
    } catch (err) {
      alert(`API call error: ${err.message}`);
    }
  };

  return (
    <>
    <div className="home-container">
      <img src="../component/data/assets/investaLogo.png" alt="" />
      <h1 className="login-page text-4xl font-bold mb-6">Welcome to Investa</h1>

      {/* {isAuthenticated && (
        <> */}
          {/* <h2>Welcome, {user?.name}!</h2> */}
          {/* <p>Auth0 ID: {user?.sub}</p> */}
          {/* <Button onClick={testApiCall}>Test API Call</Button> */}
        {/* </>
      )} */}

      <ProjectInfoCard/>

      {!isAuthenticated && (
        <>
        <Button onClick={() => loginWithRedirect()} className="login-btn">Log In</Button>
        </>
      )}

      {isAuthenticated && <p>Your fund portfolio information will be shown here once you have placed your first order.</p>}
    </div>
    </>
  );
}

export default HomePage;