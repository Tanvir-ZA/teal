import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (error) {
        console.log("ADMIN CHECK ERROR:", error);
        setLoading(false);
        return;
      }

      setIsAdmin(data === true);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Checking access...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;