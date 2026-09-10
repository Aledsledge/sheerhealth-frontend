import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Routers from '../routs/Routers';
import { AuthProvider } from '../pages/AuthContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import useAdmin from '../utils/hooks';
import { auth } from '../firebase';
import SmoothScroll from '../components/SmoothScroll/SmoothScroll';

const Layout = () => {
  const [active] = useState('CBlog');
  const [user, setUser] = useState(null);
  const { isAdmin, isAuthenticated, loading: isAdminLoading } = useAdmin();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // user will be null when logged out or a user object when logged in
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log('Logged out successfully');
        setUser(null); // Reset the user state to null
      })
      .catch((error) => {
        console.log('Logout error:', error);
      });
  };

  return (
    <SmoothScroll>
      <Header active={active} user={user} logout={logout} isAdmin={isAdmin} /> {/* Pass logout and isAdmin as props to Header */}
      <ScrollToTop />
      <AuthProvider value={{ currentUser: user, isAdmin, isAuthenticated, isAdminLoading, timeActive: false, setTimeActive: () => {} }}>
        <main>
          <Routers />
        </main>
        <Footer />
      </AuthProvider>
    </SmoothScroll>
  );
};

export default Layout;
