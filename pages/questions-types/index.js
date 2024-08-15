import { useEffect, useState } from "react";

import PageHead from "../Head";

import BackToTop from "../backToTop";
import LessonSidebar from "@/components/Lesson/LessonSidebar";
import LessonPagination from "@/components/Lesson/LessonPagination";
import LessonTop from "@/components/Lesson/LessonTop";
import QuestionType from "@/components/Lesson/QuestionType";
import QuizResult from "@/components/Lesson/Quiz/QuizResult";

const QuestionTypeLayout = () => {
  const [sidebar, setSidebar] = useState(true);
  const [details, setDetails] = useState(false);

  return (
    <>
      <PageHead title="Question Type - Online Courses & Education NEXTJS14 Template" />

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

            <div className="inner py-0">
              <div className="content">
                <div className="section-title">
                  <p className="mb--10">Quiz</p>
                  <h5>Questions Types</h5>
                </div>

                <hr />
                <div className="rbt-dashboard-table table-responsive mobile-table-750 mt--30">
                  <QuestionType details={details} setDetails={setDetails} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default QuestionTypeLayout;
