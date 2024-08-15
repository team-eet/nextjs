import React, { useEffect } from "react";
import { useRouter } from "next/router";
import sal from "sal.js";
import CourseData from "../../../data/course-details/courseData.json";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import MobileMenu from "@/components/Header/MobileMenu";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import Cart from "@/components/Header/Offcanvas/Cart";
import BackToTop from "@/pages/backToTop";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import CourseHead from "@/components/Course-Details/Course-Sections/course-head";
import CourseDetailsOne from "@/components/Course-Details/CourseDetails-One";
import PageHead from "@/pages/Head";
import CourseActionBottom from "@/components/Course-Details/Course-Sections/Course-Action-Bottom";
import SimilarCourses from "@/components/Course-Details/Course-Sections/SimilarCourses";

const SingleCourse = () => {
  const router = useRouter();
  const postId = parseInt(router.query.courseId);
  let getCourse;

  getCourse = JSON.parse(JSON.stringify(CourseData.courseDetails));

  const checkMatch = getCourse.find((course) => course.id === postId);

  useEffect(() => {
    if (postId && checkMatch === undefined) {
      router.push("/course-filter-one-toggle");
    }

    sal({
      threshold: 0.01,
      once: true,
    });
  }, [checkMatch, router]);

  return (
    <>
      <PageHead title="Course Details - Online Courses & Education NEXTJS14 Template" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="" headerType={true} />
          <Cart />

          <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
            <CourseHead
              checkMatch={checkMatch !== undefined ? checkMatch : ""}
            />
          </div>

          <div className="rbt-course-details-area ptb--60">
            <div className="container">
              <div className="row g-5">
                <CourseDetailsOne
                  checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}
                />
              </div>
            </div>
          </div>

          <CourseActionBottom
            checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}
          />

          <div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">
            <SimilarCourses
              checkMatchCourses={
                checkMatch !== undefined ? checkMatch.similarCourse : ""
              }
            />
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default SingleCourse;
