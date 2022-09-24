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
import { Form, Modal } from "react-bootstrap";
import Avatar from "../../../../src/media/icons/avatar.png";
import Avatar2 from "../../../../src/media/icons/avatar2.png";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { FaPen } from 'react-icons/fa'
import moment from "moment";
import { handleInputChange } from "react-select/dist/utils-2db2ca57.cjs.prod";

const Basic_Info = ({ data, fetchData }) => {
  const [flag, setFlag] = useState(0);
  const [inputText, setInputText] = useState({})
  const [imgUrl, setImgUrl] = useState(data?.profile_image)
  const [genderState, setGenderState] = useState();
  const [ActiveState, setActiveState] = useState()
  const history = useHistory()
  let pathName = window.location.pathname


  console.log('data_GI', data)
  console.log('inputText', inputText)
  const handleChange = (e) => {
    console.log("date", e.target.value)
    setInputText({ ...inputText, [e.target.name]: e.target.value });
  }
  const saveBtn = async () => {
   
      let body = {
        name: inputText?.name,
        userName: inputText?.userName,
        email: inputText?.email,
        dob: inputText?.date,
        gender: genderState,
        role: inputText?.role,
        status: ActiveState,
        department: inputText?.department
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
  useEffect(() => {
    setGenderState(data?.gender)
    setActiveState(data?.status)
  },[data])
  return (
    <>
      <div class="general_info" id="">
        {
          flag === 0 && (
            <>
              <button className="btn btn-primary edit_profile_btn" onClick={() => {
                setFlag(1); setInputText({
                  name: data?.name,
                  userName: data?.userName,
                  email: data?.email,
                  dob: data?.date,
                  gender: data?.gender,
                  role: data?.role,
                  status: data?.status,
                  department: data?.department
                })
              }}>Edit Profile</button>
              <div class="card-body pt-9 pb-0 mx-0 px-0">
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Name</label>
                  <div class="col-lg-8">
                    <span class="fw-bolder fs-6 text-gray-800">
                      {data?.name}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">User Name</label>
                  <div class="col-lg-8 fv-row">
                    <span class="fw-bold text-gray-800 fs-6">{data?.userName}</span>
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
                  <label class="col-lg-4 fw-bold text-muted">DOB</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {moment(data?.dob).format("dd/mm/yyyy")}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Gender</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.gender == 0 ? "Male" : "Female"}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Role</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.role == 0 && "Admin" }
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Status</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.status == 0 ? "Active" : "InActive"}
                    </span>
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Department</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <span class="fw-bolder fs-6 text-gray-800 me-2">
                      {data?.department}
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
                  <label class="col-lg-4 fw-bold text-muted">Name</label>
                  <div class="col-lg-8">
                    <input type="text" name="name" className="form-control" value={inputText?.name} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">User Name</label>
                  <div className="col-lg-8">
                    <input type="text" name="userName" className="form-control" value={inputText?.userName} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Email</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="email" className="form-control" value={inputText?.email} onChange={handleChange} />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">DOB</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="date" name="dob"  className="form-control" value={`${moment(inputText.dob).format("YYYY-MM-DD")}`} onChange={handleChange} />
                    
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Gender</label>
                  <div class="col-lg-8 d-flex align-items-center">
                  <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="Male"
            name="group1"
            type="radio"
            id={`inline-radio-1`}
            onClick={() => {
                setGenderState(0)
            }}
            checked = {genderState == 0 ? true : false}
            
          />
          <Form.Check
            inline
            label="Female"
            name="group1"
            type="radio"
            onClick={() => {setGenderState(1)}}
            id={`inline-radio-2`}
            checked = {genderState == 1 ? true : false}
          />
         
        </div>
                    
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Status</label>
                  <div class="col-lg-8 d-flex align-items-center">
                  <div key={`inline-radio`} className="mb-3">
          <Form.Check
            inline
            label="Active"
            name="group2"
            type="radio"
            id={`inline-radio-1`}
            onClick={() => {
                setActiveState(0)
            }}
            checked = {ActiveState == 0 ? true : false}
          />
          <Form.Check
            inline
            label="InActive"
            name="group2"
            type="radio"
            onClick={() => {setActiveState(1)}}
            id={`inline-radio-2`}
            chcked = {ActiveState == 1 ? true : false}
          />
         
        </div>
                    
                  </div>
                </div>
                
                
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Department</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input type="text" name="department" className="form-control" value={inputText?.department} onChange={handleChange} />
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

export default Basic_Info;
