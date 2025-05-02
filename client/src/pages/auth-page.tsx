import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import { AppContext } from '@/context/app-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, login, register: registerUser } = useContext(AppContext);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && user.id) {
      navigate('/');
    }
  }, [user, navigate]);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await apiRequest('POST', '/api/auth/login', values);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to DTFS!',
        variant: 'default',
      });
      
      // In a real app, we would update the user context here
      // This is just for demo purposes
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Force reload to simulate login state change
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      // Remove confirmPassword since it's not part of our API schema
      const { confirmPassword, ...userData } = values;
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created! You can now log in.',
        variant: 'default',
      });
      setActiveTab('login');
      loginForm.setValue('username', registerForm.getValues('username'));
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was a problem creating your account.',
        variant: 'destructive',
      });
    },
  });

  // Form submission handlers
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back to DTFS!',
        variant: 'default',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Remove confirmPassword since it's not part of our API schema
      const { confirmPassword, ...userData } = values;
      await registerUser(userData);
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created! You can now log in.',
        variant: 'default',
      });
      setActiveTab('login');
      loginForm.setValue('username', registerForm.getValues('username'));
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was a problem creating your account.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Authentication forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome to DTFS
            </CardTitle>
            <CardDescription>
              Digital Trade Finance System for global commerce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account?</span>{' '}
                  <button 
                    onClick={() => setActiveTab('register')} 
                    className="text-primary hover:underline transition-all font-medium"
                  >
                    Register now
                  </button>
                </div>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              autoComplete="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field} 
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm your password" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">Already have an account?</span>{' '}
                  <button 
                    onClick={() => setActiveTab('login')} 
                    className="text-primary hover:underline transition-all font-medium"
                  >
                    Sign in
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <Separator className="my-2" />
            <div className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our
              <button className="text-primary mx-1 hover:underline">Terms of Service</button>
              and
              <button className="text-primary mx-1 hover:underline">Privacy Policy</button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 flex flex-col justify-center items-center hidden md:flex">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Digital Trade Finance System</h1>
            <p className="text-xl opacity-90">
              Your gateway to seamless international trade and finance management.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Global Trade Marketplace</h3>
                <p className="opacity-80">Connect with trusted partners worldwide for importing and exporting goods</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Secure Payment Solutions</h3>
                <p className="opacity-80">Manage transactions with escrow services and dispute resolution</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Trade Finance Options</h3>
                <p className="opacity-80">Access factoring, import/export financing, and supply chain funding</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Professional Training</h3>
                <p className="opacity-80">Learn international trade best practices and compliance requirements</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <blockquote className="text-lg italic">
              "DTFS has revolutionized how we manage our cross-border trade operations and financing needs."
            </blockquote>
            <p className="text-sm mt-2 font-medium">— John Smith, CEO of Global Imports</p>
          </div>
        </div>
      </div>
    </div>
  );
}