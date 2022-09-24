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

const Contact_Info = ({ data, fetchData }) => {
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
   
      let body = {
        phoneNumber: inputText?.phoneNumber,
        website: inputText?.website,
        language: inputText?.language,
        addLine1: inputText?.addLine1,
        addLine2: inputText?.addLine2,
        postCode: inputText?.postCode,
        city: inputText?.city,
        state: inputText?.state,
        country: inputText?.country
      }
      console.log('body', body)
      setFlag(0)
      await ApiPost("/profile/update", body)
        .then(res => {
    const idValue = JSON.parse(localStorage.getItem("userinfo"))._id
            fetchData(idValue)
          SuccessToast("User has been Successfully Updated !!!");
        //   history.push("/users")
        })
        .catch(err => ErrorToast("User Update Failed"))
   
     
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
  return (
    <>
      <div class="general_info" id="">
        {
          flag === 0 && (
            <>
              <button className="btn btn-primary edit_profile_btn" onClick={() => {
                setFlag(1); setInputText({
                  phoneNumber: data?.phoneNumber,
                  website: data?.website,
                  language: data?.language,
                  addLine1: data?.addLine1,
                  addLine2: data?.addLine2,
                  postCode: data?.postCode,
                  city: data?.city,
                  state: data?.state,
                  country: data?.country
                })
              }}>Edit Profile</button>
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Phone Number</label>
                  <div class="col-lg-8">
                    <span class="fw-bolder fs-6 text-gray-800">
                      {data?.phoneNumber}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Website</label>
                  <div class="col-lg-8 fv-row">
                    <span class="fw-bold text-gray-800 fs-6">{data?.website}</span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Language</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.language}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Address</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.addLine1+ ", " + data.addLine2}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Post Code</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.postCode}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">City</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.city}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">State</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.state}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Country</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.country}
                    </span>
                  </div>
                </div>
                
              </div>
            </>
          )
        }
        {
          flag === 1 && (
            <>
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Phone Number</label>
                  <div class="col-lg-8">
                    <input type="text" name="phoneNumber" className="form-control" value={inputText?.phoneNumber} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Website</label>
                  <div className="col-lg-8">
                    <input type="text" name="website" className="form-control" value={inputText?.website} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Language</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="language" className="form-control" value={inputText?.language} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">AddressLine1</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="addLine1" className="form-control" value={inputText?.addLine1} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">AddressLine2</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="addLine2" className="form-control" value={inputText?.addLine2} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Post Code</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="postCode" className="form-control" value={inputText?.postCode} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">City</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="city" className="form-control" value={inputText?.city} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">State</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="state" className="form-control" value={inputText?.state} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Country</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="county" className="form-control" value={inputText?.country} />
                  </div>
                </div>
                

                <button className="btn btn-primary float-end" onClick={saveBtn}>Save Changes</button>
              </div>
            </>
          )
        }
      </div></>
  );
};

export default Contact_Info;
