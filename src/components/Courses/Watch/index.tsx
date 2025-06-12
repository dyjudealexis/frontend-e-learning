// components/Courses/Watch/index.tsx
"use client";

import Spinner from "@/components/Others/Spinner";
import { useApi } from "@/utils/swr";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";
// import ListOfCourses from "..";

interface CourseData {
  id: number;
  heading: string;
  imgsrc: string;
  name: string;
  price: string;
  rating: string;
  ytembedlink: string;
  description: string;
  category: string;
  created_at: string;
}

const CourseWatchComponent = ({ courseId }: { courseId: string }) => {
  const { data, error, isLoading } = useApi<CourseData>(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`
  );

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

  if (error)
    return (
      <div className="my-40">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 mt-20">
          <h3 className="text-2xl font-semibold mb-4">No course data found.</h3>
          <Link
            href="/courses"
            className="text-primary text-lg font-medium hover:tracking-widest duration-500"
          >
            &lt; Back to courses
          </Link>
        </div>
      </div>
    );
  if (isLoading || !data) return <Spinner />;

  const ratingValue = parseFloat(data.rating);

  return (
    <>
      <section id="courses">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          <div className="sm:flex justify-between items-center mt-10 mb-4">
            <Link
              href="/courses"
              className="text-primary text-lg font-medium hover:tracking-widest duration-500"
            >
              &lt; Back to courses
            </Link>
          </div>
          <iframe
            src={data.ytembedlink}
            frameBorder="0"
            className="w-full h-[500px]"
            allowFullScreen
          ></iframe>
          <div className="mt-8">
            <h2 className="text-midnight_text text-3xl lg:text-3xl font-semibold mb-5 sm:mb-0">
              {data.heading}
            </h2>
            <h3 className="text-base font-normal pt-2 text-black/75">
              {data.name}
            </h3>
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <h3 className="text-red-700 text-2xl font-medium">
                  {ratingValue}
                </h3>
                <div className="flex">{renderStars(ratingValue)}</div>
              </div>
            </div>
            <p>{data.description}</p>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default CourseWatchComponent;
