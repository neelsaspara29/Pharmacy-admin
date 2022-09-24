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
const Document_Info = ({ data }) => {
  const [flag, setFlag] = useState(0);
  const [inputText, setInputText] = useState({})
  const [imgUrl, setImgUrl] = useState(data?.profile_image)
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

  const handelView = (e) => {
    window.open(e, "width=500,height=500,top=100,left=500")
  }
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
                  <label class="col-lg-4 fw-bold text-muted">Drug Licence</label>
                  <div class="col-lg-8 d-flex align-items-center">
                  <div clas sName="symbol symbol-50 symbol-light">
              <a
                title="Edit customer"
                className="btn  btn-primary btn-hover-danger btn-sm me-3"
                onClick={data.drugLicence && (() => {handelView(data.drugLicence)})}
                
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  {data.drugLicence ? "View" : "Not Uploaded"}
                </span>
              </a>
              
            </div>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Gst Number</label>
                  <div class="col-lg-8 d-flex align-items-center">
                  <div clas sName="symbol symbol-50 symbol-light">
              <a
                title="Edit customer"
                className="btn  btn-primary btn-hover-danger btn-sm me-3"
                onClick={data.gst && (() => {handelView(data.gst)})}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                {data.gst ? "View" : "Not Uploaded"}
                </span>
              </a>
              
            </div>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Pan Card</label>
                  <div class="col-lg-8 d-flex align-items-center">
                  <div clas sName="symbol symbol-50 symbol-light">
              <a
                title="Edit customer"
                className="btn  btn-primary btn-hover-danger btn-sm me-3"
                onClick={data.panCard && (() => {handelView(data.panCard)})}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                {data.panCard ? "View" : "Not Uploaded"}
                </span>
              </a>
              
            </div>
                  </div>
                </div>
                              
                    
                 
              </div>
            </>
          
        
       
      </div></>
  );
};

export default Document_Info;
