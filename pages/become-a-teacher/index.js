import { Provider } from "react-redux";
import PageHead from "../Head";
import Store from "@/redux/store";
import Context from "@/context/Context";

import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import BreadCrumb from "@/components/Common/BreadCrumb";
import BecomeATeacher from "@/components/Become-a-Teacher/BecomeATeacher";
import TeacherGallery from "@/components/Become-a-Teacher/TeacherGallery";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import BackToTop from "../backToTop";

const TeacherPage = () => {
  return (
    <>
      <PageHead title="Become a Teacher - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Become a Teacher" text="Become a Teacher" />

          <div className="rbt-become-area bg-color-white rbt-section-gap">
            <BecomeATeacher />
          </div>

          <div className="thumb-wrapper bg-color-white rbt-section-gapBottom">
            <TeacherGallery />
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default TeacherPage;
