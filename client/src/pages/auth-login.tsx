import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { RegistrationForm } from "@/components/auth/registration-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Zap, Users } from "lucide-react";

export default function AuthLoginPage() {
  const { signIn, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Digital Trade Finance System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connecting African traders with global opportunities through secure, 
              AI-powered trade finance solutions.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Global Marketplace</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access buyers and suppliers across Africa and beyond
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Transactions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Blockchain-powered escrow and smart contracts
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart recommendations and market analytics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-Role Platform</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tailored experiences for traders, financiers, and logistics providers
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Exporters</Badge>
            <Badge variant="secondary">Buyers</Badge>
            <Badge variant="secondary">Financiers</Badge>
            <Badge variant="secondary">Logistics</Badge>
            <Badge variant="secondary">Trade Agents</Badge>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your DTFS account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Signing in..." : "Continue with Google"}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      New to DTFS?{" "}
                      <button 
                        onClick={() => setActiveTab("register")}
                        className="text-blue-600 hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <RegistrationForm 
                onSuccess={() => {
                  // Registration successful, user will be redirected automatically
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}