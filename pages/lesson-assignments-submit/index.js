import { useEffect, useState } from "react";

import PageHead from "../Head";

import BackToTop from "../backToTop";
import LessonSidebar from "@/components/Lesson/LessonSidebar";
import LessonTop from "@/components/Lesson/LessonTop";
import LessonAssignmentsSubmit from "@/components/Lesson/LessonAssignmentsSubmit";

const LessonAssignmentsSubmitLayout = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <PageHead title="Lesson Quiz Result - Online Courses & Education NEXTJS14 Template" />

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
                <LessonAssignmentsSubmit />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default LessonAssignmentsSubmitLayout;
