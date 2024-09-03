import Image from "next/image";
import React, {useEffect, useState} from "react";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import Link from "next/link";
import * as Yup from 'yup'
import {Formik, ErrorMessage, Form} from 'formik'
import Axios from 'axios'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {useRouter} from "next/router";
import {Alert, FormGroup} from "reactstrap";
import {API_URL, API_KEY} from "../../constants/constant";
import client1 from '../../public/images/client/img1.PNG'
import client2 from '../../public/images/client/img2.PNG'
import client3 from '../../public/images/client/img3.PNG'

const UserValidationSchema = Yup.object().shape({
  sProfilePhotoPath: Yup.string()
      .required('This field is required')
})
const Profile = () => {
    const REACT_APP = API_URL
    const [Profileimg, setProfileimg] = useState();
    const [sImagePath, setSImagePath] = useState('');

    // const [sProfilePhotoPath, setsProfilePhotoPath] = useState('')
    const router = useRouter();
    const getBase64 = (file) => {
        return new Promise((resolve) => {
            // Make new FileReader
            const reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load something...
            reader.onload = () => {
                const baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    const onChangeImage = (event) => {
        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(event)
        if (event.target.files[0].size < 2000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        // console.log(result)
                        // const initialVaue = result
                        // setsProfilePhotoPath(result)
                        setSImagePath(result);
                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                setProfileimg(URL.createObjectURL(event.target.files[0]));
            } else {
                setProfileimg('');
                setSImagePath('');
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            alert('Please upload a file less than 2MB');
            setSImagePath('');
        }
    };

    const [regId, setregId] = useState('')
    const [verifysts, setverifySts] = useState([])
    useEffect(() => {
        // console.log(DecryptData(JSON.parse(localStorage.getItem('userData')).accessToken))


        if (localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)

            Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if(res.data.length !== 0) {
                        setverifySts(res.data[0])
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
                // console.log(res.data)
                if (res.data.length !== 0) {
                    setSImagePath(res.data[0]['sProfilePhotoPath'])
                }

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
                    <h4 className="rbt-title-style-3">Profile Photo</h4>
                    {verifysts ? <>
                        {verifysts.sProfilePhoto_verify === 2 ? <>
                            <Alert color='success'>
                                <h6 className='alert-heading m-0 text-center'>
                                    Profile photo verification has been approved by admin
                                </h6>
                            </Alert>

                        </> : <>
                            {verifysts.sProfilePhoto_verify === 1 ? <>
                                <Alert color='warning'>
                                    <h6 className='alert-heading m-0 text-center'>
                                        Profile photo verification is in pending state
                                    </h6>
                                </Alert>

                            </> : <>
                                {verifysts.sProfilePhoto_verify === null || verifysts.sProfilePhoto_verify === 0 ? <>

                                </> : <>
                                    <Alert color='danger'>
                                        <h6 className='alert-heading m-0 text-center'>
                                            Profile photo verification has been disapproved by admin
                                        </h6>
                                    </Alert>
                                </>}
                            </>}
                        </>}
                    </> : <></>}

                    <h3>Your profile photo is your first impression</h3>
                    <p>Having a friendly and professional photo enriches your profile</p>
                </div>

                <Formik
                    validationSchema={UserValidationSchema}
                    initialValues={{
                        nRegId: regId,
                        sProfilePhotoPath: sImagePath
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, {resetForm}) => {

                        if(verifysts.sProfilePhoto_verify === 2) {
                            router.push('/become-a-tutor/cover-photo')
                        } else {
                            await Axios.put(`${API_URL}/api/TutorBasics/UpdateTutorProfile`, values, {
                                headers: {
                                    ApiKey: `${API_KEY}`
                                }
                            }).then(res => {
                                // console.log(values)
                                console.log(res.data)
                                const retData = JSON.parse(res.data)
                                resetForm({})
                                if(retData.success === '1') {

                                    Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                                        headers: {
                                            ApiKey: `${API_KEY}`
                                        }
                                    })
                                        .then(res => {
                                            console.log(res.data)

                                            if(res.data.length !== 0) {
                                                const array2 = res.data.map((item) => {
                                                    return item.verify_list
                                                })
                                                console.log(array2)
                                                let array = array2[0].split(',').map(Number);
                                                const url1 = window.location.href.split('/')
                                                // console.log(url1[4])
                                                // console.log('---------------', array);
                                                let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];
                                                const filter = array1.findIndex((item) => item === url1[4])
                                                console.log(filter + 1)
                                                let url = array1
                                                let verify_string = array;
                                                const final_verifySts = verify_string.slice(filter + 1)
                                                // console.log('-----------------', final_verifySts)
                                                if(final_verifySts.length !== 0){
                                                    // Check the 0th position in array2 and get the corresponding string from array1
                                                    let positionToCheck = verify_string[0];
                                                    let conditionString = url[positionToCheck + 1];

                                                    // Check the position of the first 3 numbers in array2
                                                    let positionOfThree = final_verifySts.findIndex(num => num === 3);
                                                    // console.log(positionOfThree)
                                                    // Get the string at that position from array1
                                                    let stringForUrl = url[positionOfThree];
                                                    console.log('stringForUrl', stringForUrl)
                                                    // router.push(`/become-a-tutor/${stringForUrl}`)
                                                    router.push(`/become-a-tutor/cover-photo`)
                                                } else {
                                                    router.push('/become-a-tutor/cover-photo')
                                                }

                                            }
                                        })
                                        .catch(err => {
                                            { ErrorDefaultAlert(err) }
                                        })
                                }
                            })
                                .catch(err => {
                                    {
                                        ErrorDefaultAlert(JSON.stringify(err.response))
                                    }
                                })
                        }
                    }}
                >
                {({errors, touched}) => {
                    return (
                        <>
                            <Form>
                                <div className={'row mt-5 p-0'}>
                                    <div className={'col-lg-6'}>
                                        <FormGroup>
                                            <input type="file" className={'p-0'} name='sProfilePhotoPath'
                                                   onChange={onChangeImage} accept="image/*"/>
                                            <small>JPG or PNG format, maximum 2 MB</small>
                                            {/*{file && <img src={file} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />}*/}

                                            {/*{(this.state.batchimagefile) ? <img className='w-100 h-200' src={this.state.batchimagefile} /> : <img*/}
                                            {/*    className='w-100 h-180 bg-light-primary p-1' src={noimg} alt='no-img' />}*/}
                                            {sImagePath ? <img src={sImagePath} height={200} width={200}/> : ''}
                                        </FormGroup>
                                        <ErrorMessage name='sProfilePhotoPath' component='div'
                                                      className='field-error text-danger'/>
                                    </div>
                                    <div className={'col-lg-6 profile-sample-photo'}>
                                        <h6>Guidelines for capturing an exceptional photograph</h6>
                                        <div className={'d-flex'}>
                                            <Image className={'w-25'} src={client1} alt={'client1'}></Image>
                                            <Image className={'w-25'} src={client2} alt={'client2'}></Image>
                                            <Image className={'w-25'} src={client3} alt={'client3'}></Image>
                                        </div>

                                        <ul className="rbt-list-style-1 mt-5">
                                            <li>
                                                <i className="feather-check"></i>
                                                Look straight at camera and smile
                                            </li>
                                            <li>
                                                <i className="feather-check"></i>
                                                Maintain genuine and engaging facial expression
                                            </li>
                                            <li>
                                                <i className="feather-check"></i>
                                                Make sure your head and shoulders are covered
                                            </li>
                                            <li>
                                                <i className="feather-check"></i>
                                                Use natural lighting
                                            </li>
                                            <li>
                                                <i className="feather-check"></i>
                                                Simple, uncluttered and white background
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-12 mt-5">
                                        <div className="form-submit-group">
                                            <button
                                                type="submit"
                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                            >
                                                {/*<Link href={"/become-a-tutor/cover-photo"} className={'text-white'}>*/}

                                                <span className="icon-reverse-wrapper">
                                                      <span className="btn-text">Continue</span>
                                                      <span className="btn-icon">
                                                        <i className="feather-arrow-right"></i>
                                                      </span>
                                                      <span className="btn-icon">
                                                        <i className="feather-arrow-right"></i>
                                                      </span>
                                                </span>
                                                {/*</Link>*/}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>

                        </>
                    )
                }}


            </Formik>

            {/*<Formik*/}
            {/*    // validationSchema={UserValidationSchema}*/}
            {/*    initialValues={{*/}
            {/*        nRegId : regId,*/}
            {/*        sProfilePhotoPath: sImagePath*/}
            {/*    }}*/}
            {/*    onSubmit={async (values, {resetForm}) => {*/}
            {/*            console.log(values)*/}
            {/*        if (sImagePath !== ''){*/}
            {/*            // alert(sImagePath)*/}
            {/*            await Axios.put(`${REACT_APP.API_URL}/api/TutorBasics/UpdateTutorProfile`,  values,{*/}
            {/*                    headers: {*/}
            {/*                        ApiKey: `${REACT_APP.API_KEY}`*/}
            {/*                    }*/}
            {/*                }).then(res => {*/}
            {/*                    console.log(res.data)*/}
            {/*                    const retData = JSON.parse(res.data)*/}
            {/*                    console.log(retData)*/}
            {/*                    resetForm({})*/}
            {/*                    // if(retData.success === '1') {*/}
            {/*                    //     router.push('/become-a-tutor/cover-photo')*/}
            {/*                    // }*/}
            {/*                })*/}
            {/*                    .catch(err => {*/}
            {/*                        {*/}
            {/*                            ErrorDefaultAlert(JSON.stringify(err.response))*/}
            {/*                        }*/}
            {/*                    })*/}
            {/*        } else{*/}
            {/*            // alert("no")*/}
            {/*            Yup.object().shape({*/}
            {/*                sProfilePhotoPath: Yup.string()*/}
            {/*                    .required('This field is required')*/}
            {/*            })*/}
            {/*        }*/}

            {/*        //*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Form >*/}
            {/*        <div className={'row mt-5 p-0'}>*/}
            {/*            <div className={'col-lg-6'}>*/}
            {/*                <FormGroup>*/}
            {/*                <input type="file" className={'p-0'} name='sProfilePhotoPath' onChange={onChangeImage}  accept="image/*" />*/}
            {/*                <small>JPG or PNG format, maximum 2 MB</small>*/}
            {/*                /!*{file && <img src={file} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />}*!/*/}

            {/*                /!*{(this.state.batchimagefile) ? <img className='w-100 h-200' src={this.state.batchimagefile} /> : <img*!/*/}
            {/*                /!*    className='w-100 h-180 bg-light-primary p-1' src={noimg} alt='no-img' />}*!/*/}
            {/*                {Profileimg ? <img src={Profileimg} height={200} width={200}/> : ''}*/}
            {/*                </FormGroup>*/}
            {/*                <ErrorMessage name='sProfilePhotoPath' component='div' className='field-error text-danger' />*/}
            {/*            </div>*/}
            {/*            <div className={'col-lg-6 profile-sample-photo'}>*/}
            {/*                <h6>Guidelines for capturing an exceptional photograph</h6>*/}
            {/*                <img src={'/images/client/img1.png'}></img>*/}
            {/*                <img src={'/images/client/img2.png'}></img>*/}
            {/*                <img src={'/images/client/img3.png'}></img>*/}
            {/*                <ul className="rbt-list-style-1 mt-5">*/}
            {/*                    <li>*/}
            {/*                        <i className="feather-check"></i>*/}
            {/*                        Look straight at camera and smile*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <i className="feather-check"></i>*/}
            {/*                        Maintain genuine and engaging facial expression*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <i className="feather-check"></i>*/}
            {/*                        Make sure your head and shoulders are covered*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <i className="feather-check"></i>*/}
            {/*                        Use natural lighting*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <i className="feather-check"></i>*/}
            {/*                        Simple, uncluttered and white background*/}
            {/*                    </li>*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*            <div className="col-lg-12 mt-5">*/}
            {/*                <div className="form-submit-group">*/}
            {/*                    <button*/}
            {/*                        type="submit"*/}
            {/*                        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"*/}
            {/*                    >*/}
            {/*                        /!*<Link href={"/become-a-tutor/cover-photo"} className={'text-white'}>*!/*/}

            {/*                        <span className="icon-reverse-wrapper">*/}
            {/*                      <span className="btn-text">Continue</span>*/}
            {/*                      <span className="btn-icon">*/}
            {/*                        <i className="feather-arrow-right"></i>*/}
            {/*                      </span>*/}
            {/*                      <span className="btn-icon">*/}
            {/*                        <i className="feather-arrow-right"></i>*/}
            {/*                      </span>*/}
            {/*                    </span>*/}
            {/*                        /!*</Link>*!/*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Form>*/}
            {/*</Formik>*/}
        </div>
        </div>
</>
)
    ;
};

export default Profile;
