"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
export default function useAuthRole(allowedRoles = []) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const router = useRouter();

  const stableRoles = useMemo(() => allowedRoles, [JSON.stringify(allowedRoles)]);

  useEffect(() => {
    try {
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)

      const token = window.localStorage.getItem("token");

      if (!token) {
        setIsAuthorized(false);
        router.push("/login");
        return;
      }

      const decoded = JSON.parse(atob(token.split(".")[1] || ""));
      setDecodedToken(decoded);

      const userRole = decoded?.role;
      const hasPermission = stableRoles.includes(userRole);

      setIsAuthorized(hasPermission);

      if (!hasPermission) {
        router.push("/not-allowed");
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setIsAuthorized(false);
      router.push("/login");
    }
  }, [router, stableRoles]);

  return { isAuthorized, decodedToken }
}
