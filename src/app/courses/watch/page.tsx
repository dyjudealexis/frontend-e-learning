'use client';

import ListOfCourses from '@/components/Courses';
import CourseWatchComponent from '@/components/Courses/Watch';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const CourseWatch = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  if (!courseId) return <div>Loading...</div>;

  return <>
  <CourseWatchComponent courseId={courseId} />
  <ListOfCourses fallbackHeading="You may also like" className="mt-0" limit={"8"} />
  </>;
};

export default CourseWatch;
