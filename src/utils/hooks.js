import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Live admin/auth status backed by Firebase Auth + the users/{uid}.admin
// Firestore flag. Deliberately does NOT touch localStorage: the old
// localStorage 'USER' cache was writable from devtools, so any gate built on
// it (route guards, edit buttons) was decorative. `loading` stays true until
// the auth state and — when signed in — the Firestore role lookup resolve,
// so callers can hold rendering instead of flashing the wrong state on
// refresh.
export default function useAdmin() {
  const [status, setStatus] = useState({
    isAdmin: false,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (!cancelled) {
          setStatus({ isAdmin: false, isAuthenticated: false, loading: false });
        }
        return;
      }

      if (!cancelled) {
        setStatus({ isAdmin: false, isAuthenticated: true, loading: true });
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', currentUser.uid));
        const isAdmin = snapshot.exists() && snapshot.data().admin === true;
        if (!cancelled) {
          setStatus({ isAdmin, isAuthenticated: true, loading: false });
        }
      } catch (error) {
        console.error('useAdmin: role lookup failed', error);
        if (!cancelled) {
          setStatus({ isAdmin: false, isAuthenticated: true, loading: false });
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return status;
}
