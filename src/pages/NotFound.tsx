
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-voluntus-gray-light p-4">
      <div className="bg-white rounded-xl shadow-md p-8 md:p-12 max-w-md w-full text-center">
        <div className="text-6xl font-bold text-voluntus-blue mb-6">404</div>
        <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
        <p className="text-voluntus-text-secondary mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="btn btn-primary">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
