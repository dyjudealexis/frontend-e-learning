"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getCookie } from "@/utils/cookies";
import { arrayHasValue } from "@/utils/arrayHasValue";
import toast from "react-hot-toast";

export default function Header() {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [showAuthButtons, setShowAuthButtons] = useState<boolean | null>(null);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    id?: number;
  }>({});

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check cookies and flip showAuthButtons
  const checkAuthStatus = () => {
    const rawAuth = getCookie("is_authenticated");
    const rawUser = getCookie("user");

    // console.log(rawUser);

    if (rawAuth === true && arrayHasValue(rawUser)) {
      try {
        // const parsedUser = JSON.parse(rawUser);
        setUser(rawUser);
      } catch (e) {
        setUser({});
      }
      setShowAuthButtons(false);
    } else {
      setShowAuthButtons(true);
      setUser({});
    }

    // console.log(user)
  };

  const handleLogout = () => {
    document.cookie = "is_authenticated=false; path=/";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setShowAuthButtons(true);
    setUser({});

    router.push("/");
    toast.success("Logged out successful!");
  };

  useEffect(() => {
    checkAuthStatus();
    const id = setInterval(checkAuthStatus, 500);
    return () => clearInterval(id);
  }, []);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (evt: MouseEvent) => {
    if (signInRef.current && !signInRef.current.contains(evt.target as Node)) {
      setIsSignInOpen(false);
    }
    if (signUpRef.current && !signUpRef.current.contains(evt.target as Node)) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(evt.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 bg-white ${
        sticky ? " shadow-lg py-5" : "shadow-none py-6"
      }`}
    >
      <div className="lg:py-0 py-2">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          <Logo />
          <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
            {headerData.map((item, idx) => (
              <HeaderLink key={idx} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {showAuthButtons && (
              <>
                <Link
                  href="#"
                  className="hidden lg:block bg-primary text-white hover:bg-primary/15 hover:text-primary px-16 py-5 rounded-full text-lg font-medium"
                  onClick={() => setIsSignInOpen(true)}
                >
                  Sign In
                </Link>
                {isSignInOpen && (
                  <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                    <div
                      ref={signInRef}
                      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl px-8 pt-14 pb-8 text-center bg-white"
                    >
                      <button
                        onClick={() => setIsSignInOpen(false)}
                        className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                        aria-label="Close Sign In Modal"
                      >
                        <Icon
                          icon="tabler:currency-xrp"
                          className="text-black hover:text-primary text-24 inline-block me-2"
                        />
                      </button>
                      <Signin
                        onSignUpClick={() => {
                          setIsSignInOpen(false);
                          setIsSignUpOpen(true);
                        }}
                        onClose={() => setIsSignInOpen(false)}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href="#"
                  className="hidden lg:block bg-primary/15 hover:bg-primary text-primary hover:text-white px-16 py-5 rounded-full text-lg font-medium"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Sign Up
                </Link>
                {isSignUpOpen && (
                  <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                    <div
                      ref={signUpRef}
                      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center"
                    >
                      <button
                        onClick={() => setIsSignUpOpen(false)}
                        className="absolute top-0 right-0 mr-8 mt-8 dark:invert"
                        aria-label="Close Sign Up Modal"
                      >
                        <Icon
                          icon="tabler:currency-xrp"
                          className="text-black hover:text-primary text-24 inline-block me-2"
                        />
                      </button>
                      <SignUp
                        onSignInClick={() => {
                          setIsSignUpOpen(false);
                          setIsSignInOpen(true);
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {showAuthButtons === false && (
              <div className="flex items-center gap-4 lg:block hidden">
                <p className="font-medium">{`Hello, ${
                  user?.name || "User"
                }`}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200"
                >
                  Log Out
                </button>
              </div>
            )}

            {showAuthButtons === null && (
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin lg:block hidden" />
            )}

            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-3xl"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
            </button>
          </div>
        </div>

        {navbarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
        )}

        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 bg-white max-w-xs ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
              <Logo />
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
              aria-label="Close menu Modal"
            ></button>
          </div>
          <nav className="flex flex-col items-start p-4">
            {headerData.map((item, idx) => (
              <MobileHeaderLink key={idx} item={item} />
            ))}

            {showAuthButtons && (
              <div className="mt-4 flex flex-col space-y-4 w-full">
                <Link
                  href="#"
                  className="bg-transparent border border-primary text-primary px-4 py-2 rounded-3xl hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    setIsSignInOpen(true);
                    setNavbarOpen(false);
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="#"
                  className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-blue-700"
                  onClick={() => {
                    setIsSignUpOpen(true);
                    setNavbarOpen(false);
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
            {showAuthButtons === false && (
              <div className="mt-4 flex flex-col space-y-4 w-full">
                <p>{`Hello, ${user?.name || "User"}`}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200"
                >
                  Log Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
