import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// In a real app, we would use proper auth storage like localStorage or a secure cookie
// For demo purposes only - this variable persists during the session
let isAuthenticated = false;

// Admin authentication hook
export function useAdminAuth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const checkAuth = async () => {
    try {
      // Check authentication status from server
      const response = await fetch('/api/admin/auth-check');
      const data = await response.json();
      
      if (!data.isAuthenticated) {
        navigate("/admin/login");
        return false;
      }
      
      isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/admin/login");
      return false;
    }
  };
  
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        isAuthenticated = data.isAuthenticated;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      isAuthenticated = false;
      navigate("/admin/login");
    }
  };
  
  return { checkAuth, login, logout, isAuthenticated };
}

export default useAdminAuth;