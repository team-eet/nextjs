import React, {useEffect, useState} from "react";
import Select, { components } from "react-select";
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import {Alert, Card, FormGroup} from "reactstrap";
import Link from "next/link";
import {API_URL, API_KEY} from '../../constants/constant'
import * as Yup from 'yup'
import Axios from 'axios'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";
import img from "@/public/images/others/thumbnail-placeholder.svg";

const MySwal = withReactContent(Swal)

const UserValidationSchema = Yup.object().shape({
  sDesc: Yup.string()
      .required('This field is required')
})


const Description = () => {
  const REACT_APP = API_URL
  const [text, setText] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter()
  const handleTextChange = (e) => {

    if(countWords(e.target.value) >= 100 && countWords(e.target.value) <= 200){
      // alert('no')
      MySwal.fire({
        title: 'Info',
        text: 'Can not add less than 100 words and more than 200 words!',
        icon: 'info',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      }).then(() => {
        // window.location.reload()
      })
      // setText('');
    } else {
      setText(e.target.value);
    }


  };

  const countWords = (desc) => {
    if (desc){
      const words = desc.trim().split(/\s+/);
      return words.filter(word => word !== '').length;

    }

  };
  const [regId, setregId] = useState('')
  const [verifySts, setverifySts] = useState()
  useEffect(() => {

    if (localStorage.getItem('userData')) {
      setregId(JSON.parse(localStorage.getItem('userData')).regid)

    Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log("GetTutorVerify",res.data)
          if (res.data.length !== 0) {
            setverifySts(res.data[0].sDesc_verify)
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

    Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if(res.data.length !== 0) {
            setText(res.data[0]['sDesc'])
            if(res.data[0].bIsReview !== 0) {
              router.push('/become-a-tutor/Review')
            } else {

            }
          }
          console.log(res.data)

          // setTutorDetail(res.data[0])

        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
    }

  }, []);

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Description</h4>
          </div>
          {verifySts === 2 ? <>
            <Alert color='success'>
              <h6 className='alert-heading m-0 text-center'>
                Description verification has been approved by admin
              </h6>
            </Alert>

          </> : <>
            {verifySts === 1 ? <>
              <Alert color='warning'>
                <h6 className='alert-heading m-0 text-center'>
                  Description verification is in pending state
                </h6>
              </Alert>

            </> : <>
              {verifySts === 0 || verifySts === null ? <></> : <>
                <Alert color='danger'>
                  <h6 className='alert-heading m-0 text-center'>
                    Description verification has been disapproved by admin
                  </h6>
                </Alert>
              </>}

            </>}
          </>}
          <div>
            <p>
              Write minimum 100 words and maximum 200 words to describe yourself. This description will
              be presented on your course card or batch card of our website. It will play a role in and encourage
              students to connect with you.
            </p>

            <Formik
                validationSchema={UserValidationSchema}
                initialValues={{
                  nRegId: regId,
                  sDesc: text
                }}
                enableReinitialize={true}
                onSubmit={async (values, {resetForm}) => {
                  console.log(values)
                  if(verifySts === 2){
                    router.push('/become-a-tutor/intro-video')
                  } else {
                    setisLoading(true)
                    await Axios.put(`${API_URL}/api/TutorBasics/UpdateTutorProfile`, values, {
                      headers: {
                        ApiKey: `${API_KEY}`
                      }
                    }).then(res => {
                      // console.log(values)
                      // console.log(res.data)
                      const retData = JSON.parse(res.data)
                      resetForm({})
                      if(retData.success === '1') {
                        Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                          headers: {
                            ApiKey: `${API_KEY}`
                          }
                        })
                            .then(res => {
                              // console.log(res.data)
                              if(res.data.length !== 0) {
                                const array2 = res.data.map((item) => {
                                  return item.verify_list
                                })
                                // console.log(array2)
                                let array = array2[0].split(',').map(Number);
                                // console.log('---------------', array);
                                let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];

                                let url = array1
                                let verify_string = array;
                                if(verify_string.length !== 0){
                                  // Check the 0th position in array2 and get the corresponding string from array1
                                  let positionToCheck = verify_string[0];
                                  let conditionString = url[positionToCheck - 1];

                                  // Check the position of the first 3 numbers in array2
                                  let positionOfThree = verify_string.findIndex(num => num === 3);

                                  // Get the string at that position from array1
                                  let stringForUrl = url[positionOfThree];

                                  console.log('stringForUrl', stringForUrl)
                                  // router.push(`/become-a-tutor/${stringForUrl}`)
                                  router.push(`/become-a-tutor/intro-video`)
                                } else {
                                  router.push('/become-a-tutor/intro-video')
                                }

                              }
                            })
                            .catch(err => {
                              { ErrorDefaultAlert(err) }
                            })
                        // router.push('/become-a-tutor/intro-video')
                      }
                    })
                        .catch(err => {
                          // console.log(err)
                          ErrorDefaultAlert(JSON.stringify(err.response))
                        })
                  }

                }}
            >
              {({errors, touched}) => {
                return (
                    <>
                      <Form>
                        <div className={'row'}>
                          <div className={'col-lg-6'}>
                            <label htmlFor="aboutCourse">Description</label>
                            <textarea readOnly={verifySts === 2} name={"sDesc"} value={text}
                                      onChange={handleTextChange} id="aboutCourse" rows="10"></textarea>
                            <div className={'text-end'}>
                              <small>Word Count: {countWords(text)}</small>
                            </div>
                            <ErrorMessage name='sDesc' component='div'
                                          className='field-error text-danger'/>
                          </div>
                          <div className={'col-lg-6'}>
                            <h6>You can include : </h6>
                            <ul className="rbt-list-style-1 mt-5">
                              <li>
                                <i className="feather-check"></i>
                                About yourself
                              </li>
                              <li>
                                <i className="feather-check"></i>
                                Qualification
                              </li>
                              <li>
                                <i className="feather-check"></i>
                                Professional certification
                              </li>
                              <li>
                                <i className="feather-check"></i>
                                Teaching experience
                              </li>
                              <li>
                                <i className="feather-check"></i>
                                English is your hobby
                              </li>
                            </ul>
                          </div>
                          <hr></hr>
                          <div className={'col-lg-12'}>
                            <Card className={'bg-light p-2'}>
                              <small className="d-block mt_dec--5" style={{color: '#9E9E9E'}}>
                                Example 1 : <br></br>
                                Hi, I am Bhavesh Patel, an enthusiastic English language trainer. I successfully
                                completed my graduation with major in English from Delhi University, India . Besides, I
                                have earned a professional certificate as an IELTS trainer from British Council. I have
                                been
                                in the field of English teaching for almost 15 years . Teaching English has been my
                                passion and hobby, it is not merely a career option for me. I always engrossed in
                                teaching so you will definitely enjoy learning with me.
                              </small>
                            </Card>
                          </div>
                          <div className={'col-lg-12 mt-3'}>
                            <Card className={'bg-light p-2'}>
                              <small className="d-block mt_dec--5" style={{color: '#9E9E9E'}}>
                                Example 2 : <br></br>
                                Greetings, I'm Bhavesh Patel , a passionate teacher of English. At Delhi University in
                                India
                                , I successfully completed my graduation with a major in English . In addition, the
                                British
                                Council has awarded me a professional accreditation as an IELTS trainer. I have nearly
                                15
                                years of experience teaching English. I have a passion for teaching English; it is not
                                just a job choice for me. You will undoubtedly like learning with me because I am always
                                fully engaged in my lessons.
                              </small>
                            </Card>
                          </div>
                          <div className={'col-lg-12 mt-3'}>
                            <Card className={'bg-light p-2'}>
                              <small className="d-block mt_dec--5" style={{color: '#9E9E9E'}}>
                                Example 3 : <br></br>
                                Hello, my name is Bhavesh Patel , and I'm a passionate English language instructor. I
                                graduated from Delhi University in India with a major in English. In addition, the
                                British
                                Council has certified me as a professional IELTS trainer. I've been teaching English
                                for approximately 15 years. I don't only see teaching English as a career; it's my
                                passion
                                and pastime. You will undoubtedly love learning with me because I am always fully
                                engaged
                                in my lessons.
                              </small>
                            </Card>
                          </div>
                          <div className="col-lg-12 mt-5">
                            <div className="form-submit-group">
                              {isLoading ? <>
                                <button
                                    disabled={true}
                                    type="submit"
                                    className="rbt-btn btn-md btn-gradient w-100"
                                >
                                                            <span className="btn-text"><i
                                                                className="feather-loader"></i>isLoading...</span>
                                </button>
                              </> : <>
                                <button type="submit"
                                        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
                                                         <span className="icon-reverse-wrapper">
                                                           <span className="btn-text">Continue</span>
                                                           <span className="btn-icon">
                                                             <i className="feather-arrow-right"></i>
                                                           </span>
                                                           <span className="btn-icon">
                                                            <i className="feather-arrow-right"></i>
                                                           </span>
                                                        </span>
                                </button>
                              </>}
                            </div>
                          </div>
                        </div>

                      </Form>

                    </>
                )
              }}


            </Formik>


          </div>


        </div>
      </div>
    </>
  );
};

export default Description;

const ValueContainer = ({children, ...props}) => {
  const {getValue, hasValue} = props;
  const nbValues = getValue().length;
  if (!hasValue) {
    return (
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
    );
  }
  return (
      <components.ValueContainer {...props}>
        {`${nbValues} items selected`}
      </components.ValueContainer>
  );
};

const MultiValue = (props) => {
  return "3 Selected";
};
