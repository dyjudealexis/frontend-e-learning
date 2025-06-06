import { FC } from 'react';
import CourseWatchComponent from "@/components/Courses/Watch";
import ListOfCourses from "@/components/Courses";

interface CourseWatchPageProps {
  searchParams: { [key: string]: string | undefined };
}

const CourseWatchPage: FC<CourseWatchPageProps> = ({ searchParams }) => {
  const courseId = searchParams.id;

  if (!courseId) return <div>Loading...</div>;

  return (
    <>
      <CourseWatchComponent courseId={courseId} />
      <ListOfCourses
        fallbackHeading="You may also like"
        className="mt-0"
        limit="8"
      />
    </>
  );
};

export default CourseWatchPage;
