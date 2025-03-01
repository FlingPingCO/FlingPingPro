import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark">
      <Card className="w-full max-w-md mx-4 bg-[#3C3C3C] border-2 border-coral">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-coral mb-4" />
            <h1 className="text-2xl font-bold text-coral">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sand text-center mb-6">
            The page you're looking for isn't available. Let's get you back on track.
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="btn-primary bg-coral text-[#3c3c3c] hover:bg-coral/90 font-poppins font-medium text-center px-6 py-2 rounded-full">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
