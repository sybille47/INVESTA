import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <>
    <img src="./assets/investaLogo.png" alt="" />
    <div className="App">
      <header>
        </header>
      <main>{children}</main>
    </div>
    </>
  );
}

export default Layout;