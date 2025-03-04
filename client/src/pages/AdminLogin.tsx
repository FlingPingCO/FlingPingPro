import { useState } from "react";
import { useLocation, useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole } from "lucide-react";

// In a real app, we would use proper auth storage like localStorage or a secure cookie
// For demo purposes only - this variable persists during the session
let isAuthenticated = false;

// Simple admin authentication for demo purposes
export function useAdminAuth() {
  const [, navigate] = useLocation();
  
  const checkAuth = () => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return false;
    }
    return true;
  };
  
  const login = (password: string) => {
    // In a real app, this would be a secure backend call
    const isValid = password === "flingping-admin-2025"; // Simple hard-coded password for demo
    if (isValid) {
      isAuthenticated = true;
    }
    return isValid;
  };
  
  const logout = () => {
    isAuthenticated = false;
    navigate("/admin/login");
  };
  
  return { checkAuth, login, logout, isAuthenticated };
}

export default function AdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay for a more realistic feel
    setTimeout(() => {
      const isSuccess = login(password);
      
      if (isSuccess) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin/blog");
      } else {
        toast({
          title: "Authentication failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your admin password to access the blog management interface
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}