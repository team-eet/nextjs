import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import "venobox/dist/venobox.min.css";

import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import { addToCartAction } from "@/redux/action/CartAction";
import {API_URL, API_KEY} from "../../../constants/constant";
import {useRouter} from "next/router";
import Axios from "axios";
import {EncryptData} from "@/components/services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/services/SweetAlert";

const Viedo = ({ checkMatchCourses }) => {
  // console.log(checkMatchCourses)
  const REACT_APP = API_URL
  const router = useRouter();
  const postId = parseInt(router.query.courseId);

  const [getCntActivity, setCntActivity] = useState('')
  const [getCntVideo, setCntVideo] = useState('')
  const [getCntPdf, setCntPdf] = useState('')
  const [getCntImg, setCntImg] = useState('')

   const getFeatureCount = (crsid) => {
    // console.log(checkMatchCourses.nCId)
     const url = window.location.href
     const parts = url.split("/");
     const courseId = parts[parts.length - 1];
  //     //activity
       Axios.get(`${REACT_APP.API_URL}/api/package/Show_activity_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
          ApiKey: `${REACT_APP.API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntActivity', res.data)
                setCntActivity(res.data[0].cntAct)
                // this.setState({
                //   CntActivity: res.data[0].cntAct
                // })
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
  //
  //     //video
      Axios.get(`${REACT_APP.API_URL}/api/package/Show_video_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
           ApiKey: `${REACT_APP.API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntVideo', res.data)
                setCntVideo(res.data[0].cntf)
                // this.setState({
                //   CntVideo: res.data[0].cntf
                // })
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

  //     //pdf
      Axios.get(`${REACT_APP.API_URL}/api/package/Show_pdf_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
           ApiKey: `${REACT_APP.API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntPdf', res.data)
                setCntPdf(res.data[0].cntf)
                // this.setState({
                //   CntPdf: res.data[0].cntf
                // })
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

  //     //image
      Axios.get(`${REACT_APP.API_URL}/api/package/Show_image_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
           ApiKey: `${REACT_APP.API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntImg', res.data)
                setCntImg(res.data[0].cntf)
                // this.setState({
                //   CntImg: res.data[0].cntf
                // })
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
  //
  }

  useEffect(() => {
    getFeatureCount();
    // console.log(EncryptData('0'))
  }, [])
  // console.log(checkMatchCourses)
  const [getsectionItems, setsectionItems] = useState([])
  const { cartToggle, setCart } = useAppContext();
  const [toggle, setToggle] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  // =====> Start ADD-To-Cart
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.CartReducer);

  const [amount, setAmount] = useState(1);

  const addToCartFun = (id, amount, product) => {
    dispatch(addToCartAction(id, amount, product));
    setCart(!cartToggle);
  };

  useEffect(() => {
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));
  }, []);

  // =====> For video PopUp
  useEffect(() => {
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
      });
    });

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isHide = currentScrollPos > 200;

      setHideOnScroll(isHide);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>

      {checkMatchCourses.sVideoPath !== null ? <Link
          className={`video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 ${
              hideOnScroll ? "d-none" : ""
          }`}
          data-vbtype="video"
          href={`${checkMatchCourses.sVideoURL}`}
      >
        <div className="video-content">
          <Image src={checkMatchCourses.sImagePath} className={"position-relative"} height={255} width={355}></Image>
          <div className="position-to-top">
            <span className="rbt-btn rounded-player-2 with-animation">
              <span className="play-icon"></span>
            </span>
          </div>

          <span className="play-view-text d-block color-white">
            <i className="feather-eye"></i> Preview this course
          </span>
        </div>
      </Link> : <div className={`video-content ${
          hideOnScroll ? "d-none" : ""}`}>
        <Image src={checkMatchCourses.sImagePath} className={"position-relative"} height={255} width={355}></Image>
      </div>}

      <div className="content-item-content">
        <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
          <div className="rbt-price">
            <span className="current-price">₹{checkMatchCourses.dAmount}</span>
            <span className="off-price">₹{checkMatchCourses.nCourseAmount}</span>
          </div>
          <div className="discount-time">
            <span className="rbt-badge color-danger bg-color-danger-opacity">
              <i className="feather-clock"></i> {checkMatchCourses.days} days
              left!
            </span>
          </div>
        </div>

        <div className="add-to-card-button mt--15">
          <Link
            className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
            href="#"
            onClick={() =>
              addToCartFun(checkMatchCourses.id, amount, checkMatchCourses)
            }
          >
            <span className="btn-text">Add to Cart</span>
            <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
          </Link>
        </div>

        <div className="buy-now-btn mt--15">
          <Link
            className="rbt-btn btn-border icon-hover w-100 d-block text-center"
            href="#"
          >
            <span className="btn-text">Buy Now</span>
            <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
          </Link>
        </div>
        <span className="subtitle">
          <i className="feather-rotate-ccw"></i> 30-Day Money-Back Guarantee
        </span>
        <div
          className={`rbt-widget-details has-show-more ${
            toggle ? "active" : ""
          }`}
        >
          <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">

            <li className={'d-flex'}>
              <span>Videos</span>
              <span className="rbt-feature-value rbt-badge-5">
                    {getCntVideo}
                  </span>
            </li>
            <li className={'d-flex'}>
              <span>PDF</span>
              <span className="rbt-feature-value rbt-badge-5">
                    {getCntPdf}
                  </span>
            </li>
            <li className={'d-flex'}>
              <span>Image</span>
              <span className="rbt-feature-value rbt-badge-5">
                    {getCntImg}
                  </span>
            </li>
            <li className={'d-flex'}>
              <span>Acitivity</span>
              <span className="rbt-feature-value rbt-badge-5">
                    {getCntActivity}
                  </span>
            </li>
          </ul>
          <div className={`rbt-show-more-btn ${toggle ? "active" : ""}`} onClick={() => setToggle(!toggle)}>
            {!toggle ? 'Show More' : ' Show Less'}
          </div>
        </div>

        <div className="social-share-wrapper mt--30 text-center">
          <div className="rbt-post-share d-flex align-items-center justify-content-center">
            <ul className="social-icon social-default transparent-with-border justify-content-center">
              <li>
                <Link href="https://www.facebook.com/">
                  <i className="feather-facebook"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.twitter.com">
                  <i className="feather-twitter"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/">
                  <i className="feather-instagram"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.linkdin.com/">
                  <i className="feather-linkedin"></i>
                </Link>
              </li>
            </ul>
          </div>
          <hr className="mt--20" />
          <div className="contact-with-us text-center">
            <p>For details about the course</p>
            <p className="rbt-badge-2 mt--10 justify-content-center w-100">
              <i className="feather-phone mr--5"></i>
              Call Us:{" "}
              <Link href="#">
                <strong>+444 555 666 777</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viedo;
