import ListOfCourses from "@/components/Courses";
import React, { Suspense } from "react";
import { Metadata } from "next";

// SEO metadata
export const metadata: Metadata = {
  title: "Online Courses | Explore Top Learning Programs at E-Learning",
  description:
    "Browse a wide range of online courses on E-Learning. Learn from industry experts, enhance your skills, and achieve your goals from anywhere.",
  keywords: [
    "Online Courses",
    "E-Learning Courses",
    "Learn Online",
    "Professional Development",
    "Skill Building",
    "Educational Platform",
    "Remote Learning",
  ],
  openGraph: {
    title: "Explore Online Courses | Learn from Experts at E-Learning",
    description:
      "Access a diverse catalog of top-rated online courses and start learning today with E-Learning.",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/courses`,
    siteName: "E-Learning",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/images/og-courses.webp`,
        width: 1200,
        height: 630,
        alt: "Explore online courses on E-Learning platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Learning Courses | Learn Online, Grow Your Skills",
    description:
      "Discover top online courses on E-Learning. Study at your own pace with expert guidance.",
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/images/og-courses.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Courses = () => {
  return (
    <Suspense fallback={<></>}>
      <ListOfCourses showSearchHeading={true} className="mt-20" />
    </Suspense>
  );
};

export default Courses;
