"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { Icon } from "@iconify/react";
import useSWRMutation from "swr/mutation";
import { setCookie } from "@/utils/cookies";

type SigninProps = {
  onSignUpClick: () => void;
  onClose: () => void; // 👈 New prop
};

const loginUser = async (
  url: string,
  { arg }: { arg: Record<string, string> }
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to login");
  }

  return res.json();
};

const Signin: React.FC<SigninProps> = ({ onSignUpClick, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "demoaccount@example.com",
    password: "demoaccount123",
  });

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    loginUser
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const loginUserHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await trigger(loginData);
      const { token, user } = data;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cookies/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 👈 Important for sending cookies
        body: JSON.stringify({
          cookieName: `${process.env.NEXT_PUBLIC_SESSION_TOKEN_COOKIE}`,
          cookieValue: token,
        }),
      });

      setCookie(`${process.env.NEXT_PUBLIC_USER_COOKIE}`, user);
      setCookie(`${process.env.NEXT_PUBLIC_IS_AUTHENTICATED_COOKIE}`, "true");

      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cookies/set`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify({ cookieName: 'user', cookieValue: user }),
      // });

      toast.success("Login successful!");
      onClose();
      // router.push("/");
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

      <form onSubmit={loginUserHandler}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            className="w-full rounded-3xl border border-black/20 bg-transparent px-5 py-3 text-base text-dark outline-none placeholder:text-grey focus:border-primary text-black"
          />
        </div>

        <div className="mb-[22px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className="w-full rounded-3xl border border-black/20 bg-transparent px-5 py-3 text-base text-dark outline-none placeholder:text-grey focus:border-primary text-black pr-12"
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
            className="group bg-primary text-white w-full py-3 rounded-3xl text-18 font-medium border border-primary hover:text-primary hover:bg-transparent flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5" hovered />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      <p className="text-base text-black">
        Not a member yet?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onSignUpClick}
        >
          Sign Up
        </button>
      </p>
    </>
  );
};

export default Signin;
