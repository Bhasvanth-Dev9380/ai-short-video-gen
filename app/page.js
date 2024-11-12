"use client";
import { Button } from "../@/components/ui/button";
import { UserButton, useUser, SignInButton, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  // Redirect to dashboard if user is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-semibold">Welcome to Our Service</h2>

      {isSignedIn ? (
        // Redirecting to the dashboard
        <p>Redirecting to your dashboard...</p>
      ) : (
        // Display Sign In button if not signed in
        <SignInButton>
          <Button>Sign In / Sign Up</Button>
        </SignInButton>
      )}

      {/* User Button for profile management (only appears if signed in) */}
      {isSignedIn && <UserButton />}
    </div>
  );
}
