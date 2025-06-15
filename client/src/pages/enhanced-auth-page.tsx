import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Globe, Shield, Building2, Users, Wallet } from "lucide-react";

export default function EnhancedAuthPage() {
  const [, navigate] = useLocation();
  const { user, signIn, loading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      toast({
        title: "Welcome to DTFS!",
        description: "You have successfully signed in with Google.",
      });
      navigate('/');
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side: Features showcase */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-heading font-bold text-2xl">D</span>
              </div>
              <div>
                <h1 className="font-heading font-bold text-4xl text-neutral-800">DTFS</h1>
                <div className="text-lg text-neutral-600">Digital Trade Finance System</div>
              </div>
            </div>
            <p className="text-xl text-neutral-700 mb-8">
              Revolutionizing African trade finance with blockchain technology and AI-powered assistance
            </p>
          </div>

          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-800">Smart Trade Finance</h3>
                <p className="text-neutral-600">Automated invoice factoring and supply chain finance with blockchain smart contracts</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-800">Multi-Party Marketplace</h3>
                <p className="text-neutral-600">Connect exporters, buyers, logistics providers, and financiers in one platform</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-800">KYC/KYB Verification</h3>
                <p className="text-neutral-600">Secure identity verification for individuals and businesses across Africa</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-800">Multi-Language Support</h3>
                <p className="text-neutral-600">Available in English, French, Swahili, Arabic, and Hausa for seamless communication</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side: Authentication */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex items-center justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Welcome to DTFS</CardTitle>
                <CardDescription className="text-base mt-2">
                  Sign in with your Google account to access the platform
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-12 text-base bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>

              <div className="text-center space-y-4">
                <div className="text-sm text-neutral-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-2">
                    Secure & Trusted Platform
                  </div>
                  <div className="text-xs text-blue-600">
                    Your data is protected with enterprise-grade security and compliance standards
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}