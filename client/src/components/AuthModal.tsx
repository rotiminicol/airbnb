import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { AiOutlineApple } from "react-icons/ai";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const result = await apiRequest("POST", endpoint, data);
      
      if (result.ok) {
        const responseData = await result.json();
        localStorage.setItem("auth_token", responseData.token);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        
        toast({
          title: mode === "login" ? "Welcome back!" : "Account created!",
          description: mode === "login" ? "You've been logged in successfully" : "Your account has been created successfully",
        });
        
        onClose();
        window.location.reload(); // Refresh to update auth state
      } else {
        const error = await result.json();
        toast({
          title: "Error",
          description: error.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const socialProviders = [
    { name: "Google", icon: FaGoogle, color: "hover:bg-red-50" },
    { name: "Facebook", icon: FaFacebook, color: "hover:bg-blue-50" },
    { name: "Apple", icon: AiOutlineApple, color: "hover:bg-gray-50" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {mode === "login" ? "Log in" : "Sign up"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center text-xl font-semibold">
            Welcome to Airbnb
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
                <FormField
                  control={form.control}
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
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white" disabled={isLoading}>
                {isLoading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <Separator />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              or
            </div>
          </div>

          <div className="space-y-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className={`w-full border-black/20 ${provider.color}`}
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: `${provider.name} authentication will be available soon`,
                  });
                }}
              >
                <provider.icon className="w-5 h-5 mr-3" />
                Continue with {provider.name}
              </Button>
            ))}
          </div>

          {mode === "login" && (
            <div className="text-center">
              <Button variant="link" className="text-sm text-gray-600 underline p-0">
                Forgot password?
              </Button>
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <Button
              variant="link"
              className="text-sm font-semibold underline p-0"
              onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            By selecting "Continue", I agree to Airbnb's{" "}
            <Button variant="link" className="text-xs underline p-0 h-auto">
              Terms of Service
            </Button>
            ,{" "}
            <Button variant="link" className="text-xs underline p-0 h-auto">
              Payments Terms of Service
            </Button>
            , and{" "}
            <Button variant="link" className="text-xs underline p-0 h-auto">
              Nondiscrimination Policy
            </Button>{" "}
            and acknowledge the{" "}
            <Button variant="link" className="text-xs underline p-0 h-auto">
              Privacy Policy
            </Button>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}