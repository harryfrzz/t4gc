"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = login(email, password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Y-Ultimate account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}

            <div className="text-xs bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 space-y-2">
              <div className="font-semibold text-blue-900 dark:text-blue-100">Test Credentials:</div>
              <div className="grid grid-cols-1 gap-1.5">
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">User:</span> test@example.com / test123
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Admin:</span> admin@example.com / admin123
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Coach:</span> coach@example.com / coach123
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Student:</span> student@example.com / student123
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground mb-2">Don&apost have an account?</p>
            <div className="flex flex-col gap-2">
              <Link href="/auth/register/user">
                <Button variant="outline" className="w-full">
                  Register as User
                </Button>
              </Link>
              <Link href="/auth/register/admin">
                <Button variant="outline" className="w-full">
                  Register as Admin
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
