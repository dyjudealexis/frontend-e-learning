"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getImagePrefix } from "@/utils/util";
import { useSearchParams, useRouter } from "next/navigation";
import Spinner from "../Others/Spinner";
import { useApi } from "@/utils/swr";
import { getCookie } from "@/utils/cookies";
import { arrayHasValue } from "@/utils/arrayHasValue";
import toast from "react-hot-toast";
import Signin from "@/components/Auth/SignIn";

interface Course {
  id: number;
  heading: string;
  imgsrc: string;
  name: string;
  price: string;
  rating: number;
  ytembedlink: string;
  description: string;
  category: string;
  created_at: string;
}

interface ListOfCoursesProps {
  showSearchHeading?: boolean;
  fallbackHeading?: string;
  limit?: string;
  className?: string;
}

const ListOfCourses = ({
  showSearchHeading = false,
  fallbackHeading = "Popular Courses.",
  limit = "12",
  className = "",
}: ListOfCoursesProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState<string>(searchQuery);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set("search", searchQuery);
  if (limit) queryParams.set("limit", limit);

  const { data, error, isLoading } = useApi(
    `${process.env.NEXT_PUBLIC_API_URL}/courses?${queryParams.toString()}`
  );

  const courses: Course[] = data?.courses || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }

    if (!params.get("limit")) {
      params.set("limit", limit);
    }

    router.push(`/courses?${params.toString()}`);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Icon
              key={`full-${i}`}
              icon="tabler:star-filled"
              className="text-yellow-500 text-xl inline-block"
            />
          ))}
        {halfStars > 0 && (
          <Icon
            icon="tabler:star-half-filled"
            className="text-yellow-500 text-xl inline-block"
          />
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Icon
              key={`empty-${i}`}
              icon="tabler:star-filled"
              className="text-gray-400 text-xl inline-block"
            />
          ))}
      </>
    );
  };

  const handleWatchCourse = (courseId: number) => {
    const isAuthenticated = getCookie("is_authenticated");
    const user = getCookie("user");

    if (isAuthenticated === true && arrayHasValue(user)) {
      // User authenticated, navigate
      router.push(`/courses/watch?id=${courseId}`);
      return;
    }

    // Not authenticated: show toast + open sign-in modal
    toast("You need to sign in first.", {
      icon: (
        <Icon
          icon="mdi:information"
          width={24}
          height={24}
          style={{ color: "#2f86eb" }}
        />
      ),
      style: {
        borderRadius: "8px",
        background: "#f0f4ff",
        color: "#000000",
      },
    });
    setIsSignInOpen(true);
  };

  return (
    <section id="courses">
      <div
        className={`container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 ${className}`}
      >
        {showSearchHeading && (
          <form
            onSubmit={handleSearchSubmit}
            className="relative rounded-full pt-5 lg:pt-0 w-full"
          >
            <input
              type="text"
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-black rounded-full focus:outline-none border"
              placeholder="Find courses..."
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-primary p-5 rounded-full absolute right-2 top-2 search-hero"
            >
              <Icon
                icon="solar:magnifer-linear"
                className="text-white text-4xl inline-block"
              />
            </button>
          </form>
        )}

        <div className="sm:flex justify-between items-center my-10">
          <h2 className="text-midnight_text text-4xl lg:text-4xl font-semibold mb-5 sm:mb-0">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : fallbackHeading}
          </h2>
        </div>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p>Failed to load courses.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((item) => (
              <div
                key={item.id}
                className="bg-white pb-8 shadow-course-shadow rounded-2xl h-full"
              >
                <div className="relative rounded-3xl cursor-pointer" onClick={() => handleWatchCourse(item.id)}>
                  <Image
                    src={`/${getImagePrefix()}${item.imgsrc}`}
                    alt="course-image"
                    width={389}
                    height={262}
                    className="m-auto clipPath rounded-3xl"
                  />
                </div>

                <div className="px-3 pt-6">
                  <h3
                    className="text-2xl font-bold text-black max-w-75% inline-block cursor-pointer"
                    onClick={() => handleWatchCourse(item.id)}
                  >
                    {item.heading}
                  </h3>
                  <h3 className="text-base font-normal pt-6 text-black/75">
                    {item.name}
                  </h3>

                  <div className="flex justify-between items-center py-6 border-b">
                    <div className="flex items-center gap-4">
                      <h3 className="text-red-700 text-2xl font-medium">
                        {item.rating}
                      </h3>
                      <div className="flex">{renderStars(item.rating)}</div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => handleWatchCourse(item.id)}
                      className="flex gap-4 items-center"
                    >
                      <Icon
                        icon="solar:notebook-minimalistic-outline"
                        className="text-primary text-xl inline-block me-2"
                      />
                      <h3 className="text-primary font-medium text-black opacity-75 hover:underline">
                        Watch Course
                      </h3>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                // Implement sign-up modal if needed
              }}
              onClose={() => setIsSignInOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ListOfCourses;
