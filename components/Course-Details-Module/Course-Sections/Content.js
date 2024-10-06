import Link from "next/link";
import React from "react";
import {EncryptData} from "@/components/Services/encrypt-decrypt";

const Content = ({ checkMatchCourses }) => {
  return (
    <>
      <div className="rbt-course-feature-inner">
        <div className="section-title">
          <h4 className="rbt-title-style-3 text-start">Course Content</h4>
        </div>
        <div className="rbt-accordion-style rbt-accordion-02 accordion">
          <div className="accordion" id="accordionExampleb2">
            {checkMatchCourses.map((item, innerIndex) => (
              <div className="accordion-item card" key={innerIndex}>
                <h2
                  className="accordion-header card-header"
                  id={`headingTwo${innerIndex}`}
                >
                  <button
                    className={`accordion-button ${
                      !item.collapsed ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapseTwo${innerIndex + 1}`}
                    aria-expanded={item.expand}
                    aria-controls={`collapseTwo${innerIndex + 1}`}
                  >
                    {item.sSectionTitle}
                    <span className="rbt-badge-5 ml--10">{item.act_Total} Activities</span>
                  </button>
                </h2>
                <div
                  id={`collapseTwo${innerIndex + 1}`}
                  className={`accordion-collapse collapse ${
                    item.isShow ? "show" : ""
                  }`}
                  aria-labelledby={`headingTwo${innerIndex}`}
                  data-bs-parent="#accordionExampleb2"
                >
                  <div className="accordion-body card-body pr--0">
                    <ul className="rbt-course-main-content liststyle">
                      {/*{console.log(JSON.parse(item.lessionTbl))}*/}
                      {JSON.parse(item.lessionTbl).map((list, subIndex) => (
                          <li key={subIndex}>
                            <div className={'row'}>
                              <Link href={`/courselesson/${EncryptData(list.nCId)}/${EncryptData(list.nMId)}/${EncryptData(list.nLId)}/${EncryptData('N')}/${EncryptData(list.nCId)}`}>

                                <div className={'col-lg-5'}>
                                  <div className="course-content-left">
                                    {list.playIcon ? (
                                        <i className="feather-play-circle"></i>
                                    ) : (
                                        <i className="feather-file-text"></i>
                                    )}
                                    <span className="text">{list.sLessionTitle}</span>
                                  </div>
                                </div>
                                <div className={'col-lg-5'}>
                                  <div className="course-content-right d-flex">
                                    <span className="min-lable">{list.act_cnt} Activities</span>
                                    <Link href={`/courselesson/${EncryptData(list.nCId)}/${EncryptData(list.nMId)}/${EncryptData(list.nLId)}/${EncryptData('N')}/${EncryptData(list.nCId)}`}>
                                     <span className="rbt-badge variation-03 bg-primary-opacity">
                                        <i className="feather-eye"></i> Preview
                                     </span>
                                    </Link>
                                  </div>
                                </div>
                                <div className={'col-lg-1'}>
                                  <div className="course-content-right">
                                <span className="course-lock">
                                  <i className="feather-lock"></i>
                                </span>
                                  </div>
                                </div>

                          </Link>
                            </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
