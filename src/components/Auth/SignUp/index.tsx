"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import { Icon } from "@iconify/react";
import useSWRMutation from "swr/mutation";

type SignUpProps = {
  onSignInClick: () => void;
};

const registerUser = async (url: string, { arg }: { arg: Record<string, string> }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to register");
  }

  return res.json();
};

const SignUp: React.FC<SignUpProps> = ({ onSignInClick }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { trigger } = useSWRMutation(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, registerUser);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const value = Object.fromEntries(data.entries()) as Record<string, string>;

    try {
      await trigger(value);
      toast.success("Registration successful!");
      console.log("Registration successful!")
      onSignInClick();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 text-center mx-auto inline-block max-w-[260px]">
        <Logo />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-3xl border border-black/20 bg-transparent px-5 py-3 text-base text-black placeholder:text-grey focus:border-primary"
          />
        </div>

        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-3xl border border-black/20 bg-transparent px-5 py-3 text-base text-black placeholder:text-grey focus:border-primary"
          />
        </div>

        <div className="mb-[22px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-3xl border border-black/20 bg-transparent px-5 py-3 text-base text-black placeholder:text-grey focus:border-primary pr-12"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500"
            aria-label="Toggle password visibility"
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
          </button>
        </div>

        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-3xl bg-primary px-5 py-3 text-18 font-medium text-white hover:bg-transparent hover:text-primary border border-primary"
            disabled={loading}
          >
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-4 text-black">
        By creating an account you agree to our{" "}
        <a href="/#" className="text-primary hover:underline">
          Privacy
        </a>{" "}
        and{" "}
        <a href="/#" className="text-primary hover:underline">
          Policy
        </a>
      </p>

      <p className="text-body-secondary text-black">
        Already have an account?{" "}
        <button
          type="button"
          className="text-primary hover:underline pl-2"
          onClick={onSignInClick}
        >
          Sign In
        </button>
      </p>
    </>
  );
};

export default SignUp;
