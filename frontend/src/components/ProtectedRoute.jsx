
import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Loader from "./ReusableComp/Loader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  const [auth, setAuth] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          if (active) {
            setAuth({ loading: false, user: null });
          }
          return;
        }

        // Replace this endpoint with your existing endpoint
        // that returns the authenticated user's profile.
        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (active) {
            setAuth({ loading: false, user: null });
          }
          return;
        }

        const result = await response.json();
        const user = result.user ?? result.data ?? result;

        if (active) {
          setAuth({ loading: false, user });
        }
      } catch {
        if (active) {
          setAuth({ loading: false, user: null });
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (auth.loading) {
    return <Loader 
                fullScreen
                message="Verifying The Person"/>;
  }

  if (!auth.user) {
    return (
      <Navigate
        to="/logIn"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    requiredRole &&
    String(auth.user.role).toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
