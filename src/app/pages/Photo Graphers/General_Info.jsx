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
const General_Info = ({ data }) => {
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
  return (
    <>
      <div class="general_info" id="">
        {
          flag === 0 && (
            <>
              <button className="btn btn-primary edit_profile_btn" onClick={() => {
                setFlag(1); setInputText({
                  firstName: data?.firstName,
                  lastName: data?.lastName,
                  email: data?.email,
                  dob: data?.dob,
                  address: data?.address,
                  gender: data?.gender,
                  language: data?.language,
                })
              }}>Edit Profile</button>
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">First Name</label>
                  <div class="col-lg-8">
                    <span class="fw-bolder fs-6 text-gray-800">
                      {data?.firstName}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Last Name</label>
                  <div class="col-lg-8 fv-row">
                    <span class="fw-bold text-gray-800 fs-6">{data?.lastName}</span>
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
                {pathName === "/photoGrapher_details" &&
                  <>
                    <div class="row mb-7">
                      <label class="col-lg-4 fw-bold text-muted">DOB</label>
                      <div class="col-lg-8">
                        <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                          {!data?.dob ? "-" : data?.dob}
                        </a>
                      </div>
                    </div>
                    <div class="row mb-7">
                      <label class="col-lg-4 fw-bold text-muted">Address</label>
                      <div class="col-lg-8">
                        <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                          {!data?.address ? "-" : data?.address}
                        </a>
                      </div>
                    </div>
                    <div class="row mb-7">
                      <label class="col-lg-4 fw-bold text-muted">Gender</label>
                      <div class="col-lg-8">
                        <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                          {console.log("gender", data.gender)}
                          {data?.gender == 0
                            ? "Male"
                            : data?.gender == 1
                              ? "Female"
                              : data?.gender == 3
                                ? "Other"
                                : "-"}
                        </a>
                      </div>
                    </div>
                    <div class="row mb-7">
                      <label class="col-lg-4 fw-bold text-muted">Language</label>
                      <div class="col-lg-8">
                        <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                          {!data?.language ? "-" : data?.language}
                        </a>
                      </div>
                    </div>
                  </>}
              </div>
            </>
          )
        }
        {
          flag === 1 && (
            <>
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                <div className="mb-7 text-center">
                  <label className="position-relative">
                    <img src={`${imgUrl ? imgUrl : data?.profile_image}`} alt="imgUrl" className="editImg" />
                    <label htmlFor="inFile" className="shadow d-inline inFiles" role="button">
                      <FaPen className="faPen" />
                    </label>
                  </label>
                  <input type="file" name="" id="inFile" hidden onChange={imageChange} />
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">First Name</label>
                  <div class="col-lg-8">
                    <input type="text" name="firstName" className="form-control" value={inputText?.firstName} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Last Name</label>
                  <div className="col-lg-8">
                    <input type="text" name="lastName" className="form-control" value={inputText?.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Email</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="email" className="form-control" value={inputText?.email} disabled />
                  </div>
                </div>
                {pathName === "/photoGrapher_details" && <><div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">DOB</label>
                  <div class="col-lg-8">
                    <input type="date" name="dob" className="form-control" value={inputText?.dob} onChange={handleChange} />
                  </div>
                </div>
                  <div class="row mb-7">
                    <label class="col-lg-4 fw-bold text-muted">Address</label>
                    <div class="col-lg-8">
                      <input type="text" name="address" className="form-control" value={inputText?.address} onChange={handleChange} />
                    </div>
                  </div>
                  <div class="row mb-7">
                    <label class="col-lg-4 fw-bold text-muted">Gender</label>
                    <div class="col-lg-8">
                      {/* <input type="text" name="lastName" className="form-control" value={`${inputText?.gender === 0 ? "Male" : inputText?.gender === 1 ? "Female" : inputText?.gender === 3 ? "other" : ""}`} onChange={handleChange} /> */}
                      <select name="gender" id="" className="form-control" defaultValue={`${inputText?.gender === 0 ? "0" : inputText?.gender === 1 ? "1" : inputText?.gender === 3 ? "3" : ""}`} onChange={handleChange}>
                        <option value="0" >Male</option>
                        <option value="1">Female</option>
                        <option value="3">Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-7">
                    <label class="col-lg-4 fw-bold text-muted">Language</label>
                    <div class="col-lg-8">
                      <input type="text" name="language" className="form-control" value={inputText?.language} onChange={handleChange} />
                    </div>
                  </div></>}

                <button className="btn btn-primary float-end" onClick={saveBtn}>Save Changes</button>
              </div>
            </>
          )
        }
      </div></>
  );
};

export default General_Info;
