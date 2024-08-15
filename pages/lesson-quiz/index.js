import { useEffect, useState } from "react";

import PageHead from "../Head";

import BackToTop from "../backToTop";
import LessonSidebar from "@/components/Lesson/LessonSidebar";
import LessonPagination from "@/components/Lesson/LessonPagination";
import LessonTop from "@/components/Lesson/LessonTop";
import LessonQuiz from "@/components/Lesson/LessonQuiz";

const LessonQuizLayout = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <PageHead title="Lesson Quiz - Online Courses & Education NEXTJS14 Template" />

      <div className="rbt-lesson-area bg-color-white">
        <div className="rbt-lesson-content-wrapper">
          <div
            className={`rbt-lesson-leftsidebar ${
              sidebar ? "" : "sibebar-none"
            }`}
          >
            <LessonSidebar />
          </div>

          <div className="rbt-lesson-rightsidebar overflow-hidden">
            <LessonTop
              sidebar={sidebar}
              setSidebar={() => setSidebar(!sidebar)}
            />

            <div className="inner">
              <div className="content">
                <LessonQuiz />
              </div>
            </div>

            <LessonPagination
              urlPrev="/quiz-passing-grade"
              urlNext="/lesson-quiz-result"
            />
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default LessonQuizLayout;
