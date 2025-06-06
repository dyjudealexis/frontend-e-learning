"use client";

import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getImagePrefix } from "@/utils/util";
import { useApi } from "@/utils/swr";
import Spinner from "@/components/Others/Spinner";
import Signin from "@/components/Auth/SignIn";
import { getCookie } from "@/utils/cookies";
import { arrayHasValue } from "@/utils/arrayHasValue";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

interface CoursesResponse {
  courses: Course[];
  currentPage: number;
  totalPage: number;
  totalCount: number;
}

const Courses = () => {
  const { data, error, isLoading } = useApi<CoursesResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/?limit=6`
  );

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    autoplay: true,
    speed: 500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
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
        {Array.from({ length: emptyStars }, (_, i) => (
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
      try {
        router.push(`/courses/watch?id=${courseId}`);
        return;
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }

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
        color: "#000000", // <-- set text to black here
      },
    });
    setIsSignInOpen(true);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <section id="courses">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          <p>Failed to load courses.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="courses">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="sm:flex justify-between items-center my-10">
          <h2 className="text-midnight_text text-4xl lg:text-4xl font-semibold mb-5 sm:mb-0">
            Popular courses.
          </h2>
          <Link
            href="/courses"
            className="text-primary text-lg font-medium hover:tracking-widest duration-500"
          >
            Explore courses&nbsp;&gt;&nbsp;
          </Link>
        </div>
        <Slider {...settings}>
          {data?.courses.map((item) => (
            <div key={item.id}>
              <div className="bg-white m-3 mb-12 px-0 pt-3 pb-8 shadow-course-shadow rounded-2xl h-full">
                <div className="relative rounded-3xl">
                  <Image
                    src={`${getImagePrefix()}${item.imgsrc}`}
                    alt="course-image"
                    width={389}
                    height={262}
                    className="m-auto clipPath rounded-3xl cursor-pointer"
                    onClick={() => handleWatchCourse(item.id)}
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
            </div>
          ))}
        </Slider>
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

export default Courses;
