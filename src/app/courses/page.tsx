import ListOfCourses from "@/components/Courses";
import React, { Suspense } from "react";

const Courses = () => {
  return (
    <>
      <Suspense fallback={<></>}>
        <ListOfCourses showSearchHeading={true} className="mt-20" />
      </Suspense>
    </>
  );
};

export default Courses;
