import React, { useEffect, useState } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  ApiUpload,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import queryString from "query-string";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";
import { Modal } from "react-bootstrap";
import Avatar from "../../../../src/media/icons/avatar.png";
import Avatar2 from "../../../../src/media/icons/avatar2.png";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { FaPen } from 'react-icons/fa'
import { Dvr } from "@material-ui/icons";
const General_Info = ({ data }) => {
  const [flag, setFlag] = useState(0);
  const [inputText, setInputText] = useState({})
  const [imgUrl, setImgUrl] = useState(data?.profile_image)
  const [changed, setChanged] = useState(false)
  const [dv, setDv] = useState("")
  const history = useHistory()
  let pathName = window.location.pathname


  console.log('data_GI', data)
  console.log('inputText', inputText)
  const handleChange = (e) => {
    setInputText({ ...inputText, [e.target.name]: e.target.value });
  }
  const saveBtn = async () => {
    if (pathName === "/user_details") {
      let body = {
        id: data?._id,
        firstName: inputText?.firstName,
        lastName: inputText?.lastName,
        profile_image: imgUrl
      }
      console.log('body', body)
      setFlag(0)
      await ApiPut("/update_user_profile", body)
        .then(res => {
          SuccessToast("User has been Successfully Updated !!!");
          history.push("/users")
        })
        .catch(err => ErrorToast("User Update Failed"))
    }
    else if (pathName === "/photoGrapher_details") {
      let body = {
        id: data?._id,
        firstName: inputText?.firstName,
        lastName: inputText?.lastName,
        address: inputText?.address,
        dob: inputText?.dob,
        gender: Number(inputText?.gender),
        language: inputText?.language,
        profile_image: imgUrl
      }
      console.log('body', body)
      setFlag(0)
      await ApiPut("/update_photographer_profile", body)
        .then(res => {
          SuccessToast("photographer has been Successfully Updated !!!");
          history.push("/photographers")
        })
        .catch(err => ErrorToast("photographer Update Failed"))
    }
  }
  const imageChange = async (e) => {
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/profile", formData)
      .then(res => setImgUrl(res?.data?.data?.image))
      .catch(err => console.log('res_blob', err))
  }

  const handleSubmit = async () => {
    const idValue = queryString.parse(window.location.search);

    let body = {
        id: idValue,
        discount: parseInt(dv)
    }
    await ApiPost("/retailers/update/discount", body)
        .then(res => {
          SuccessToast("Retailer has been Successfully Updated !!!");
          setChanged(false)
         
        })
        .catch(err => ErrorToast("Retailer Update Failed"))
  }
  useEffect(() => {
    console.log("cc",data)

      setDv(data?.discount)
      if(!data?.discount) {
        setChanged(true)
      }else {
        setChanged(false)
      }
  },[data])
  return (
    <>
      <div class="general_info" id="">
        
            <>
              {/* <button className="btn btn-primary edit_profile_btn" onClick={() => {
                setFlag(1); setInputText({
                  firstName: data?.firstName,
                  lastName: data?.lastName,
                  email: data?.email,
                  dob: data?.dob,
                  address: data?.address,
                  gender: data?.gender,
                  language: data?.language,
                })
              }}>Edit Profile</button> */}
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Shop Name</label>
                  <div class="col-lg-8">
                    <span class="fw-bolder fs-6 text-gray-800">
                      {data?.shopName}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Discount</label>
                  <div class="col-lg-8">
                    {dv && !changed ? <><span class="fw-bolder fs-6 text-gray-800">
                      {dv}
                    
                      
                      <button className="btn btn-primary ms-5" onClick={() => {setChanged(true)}}>Change</button>
                    
                    </span>

                    </> : <><div>
                      <input type={"text"} value={dv} onChange={(e) => {setDv(e.target.value)}} style={{width: "50px", height: "35px"}} />
                      <button className="btn btn-primary ms-3" onClick={handleSubmit}>Change</button>
                    </div></>}
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Mobile Number</label>
                  <div class="col-lg-8">
                    <span class="fw-bolder fs-6 text-gray-800">
                      {data?.phoneNumber}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Email</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.email}
                    </span>
                  </div>
                </div>
                
           
                    
                    <div class="row mb-7">
                      <label class="col-lg-4 fw-bold text-muted">Address</label>
                      <div class="col-lg-8">
                        <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                          not added
                        </a>
                      </div>
                    </div>
                    
                    
                 
              </div>
            </>
          
        
       
      </div></>
  );
};

export default General_Info;
