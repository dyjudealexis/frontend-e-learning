import React from "react";
import Hero from "@/components/Home/Hero";
import Companies from "@/components/Home/Companies";
import Courses from "@/components/Home/Courses";
import Mentor from "@/components/Home/Mentor";
import Testimonial from "@/components/Home/Testimonials";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";

// SEO metadata
export const metadata: Metadata = {
  title: "E-Learning | Learn from the Best Online Courses & Mentors",
  description: "Join E-Learning to access top-rated online courses, connect with expert mentors, and boost your skills anytime, anywhere.",
  keywords: [
    "E-Learning",
    "Online Courses",
    "Mentorship",
    "Learn Online",
    "Skill Development",
    "Remote Learning",
    "Educational Platform",
  ],
  openGraph: {
    title: "E-Learning | Learn from the Best Online Courses & Mentors",
    description: "Start your learning journey today with E-Learning. Access premium courses, expert mentorship, and career advancement tools.",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    siteName: "E-Learning",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/images/og-image.webp`, // Update with your OG image
        width: 1200,
        height: 630,
        alt: "E-Learning platform preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Learning | Learn Online from Experts",
    description: "Top-rated online courses and mentorship – all in one place. Join E-Learning today.",
    images: [`${process.env.NEXT_PUBLIC_DOMAIN}/images/og-image.webp`], // Update image
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Companies />
      <Courses />
      <Mentor />
      <Testimonial />
      <Newsletter />
    </main>
  );
}
