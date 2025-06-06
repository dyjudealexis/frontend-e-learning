// app/courses/watch/page.tsx
import { Metadata } from 'next';
import CourseWatchComponent from '@/components/Courses/Watch';
import ListOfCourses from '@/components/Courses';

interface Course {
  id: number;
  heading: string;
  description: string;
  imgsrc: string;
}

// We know Next will pass `searchParams` as a plain object in the App Router
interface PageProps {
  searchParams: { id?: string };
}

/**
 * 2. Export generateMetadata so Next will include these tags in the <head> 
 *    of the server‐rendered HTML. 
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const courseId = searchParams.id;
  if (!courseId) {
    return {
      title: 'Course Not Found | E-Learning',
      description: 'No course specified.',
    };
  }

  // Fetch course data on the server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`);
  if (!res.ok) {
    return {
      title: 'Course Not Found | E-Learning',
      description: 'Could not fetch course data.',
    };
  }
  const course: Course = await res.json();

  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/courses/watch?id=${course.id}`;

  return {
    title: `${course.heading} | E-Learning`,
    description: course.description,
    openGraph: {
      title: course.heading,
      description: course.description,
      images: [
        {
          url: course.imgsrc,
          alt: course.heading,
        },
      ],
      url,
      siteName: 'E-Learning',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.heading,
      description: course.description,
      images: [course.imgsrc],
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
    alternates: {
      canonical: `/courses/watch?id=${course.id}`,
    },
  };
}

/**
 * 3. The default export now becomes a Server Component.
 *    It can still render client children.
 */
export default async function CourseWatchPage({ searchParams }: PageProps) {
  const courseId = searchParams.id;
  if (!courseId) {
    return <div>Invalid course ID.</div>;
  }

  // You can either re‐fetch here, or pass down `courseId` only and let the client fetch.
  // In this example, just pass courseId to the client component:
  return (
    <>
      {/* CourseWatchComponent is assumed to be a client component */}
      <CourseWatchComponent courseId={courseId} />

      <ListOfCourses
        fallbackHeading="You may also like"
        className="mt-0"
        limit="8"
      />
    </>
  );
}
