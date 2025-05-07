import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and dashes'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/.*[A-Z].*/, 'Password must contain at least one uppercase letter')
    .regex(/.*[a-z].*/, 'Password must contain at least one lowercase letter')
    .regex(/.*\d.*/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  company: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(['importer', 'exporter', 'both']),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loginMutation, registerMutation, user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Setup login form with validation
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Setup registration form with validation
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      country: '',
      role: 'both',
      terms: false,
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  // Handle registration form submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, terms, ...registrationData } = values;
    
    registerMutation.mutate(registrationData);
  };

  // Detect when redirecting to show a loading state
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        setLocation('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, setLocation]);

  return (
    <div className="min-h-screen flex">
      {/* Left side: Auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="font-heading font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-neutral-800">DTFS</h1>
              <div className="text-sm text-neutral-500">Digital Trade Finance System</div>
            </div>
          </div>

          {isRedirecting ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center py-10">
                  <CheckCircle2 className="h-16 w-16 text-primary mb-4 animate-bounce" />
                  <h2 className="text-xl font-semibold mb-2">Authentication Successful</h2>
                  <p className="text-neutral-600 mb-4">Redirecting you to the dashboard...</p>
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
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

                        <div className="flex items-center justify-between">
                          <FormField
                            control={loginForm.control}
                            name="rememberMe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">Remember me</FormLabel>
                              </FormItem>
                            )}
                          />
                          <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Login
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Separator className="my-4" />
                    <div className="text-sm text-center text-neutral-600">
                      Don't have an account?{' '}
                      <button 
                        className="text-primary hover:underline font-medium" 
                        onClick={() => setActiveTab('register')}
                      >
                        Create one now
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Join DTFS to access trade finance solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
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
                                  <Input placeholder="Choose a username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  {...field} 
                                  autoComplete="email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>I am a</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="importer">Importer</SelectItem>
                                  <SelectItem value="exporter">Exporter</SelectItem>
                                  <SelectItem value="both">Both Importer & Exporter</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-neutral-50 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the{' '}
                                  <a href="#" className="text-primary hover:underline">
                                    Terms of Service
                                  </a>{' '}
                                  and{' '}
                                  <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full"
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
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Separator className="my-4" />
                    <div className="text-sm text-center text-neutral-600">
                      Already have an account?{' '}
                      <button 
                        className="text-primary hover:underline font-medium" 
                        onClick={() => setActiveTab('login')}
                      >
                        Log in here
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Right side: Promotional content */}
      <div className="hidden lg:block lg:w-1/2 bg-primary-700">
        <div className="h-full p-8 flex flex-col justify-center items-center text-white">
          <div className="max-w-lg text-center mb-8">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Streamline Your Trade Finance Operations
            </h2>
            <p className="mb-8 text-primary-100">
              DTFS provides a secure, end-to-end digital platform for all your trade finance needs, 
              connecting exporters and importers worldwide while ensuring fast, secure transactions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <span className="material-icons mr-2">payments</span>
                  <h3 className="font-medium">Secure Payments</h3>
                </div>
                <p className="text-sm text-primary-100">Blockchain-secured transactions with full audit trail</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <span className="material-icons mr-2">verified</span>
                  <h3 className="font-medium">Verified Partners</h3>
                </div>
                <p className="text-sm text-primary-100">Trade with confidence through our verified network</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <span className="material-icons mr-2">bolt</span>
                  <h3 className="font-medium">Fast Approval</h3>
                </div>
                <p className="text-sm text-primary-100">Get finance approvals in as little as 24 hours</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <span className="material-icons mr-2">local_shipping</span>
                  <h3 className="font-medium">Global Reach</h3>
                </div>
                <p className="text-sm text-primary-100">Connect with trading partners across Africa and beyond</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-auto">
            <div className="flex items-center">
              <span className="material-icons text-primary-300 mr-2">check_circle</span>
              <span className="text-sm text-primary-100">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-primary-300 mr-2">check_circle</span>
              <span className="text-sm text-primary-100">PAPSS Integrated</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-primary-300 mr-2">check_circle</span>
              <span className="text-sm text-primary-100">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}