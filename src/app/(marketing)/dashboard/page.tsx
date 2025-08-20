"use client";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    console.log(true, session);
  }, [session]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <section className="w-screen min-h-screen items-center flex justify-center">
      <h1 className="font-normal text-center text-4xl leading-normal">
        Dashboard
      </h1>
      <p
        onClick={handleLogout}
        className="underline cursor-pointer underline-offset-2 text-gray-600 hover:text-gray-800"
      >
        Sign out
      </p>
    </section>
  );
};

export default page;
