import PageHead from "../Head";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import MainDemo from "@/components/01-Main-Demo/01-Main-Demo";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import AllCoursetwo from "@/components/AllCourse/allcourse";
// import CourseLesson from "@/components/CourseLesson/lesson";
// import AllCourses from "@/components/AllCourse/allcourses";



const AllCourse = () => {
    return (
        <>
            <PageHead title="Home - Online Courses & Education NEXTJS14 Template" />

            <Provider store={Store}>
                <Context>

                    {/*<CourseLesson />*/}

                    {/*<MobileMenu />*/}
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    {/*<AllCourses />*/}

                    <AllCoursetwo />

                    {/*<Cart />*/}

                    {/*<Separator />*/}
                    {/*<FooterThree />*/}
                </Context>
            </Provider>
        </>
    );
};

export default AllCourse;
