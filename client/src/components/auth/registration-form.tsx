import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { Loader2, Mail, Phone } from "lucide-react";

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["exporter", "buyer", "logistics_provider", "financier", "agent"] as const),
  country: z.string().min(2, "Please select a country"),
  language: z.string().default("en"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [step, setStep] = useState<"details" | "verification">("details");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">("email");
  const [verificationCode, setVerificationCode] = useState("");
  const { signIn, loading } = useAuth();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      language: "en",
      role: "buyer",
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    try {
      // For now, proceed directly to verification step
      // In production, this would send OTP to email/phone
      setStep("verification");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleVerification = async () => {
    try {
      // Verify OTP code (mock for now)
      if (verificationCode.length === 6) {
        await signIn();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      onSuccess?.();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  if (step === "verification") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            We've sent a verification code to your {verificationMethod === "email" ? "email" : "phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Code</label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
          </div>
          <Button 
            onClick={handleVerification}
            disabled={verificationCode.length !== 6 || loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Account
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setStep("details")}
            className="w-full"
          >
            Back to Registration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Join DTFS to access digital trade finance services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or register manually</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+234 800 000 0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer/Importer</SelectItem>
                      <SelectItem value="exporter">Exporter/Seller</SelectItem>
                      <SelectItem value="logistics_provider">Logistics Provider</SelectItem>
                      <SelectItem value="financier">Financier/Bank</SelectItem>
                      <SelectItem value="agent">Trade Agent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="EG">Egypt</SelectItem>
                      <SelectItem value="MA">Morocco</SelectItem>
                      <SelectItem value="ET">Ethiopia</SelectItem>
                      <SelectItem value="UG">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Method</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={verificationMethod === "email" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVerificationMethod("email")}
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={verificationMethod === "sms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVerificationMethod("sms")}
                  className="flex-1"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  SMS
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}