import Link from "next/link";
import React, {useEffect, useState} from "react";
import {API_URL, API_KEY} from '../../constants/constant'
import Axios from "axios";
import { useRouter } from "next/router";
import { Formik, ErrorMessage, Form } from 'formik'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {Alert} from "reactstrap";
import * as Yup from "yup";


const UserValidationSchema = Yup.object().shape({
    sIs_fresher: Yup.string()
        .required('This field is required'),
    nTotal_exper: Yup.string()
        .required('This field is required'),
    nTotal_online_exper: Yup.string()
        .required('This field is required'),
    nCountryId: Yup.string()
        .required('This field is required'),
    sOrganization: Yup.string()
        .required('This field is required'),
    sPosition: Yup.string()
        .required('This field is required'),
    sFrom_years: Yup.string()
        .required('This field is required'),
    sTo_years: Yup.string()
        .required('This field is required')
})
const Experience = () => {
    const REACT_APP = API_URL
    const [country, setCountry] = useState([]);
    const [countryId, setcountryId] = useState('')
    const [hideFields, sethideFields] = useState(true)
    const defaultValue = new Date().getFullYear();
    const [regId, setregId] = useState('')
    const [Certi_Image, setCerti_Image] = useState('')
    // const [selectedYear, SetselectedYear] = useState(new Date().getFullYear());
    // const [thisYear, setthisYear] = useState(defaultValue);
    const minOffset = 0;
    const maxOffset = 53;
    const [Isfresher, setIsFresher] = useState('')
    const [fields, showFields] = useState(false)
    const [isLoading, setisLoading] = useState(false)



    const handleChange = (e, index) => {
        console.log(e.target.value)
        setIsFresher(e.target.checked)
        if(e.target.value === 'Experience') {
            showFields(true)
        } else {
            showFields(false)
        }
    }

    // const [file, setFile] = useState();


    const ExperienceList = []
    const [expFields, setExpFields] = useState([
        {
            sIs_fresher:Isfresher,
            nTotal_exper:'',
            nTotal_online_exper:'',
            nCountryId:101,
            sOrganization:'',
            sPosition:'',
            sFrom_years:'',
            sTo_years:''
        }
    ]);

    ExperienceList.push(expFields);

    const handleChangeTotalExp = (e, index) => {
        const { value } = e.target;
        let totalExp = parseFloat(value);

        // Validate that totalExp is a number
        if (isNaN(totalExp) || totalExp < 0) {
            return; // Ignore invalid inputs
        }

        const updatedFields = [...expFields];

        // Update the total experience
        updatedFields[index].nTotal_exper = totalExp;

        // Ensure online experience does not exceed total experience
        if (parseFloat(updatedFields[index].nTotal_online_exper) >= totalExp) {
            updatedFields[index].nTotal_exper = totalExp; // Set online experience to the total experience if it exceeds
        }

        setExpFields(updatedFields);
    };

    const handleChangeOnlineExp = (e, index) => {
        const { value } = e.target;
        let onlineExp = parseFloat(value);

        // Validate that onlineExp is a number
        if (isNaN(onlineExp) || onlineExp < 0) {
            return; // Ignore invalid inputs
        }

        const updatedFields = [...expFields];

        // Ensure online experience does not exceed total experience
        if (onlineExp >= parseFloat(updatedFields[index].nTotal_exper)) {
            alert('online exp cannot be grater than total exp')
            updatedFields[index].nTotal_online_exper = '';
            // onlineExp = updatedFields[index].nTotal_online_exper; // Cap online experience to the total experience
        } else {
            updatedFields[index].nTotal_online_exper = onlineExp;
        }

        setExpFields(updatedFields);
    };


    const handleChangeCountry = (e, index) => {
        const { value } = e.target;
        if(expFields.length >= 1){
            const updatedFields = [...expFields];
            updatedFields[index].nCountryId = parseInt(value);
            setExpFields(updatedFields);
        } else {
            const updatedFields = expFields;
            updatedFields.nCountryId = parseInt(value);
            setExpFields(updatedFields);
        }

    };

    const handleChangeOrganization = (e, index) => {
        const { value } = e.target;
        if(expFields.length >= 1){
            const updatedFields = [...expFields];
            updatedFields[index].sOrganization = value;
            setExpFields(updatedFields);
        } else {
            const updatedFields = expFields;
            updatedFields.sOrganization = value;
            setExpFields(updatedFields);
        }

    };
    const handleChangePosition = (e, index) => {
        const { value } = e.target;
        if(expFields.length >= 1){
            const updatedFields = [...expFields];
            updatedFields[index].sPosition = value;
            setExpFields(updatedFields);
        } else {
            const updatedFields = expFields;
            updatedFields.sPosition = value;
            setExpFields(updatedFields);
        }

    };
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
    const handleChangeImage = (event, index) => {
        const file = event.target.files[0];
        const updatedFields = [...certificationFields];

        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];

        if (event.target.files[0].size < 2000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        if(certificationFields.length >= 1){
                            const updatedFields = [...certificationFields];
                            updatedFields[index].sCerti_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            setcertificationFields(updatedFields);
                        } else {
                            const updatedFields = certificationFields;
                            updatedFields[0].sCerti_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            setcertificationFields(updatedFields);
                        }

                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                setCerti_Image(URL.createObjectURL(event.target.files[0]));
            } else {
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            alert('Please upload a file less than 2MB');
        }
    };

    const handleYearFromChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...expFields];

        updatedFields[index].sFrom_years = value;

        // Validation: Check if "To" year is less than "From" year
        if (
            updatedFields[index].sTo_years &&
            parseInt(updatedFields[index].sTo_years) < parseInt(value)

        ) {
            alert("Year of study to should not be less than Year of study from.");
            setExpFields('');
        }

        setExpFields(updatedFields)


    };
    const handleYearToChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...expFields];

        updatedFields[index].sTo_years = value;
        // Validation: Check if "To" year is less than "From" year
        if (
            updatedFields[index].sFrom_years &&
            parseInt(value) < parseInt(updatedFields[index].sFrom_years)
        ) {
            updatedFields[index].sTo_years = '';
            alert("Year of study to should not be less than Year of study from.");
        }

        setExpFields(updatedFields);
    };


    const handleAddExperience = () => {
        const newId = expFields.length + 1;
        const newExperience = {
            nTTEId: 0,
            sIs_fresher:Isfresher,
            nTotal_exper:'',
            nTotal_online_exper:'',
            nCountryId:'',
            sOrganization:'',
            sPosition:'',
            sFrom_years:'',
            sTo_years:''
        };
        setExpFields([...expFields, newExperience]);
    };

    const handleRemoveCertification = (id) => {
        const updatedFields = certificationFields.filter((field) => field.nTCId !== id);
        setcertificationFields(updatedFields);

        const deletedFields = certificationFields.filter((field) => field.nTCId === id);
        console.log('deletedFields', deletedFields)

        const deletedarray = deletedFields.map((item) => {
            return item.nTCId
        })
        console.log('deletedArray', deletedarray)
        setdeletedArray(deletedarray)

        const originalArray = updateArray;

        const elementsToRemove = deletedarray;

// Use filter() to create a new array excluding elements to remove
        const filteredArray = originalArray.filter((element) => !elementsToRemove.includes(element));

        setUpdatearray(filteredArray)

        Axios.delete(`${API_URL}/api/TutorCertification/DeleteTutorCerti/${EncryptData(deletedarray[0])}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                // window.location.reload()
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    };


    const bindCountry = () => {
        Axios.get(`${API_URL}/api/registration/BindCountry`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                if (res.data.length !== 0) {
                    setCountry(res.data)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const options = [];

    for (let i = minOffset; i <= maxOffset; i++) {
        const year = defaultValue - i;
        options.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const router = useRouter()
    const [tutorcnt, setTutorcnt] = useState('')
    const [updateArray, setUpdatearray] = useState([])
    const [deletedArray, setdeletedArray] = useState([])
    const [verifySts, setverifySts] = useState()
    const [nocertificate, setnocertificate] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)


            Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log("GetTutorVerify",res.data)
                    if (res.data.length !== 0) {
                        setverifySts(res.data[0].sTeachExper_verify)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })

            bindCountry()
            Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log(res.data)
                    if(res.data[0].cnt !== 0) {
                        setTutorcnt(res.data[0].cnt)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })

            Axios.get(`${API_URL}/api/TutorTeachExperience/GetTutorTeachExper/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if(res.data.length !== 0){
                        setIsFresher(res.data[0]['sIs_fresher'])
                        if(res.data[0]['sIs_fresher'] === 0){
                            showFields(true)
                        } else {
                            showFields(false)
                        }

                        const array = res.data.map((item, index) => {
                            return item.nTTEId
                        })

                        // console.log(array)
                        setUpdatearray(array)
                    }

                    // ---------------------
                    if(res.data.length !== 0) {
                        setExpFields(res.data)
                    } else {
                        setExpFields(expFields)
                    }
                    // ---------------------

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

                    <Formik
                        // validationSchema={UserValidationSchema}
                        initialValues={{
                            nRegId : regId,
                            sExperience : ExperienceList[0]
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, {resetForm}) => {
                            console.log(values)
                            if(verifySts === 2) {
                                router.push('/become-a-tutor/description')
                            } else {

                                if(tutorcnt !== 0) {
                                    if (fields === false) {
                                        // alert('hello')
                                        // fresher
                                        const noExperience = {
                                            nRegId : regId,
                                            sIsExperience : "fresher"
                                        }
                                        setisLoading(true)
                                        // console.log(noExperience)
                                        await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorBasicTeachExp`, noExperience, {
                                            headers: {
                                                ApiKey: `${API_KEY}`
                                                // 'Content-Type' : 'application/json'
                                            }
                                        }).then(res => {
                                            console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                router.push('/become-a-tutor/description')
                                            }
                                        })
                                            .catch(err => {
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    } else {
                                        // alert('yes education')
                                        const updateValues = [{
                                            nRegId : regId,
                                            updateId: updateArray,
                                            deleteId: deletedArray,
                                            sExperience : ExperienceList[0]
                                        }]
                                        // console.log(updateValues)
                                        // console.log(hideFields)
                                        setisLoading(true)
                                        await Axios.put(`${API_URL}/api/TutorTeachExperience/UpdateTutorTeachExper`, updateValues, {
                                            headers: {
                                                ApiKey: `${API_KEY}`
                                            }
                                        }).then(res => {
                                            console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
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
                                                                // let conditionString = url[positionToCheck - 1];

                                                                // Check the position of the first 3 numbers in array2
                                                                let positionOfThree = verify_string.findIndex(num => num === 3);

                                                                // Get the string at that position from array1
                                                                let stringForUrl = url[positionOfThree];

                                                                console.log('stringForUrl', stringForUrl)
                                                                router.push(`/become-a-tutor/description`)
                                                            } else {
                                                                router.push('/become-a-tutor/description')
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
                                } else {
                                    // console.log(hideFields)
                                    if (fields === true) {
                                        //no education
                                        const noExperience = {
                                            nRegId : regId,
                                            sIsExperience : "fresher"
                                        }
                                        setisLoading(true)
                                        // console.log(noExperience)
                                        await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorBasicTeachExp`, noExperience, {
                                            headers: {
                                                ApiKey: `${API_KEY}`
                                                // 'Content-Type' : 'application/json'
                                            }
                                        }).then(res => {
                                            console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                router.push('/become-a-tutor/description')
                                            }
                                        })
                                            .catch(err => {
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    } else {
                                        // alert('yes education')
                                        setisLoading(true)
                                        await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorTeachExp`, [values], {
                                            headers: {
                                                ApiKey: `${API_KEY}`
                                            }
                                        }).then(res => {
                                            console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                router.push('/become-a-tutor/description')
                                            }
                                        })
                                            .catch(err => {
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    }
                                }
                            }

                        }}
                    >
                        {({errors, touched}) => {
                            return (
                                <>
                                    <Form>
                                        {/*{console.log(educationFields.length)}*/}
                                        <div className="section-title mb-3">
                                            <h4 className="rbt-title-style-3">Teaching Experience</h4>
                                            {verifySts === 2 ? <>
                                                <Alert color='success'>
                                                    <h6 className='alert-heading m-0 text-center'>
                                                        Teaching experience verification has been approved by admin
                                                    </h6>
                                                </Alert>

                                            </> : <>
                                                {verifySts === 1 ? <>
                                                    <Alert color='warning'>
                                                        <h6 className='alert-heading m-0 text-center'>
                                                            Teaching experience verification is in pending state
                                                        </h6>
                                                    </Alert>

                                                </> : <>
                                                    {verifySts === 0 || verifySts === null ? <></> : <>
                                                        <Alert color='danger'>
                                                            <h6 className='alert-heading m-0 text-center'>
                                                                Teaching experience verification has been disapproved by admin
                                                            </h6>
                                                        </Alert>
                                                    </>}
                                                </>}
                                            </>}
                                        </div>
                                        <div className={'row'}>
                                            <div className={'col-lg-12'}>
                                                <label style={{fontSize: '16px'}}>
                                                    Are you a fresher or an experienced teacher?
                                                </label>
                                            </div>
                                            <div className={'d-flex mb-3'}>
                                                <div>
                                                    {Isfresher === 1 ? <>
                                                        <input id="sIs_fresher" disabled={verifySts === 2}
                                                               value={'Fresher'}
                                                               checked
                                                               onChange={handleChange} type="radio"
                                                               name="sIs_fresher"
                                                               className="custom-radio"/>
                                                        <label htmlFor="sIs_fresher">
                                                            Fresher
                                                        </label>
                                                    </> : <>
                                                        <input id="sIs_fresher" disabled={verifySts === 2}
                                                               value={'Fresher'}
                                                               onChange={handleChange} type="radio"
                                                               name="sIs_fresher"
                                                               className="custom-radio"/>
                                                        <label htmlFor="sIs_fresher">
                                                            Fresher
                                                        </label>
                                                    </>}
                                                </div>
                                                <div className={'ms-3'}>
                                                    {Isfresher === 0 ? <>
                                                        <input id="sIs_fresher" disabled={verifySts === 2}
                                                               value={'Experience'}
                                                               checked
                                                               onChange={handleChange} type="radio"
                                                               name="sIs_fresher"
                                                               className="custom-radio"/>
                                                        <label htmlFor="sIs_fresher">
                                                            Experience
                                                        </label>
                                                    </> : <>
                                                        <input id="sIs_fresher" disabled={verifySts === 2}
                                                               value={'Experience'}
                                                               onChange={handleChange} type="radio"
                                                               name="sIs_fresher"
                                                               className="custom-radio"/>
                                                        <label htmlFor="sIs_fresher">
                                                            Experience
                                                        </label>
                                                    </>}
                                                </div>
                                                {/*<div className={""}>*/}
                                                {/*    {Isfresher === 0 ? <>*/}
                                                {/*        <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                                {/*               value={'Experience'} checked*/}
                                                {/*               onChange={handleChange} type="radio"*/}
                                                {/*               name="sIs_fresher"/>*/}
                                                {/*        <label htmlFor="sIs_fresher">*/}
                                                {/*            Experience*/}
                                                {/*        </label>*/}
                                                {/*    </> : <>*/}
                                                {/*        <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                                {/*               value={'Experience'}*/}
                                                {/*               onChange={handleChange} type="radio"*/}
                                                {/*               name="sIs_fresher"/>*/}
                                                {/*        <label htmlFor="sIs_fresher">*/}
                                                {/*            Experience*/}
                                                {/*        </label>*/}
                                                {/*    </>}*/}

                                                {/*</div>*/}

                                                <ErrorMessage name='sIs_fresher' component='div'
                                                              className='field-error text-danger'/>
                                                <span className="focus-border"></span>
                                            </div>
                                            {fields ? <>
                                                {verifySts !== 2 ? <>
                                                    {expFields.length >= 1 ? <>
                                                        {expFields && expFields.map((experience, index) => {
                                                            // console.log(certification)
                                                            return (
                                                                <>
                                                                    <div key={experience.nTTEId}>
                                                                        <div className={'row'}>
                                                                            <div className="col-lg-6">
                                                                                <label style={{fontSize: '15px'}}>
                                                                                    How many years of total experience
                                                                                    in teaching?
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangeTotalExp(e, index)}
                                                                                        value={experience.nTotal_exper}
                                                                                        type="text"
                                                                                        placeholder="Total Experience"
                                                                                        name="nTotal_exper"
                                                                                    />
                                                                                    <ErrorMessage name='nTotal_exper' component='div'
                                                                                                  className='field-error text-danger'/>
                                                                                    <span className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Out of total how many years of
                                                                                    online teaching experience?
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangeOnlineExp(e, index)}
                                                                                        value={experience.nTotal_online_exper}
                                                                                        type="text"
                                                                                        name="nTotal_online_exper"
                                                                                        placeholder="Online Experience"/>
                                                                                    <ErrorMessage name='nTotal_online_exper' component='div'
                                                                                                  className='field-error text-danger'/>
                                                                                    <span className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6 mt-3">
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Country of experience
                                                                                </label>
                                                                                {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                                                                <select disabled={verifySts === 2}
                                                                                        className="w-100"
                                                                                        name={"nCountryId"}
                                                                                        value={experience.nCountryId}
                                                                                        onChange={(e) => handleChangeCountry(e, index)}>
                                                                                    {country.map((item, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <option key={index}
                                                                                                        value={item.nCountryId}>{item.sCountryname}</option>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </select>
                                                                                <ErrorMessage name='nCountryId' component='div'
                                                                                              className='field-error text-danger'/>
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Organization
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangeOrganization(e, index)}
                                                                                        value={experience.sOrganization}
                                                                                        name="sOrganization"
                                                                                        type="text"
                                                                                        placeholder="Organization"
                                                                                    />
                                                                                    <ErrorMessage name='sOrganization' component='div'
                                                                                                  className='field-error text-danger'/>
                                                                                    <span className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Position
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangePosition(e, index)}
                                                                                        value={experience.sPosition}
                                                                                        name="sPosition"
                                                                                        type="text"
                                                                                        placeholder="Position"
                                                                                    />
                                                                                    <ErrorMessage name='sPosition' component='div'
                                                                                                  className='field-error text-danger'/>
                                                                                    <span className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Year of study from
                                                                                </label>
                                                                                <select disabled={verifySts === 2}
                                                                                        name={"sFrom_years"}
                                                                                        value={experience.sFrom_years}
                                                                                        onChange={(e) => handleYearFromChange(e, index)}>
                                                                                    {options}
                                                                                </select>
                                                                                <ErrorMessage name='sFrom_years' component='div'
                                                                                              className='field-error text-danger'/>
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Year of study to
                                                                                </label>
                                                                                <select disabled={verifySts === 2}
                                                                                        value={experience.sTo_years}
                                                                                        name={"sTo_years"}
                                                                                        onChange={(e) => handleYearToChange(e, index)}>
                                                                                    <option value="Present">Present
                                                                                    </option>
                                                                                    {options}
                                                                                </select>
                                                                                <ErrorMessage name='sTo_years' component='div'
                                                                                              className='field-error text-danger'/>
                                                                                <span className="focus-border"></span>
                                                                            </div>

                                                                            {verifySts === 2 ? <></> : <>
                                                                                <div
                                                                                    className="col-lg-12 text-end mt-2">
                                                                                    {expFields.length > 1 ? <>
                                                                                        <button type={'button'}
                                                                                                className="btn btn-danger"
                                                                                                onClick={() => handleRemoveCertification(experience.nTTEId)}>Remove
                                                                                        </button>
                                                                                    </> : <>

                                                                                    </>}

                                                                                </div>
                                                                            </>}

                                                                        </div>
                                                                    </div>

                                                                </>
                                                            )
                                                        })
                                                        }

                                                        {verifySts === 2 ? <></> : <>
                                                            <div className={'col-lg-5 mt-5 mb-5'}>
                                                                <button
                                                                    type={'button'}
                                                                    className="rbt-btn-link left-icon border-0 bg-white"
                                                                    onClick={handleAddExperience}
                                                                >
                                                                    <i className="feather-plus"></i>Add Experience
                                                                </button>
                                                            </div>
                                                        </>}
                                                    </> : ''}
                                                </> : <></>}

                                            </> : <>
                                            {/*    <div key={expFields.nTTEId}>*/}
                                            {/*        <div className={'row'}>*/}
                                            {/*            <div className={'col-lg-6 mt-4'}>*/}
                                            {/*                <label style={{fontSize: '15px'}}>*/}
                                            {/*                    How many years of total experience in teaching?*/}
                                            {/*                </label>*/}
                                            {/*                <div className="input-group mb-3">*/}
                                            {/*                    <input*/}
                                            {/*                        readOnly={verifySts === 2}*/}
                                            {/*                        type="number"*/}
                                            {/*                        className="form-control"*/}
                                            {/*                        placeholder="Total experience"*/}
                                            {/*                        // value={expFields.nTotal_exper}*/}
                                            {/*                        value={expFields[0].nTotal_exper}*/}
                                            {/*                        onChange={(e) => handleTotalExp(e, index)}*/}
                                            {/*                    />*/}
                                            {/*                    <div className="input-group-append">*/}
                                            {/*                        <span style={{fontSize: '16px'}}*/}
                                            {/*                              className="input-group-text h-100">years</span>*/}
                                            {/*                    </div>*/}
                                            {/*                </div>*/}
                                            {/*            </div>*/}
                                            {/*            <div className={'col-lg-6 mt-4'}>*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Out of total how many years of online teaching*/}
                                            {/*                    experience?*/}
                                            {/*                </label>*/}
                                            {/*                <div className="input-group">*/}
                                            {/*                    <input*/}
                                            {/*                        type="text"*/}
                                            {/*                        readOnly={verifySts === 2}*/}
                                            {/*                        value={expFields.nTotal_online_exper}*/}
                                            {/*                        className="form-control"*/}
                                            {/*                        placeholder="online experience"*/}
                                            {/*                        onChange={(e) => handleChangeOnlineExp(e)}*/}
                                            {/*                    />*/}
                                            {/*                    <div className="input-group-append">*/}
                                            {/*<span style={{fontSize: '14px'}}*/}
                                            {/*      className="input-group-text h-100">years</span>*/}
                                            {/*                    </div>*/}
                                            {/*                </div>*/}
                                            {/*            </div>*/}

                                            {/*            <div className={'col-lg-6 mt-3'}>*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Organization*/}
                                            {/*                </label>*/}
                                            {/*                <div className="form-group">*/}
                                            {/*                    <input*/}
                                            {/*                        readOnly={verifySts === 2}*/}
                                            {/*                        onChange={(e) => handleChangeOrganization(e)}*/}
                                            {/*                        value={expFields.sOrganization}*/}
                                            {/*                        name="organization"*/}
                                            {/*                        type="text"*/}
                                            {/*                        placeholder="Organization"*/}
                                            {/*                    />*/}
                                            {/*                    <span className="focus-border"></span>*/}
                                            {/*                </div>*/}
                                            {/*            </div>*/}
                                            {/*            <div className={'col-lg-6 mt-3'}>*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Position*/}
                                            {/*                </label>*/}
                                            {/*                <div className="form-group">*/}
                                            {/*                    <input*/}
                                            {/*                        readOnly={verifySts === 2}*/}
                                            {/*                        onChange={(e) => handleChangePosition(e)}*/}
                                            {/*                        value={expFields.sPosition}*/}
                                            {/*                        name="position"*/}
                                            {/*                        type="text"*/}
                                            {/*                        placeholder="Position"*/}
                                            {/*                    />*/}
                                            {/*                    <span className="focus-border"></span>*/}
                                            {/*                </div>*/}
                                            {/*            </div>*/}
                                            {/*            <div className={'col-lg-6 mt-3'}>*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Year of study from*/}
                                            {/*                </label>*/}
                                            {/*                <select disabled={verifySts === 2}*/}
                                            {/*                        value={expFields.sFrom_years}*/}
                                            {/*                        onChange={(e) => handleYearFromChange(e)}>*/}
                                            {/*                    {options}*/}
                                            {/*                </select>*/}
                                            {/*            </div>*/}
                                            {/*            <div className={'col-lg-6 mt-3'}>*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Year of study to*/}
                                            {/*                </label>*/}
                                            {/*                <select disabled={verifySts === 2}*/}
                                            {/*                        value={expFields.sTo_years}*/}
                                            {/*                        onChange={(e) => handleYearToChange(e)}>*/}
                                            {/*                    <option value="Present">Present</option>*/}
                                            {/*                    {options}*/}
                                            {/*                </select>*/}
                                            {/*            </div>*/}
                                            {/*            <div className="col-lg-6 mt-3">*/}
                                            {/*                <label style={{fontSize: '16px'}}>*/}
                                            {/*                    Country of experience*/}
                                            {/*                </label>*/}
                                            {/*                /!*<div className="rbt-modern-select bg-transparent height-45">*!/*/}
                                            {/*                <select disabled={verifySts === 2} className="w-100"*/}
                                            {/*                        value={expFields.nCountryId}*/}
                                            {/*                        onChange={(e) => handleChangeCountry(e)}>*/}
                                            {/*                    {country.map((item, index) => {*/}
                                            {/*                        return (*/}
                                            {/*                            <>*/}
                                            {/*                                <option key={index}*/}
                                            {/*                                        value={item.nCountryId}>{item.sCountryname}</option>*/}
                                            {/*                            </>*/}
                                            {/*                        )*/}
                                            {/*                    })}*/}
                                            {/*                </select>*/}
                                            {/*            </div>*/}
                                            {/*            {verifySts !== 2 ? <></> : <>*/}
                                            {/*                <div className="col-lg-12 text-end mt-2">*/}
                                            {/*                    {expFields.length > 1 ? <>*/}
                                            {/*                        <button type={'button'} className="btn btn-danger"*/}
                                            {/*                                onClick={() => handleRemoveExperience(expFields.nTTEId)}>Remove*/}
                                            {/*                        </button>*/}
                                            {/*                    </> : <></>}*/}

                                            {/*                </div>*/}
                                            {/*            </>}*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}

                                            </>}


                                            <div className="col-lg-12 mt-5">
                                                <div className="form-submit-group">
                                                    {isLoading ? <>
                                                        <button disabled={true} type="submit" className="rbt-btn btn-md btn-gradient w-100">
                                                            <span className="btn-text">
                                                                <i className="feather-loader"></i>isLoading...</span>
                                                        </button>
                                                    </> : <>
                                                        <button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
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

        </>
    );
};

export default Experience;
