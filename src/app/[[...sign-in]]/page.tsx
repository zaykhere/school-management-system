"use client";


import { useUser, SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log({isLoaded, isSignedIn, user});

  const router = useRouter();

  useEffect(() => {
    if(!isLoaded || !isSignedIn) return;
    const role = user?.publicMetadata.role;

    console.log({role});

    if (role) {
      router.replace(`/${role}`);
    }
  }, [user, router, isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  if (isSignedIn) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn forceRedirectUrl={null} afterSignInUrl={null}/>
    </div>
  );
};

export default LoginPage;