"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "",
    otherUserType: "",
    institution: "",
    graduationYear: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!formData.userType) {
      setError("Please select your status");
      return;
    }

    if (formData.userType === "other" && !formData.otherUserType.trim()) {
      setError("Please specify your status");
      return;
    }

    if (formData.userType === "student" && !formData.institution) {
      setError("Please provide your institution name");
      return;
    }

    console.log("User registration:", formData);
    
    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create User Account</CardTitle>
          <CardDescription>Join Y-Ultimate as a participant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-3">
              <Label>Your Status *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="student"
                    name="userType"
                    value="student"
                    checked={formData.userType === "student"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary"
                  />
                  <Label htmlFor="student" className="font-normal cursor-pointer">
                    Student
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="professional"
                    name="userType"
                    value="professional"
                    checked={formData.userType === "professional"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary"
                  />
                  <Label htmlFor="professional" className="font-normal cursor-pointer">
                    Working Professional
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="other"
                    name="userType"
                    value="other"
                    checked={formData.userType === "other"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-neutral-300 focus:ring-2 focus:ring-primary"
                  />
                  <Label htmlFor="other" className="font-normal cursor-pointer">
                    Other
                  </Label>
                </div>
              </div>
            </div>

            {formData.userType === "other" && (
              <div className="space-y-2">
                <Label htmlFor="otherUserType">Please Specify *</Label>
                <Input
                  id="otherUserType"
                  name="otherUserType"
                  type="text"
                  placeholder="Specify your status"
                  value={formData.otherUserType}
                  onChange={handleChange}
                  required={formData.userType === "other"}
                />
              </div>
            )}

            {formData.userType === "student" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution Name *</Label>
                    <Input
                      id="institution"
                      name="institution"
                      type="text"
                      placeholder="University/College name"
                      value={formData.institution}
                      onChange={handleChange}
                      required={formData.userType === "student"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      placeholder="2025"
                      min="2024"
                      max="2035"
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
                Registration successful! Redirecting to login...
              </div>
            )}

            <Button type="submit" className="w-full" disabled={success}>
              {success ? "Redirecting..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
