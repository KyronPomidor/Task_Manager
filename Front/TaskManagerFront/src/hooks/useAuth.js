// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("Auth state changed:", currentUser?.email || currentUser?.uid || null);
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export default useAuth;