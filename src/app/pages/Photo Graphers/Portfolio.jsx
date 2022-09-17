import React, { useState } from "react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ApiGet, ApiPut, ApiUpload } from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { ImCross } from 'react-icons/im'
import { FaPlus } from 'react-icons/fa'

const Portfolio = ({ data }) => {
  const [flag, setFlag] = useState(0);
  const [inputText, setInputText] = useState({})
  const [categoryData, setCategoryData] = useState([])
  const [skillsData, setSkillsData] = useState([])
  const [newImg, setNewImg] = useState([])
  const history = useHistory()
  console.log('data', data)
  console.log('newImg', newImg)
  const handleChange = (e) => {
    setInputText({ ...inputText, [e.target.name]: e.target.value });
  }
  const saveBtn = async () => {
    let body = {
      id: data?._id,
      categoryId: inputText?.category,
      skillId: inputText?.skills,
      rate: inputText?.rate,
      image: newImg
    }
    if (newImg.length === 5) (
      await ApiPut("/update_photographer_profile", body)
        .then(res => {
          SuccessToast("photographer has been Successfully Updated !!!");
          setFlag(0);
          history.push("/photographers");
        })
        .catch(err => ErrorToast("photographer Update Failed")))
    else (ErrorToast("Please upload minimum 5 Images"))
  }
  const getCategoryApi = async () => {
    await ApiGet("/category")
      .then(res => setCategoryData(res?.data?.data))
      .catch(err => console.log('res_category', err))
  }
  const getSkillsApi = async () => {
    await ApiGet("/skill")
      .then(res => setSkillsData(res?.data?.data))
      .catch(err => console.log('res_category', err))
  }
  const imgDelete = (ids) => {
    const upImg = newImg.filter((c, i) => {
      return ids !== i
    })
    setNewImg(upImg)
  }
  const imageChange = async (e) => {
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/profile", formData)
      .then(res => { setNewImg([...newImg, res?.data?.data?.image]) })
      .catch(err => console.log('res_blob', err))
  }

  // console.log('categoryData', categoryData)
  // console.log('skillsData', skillsData)
  useEffect(() => {
    getCategoryApi();
    getSkillsApi();
    setNewImg(data?.image)
  }, [])

  return (
    <>
      <div class="portfolio " id="">
        {flag === 0 && (
          <>
            <div class="card-body pt-9 pb-0 mx-0 px-0 position-relative">
              <button className="btn btn-primary edit_profile_btn" onClick={() => {
                setFlag(1); setInputText({
                  category: data?.category[0]?._id,
                  skills: data?.skills[0]?._id,
                  rate: data?.rate,
                })
              }}>Edit Profile</button>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Category</label>
                <div class="col-lg-8">
                  <span class="fw-bolder fs-6 text-gray-800">
                    {data?.category && data?.category[0]?.name}
                  </span>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Skill Level</label>
                <div class="col-lg-8 fv-row">
                  <span class="fw-bold text-gray-800 fs-6">
                    {data?.skills && data?.skills[0]?.skill}
                  </span>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Price per hours</label>
                <div class="col-lg-8 d-flex align-items-center">
                  <span class="fw-bolder fs-6 text-gray-800 me-2">
                    {!data?.rate ? "-" : data?.rate}
                  </span>
                </div>
              </div>

              <div className="row mb-7">
                <div className="col-lg-12">
                  <Form.Group md="12">
                    <Form.Label
                      class="col-lg-4 fw-bold text-muted"
                      style={{ marginLeft: "-12px" }}
                    >
                      Images
                    </Form.Label>
                    <div
                      className="flex flex-row flex-wrap"
                      style={{ display: "flex" }}
                    >
                      {data?.image.map((img) => (
                        <div
                          className=""
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "9px",
                          }}
                        >
                          <img
                            className="rounded"
                            width={"100px"}
                            height={"100px"}
                            src={img}
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </div>

                {/* <label class="col-lg-4 fw-bold text-muted">Price per hours</label>
            <div class="col-lg-8 d-flex align-items-center">
              <span class="fw-bolder fs-6 text-gray-800 me-2">
                {!data?.rate ? "-" : data?.rate}
              </span>
            </div> */}
              </div>
            </div>
          </>
        )
        }
        {flag === 1 && (
          <>
            <div class="card-body pt-9 pb-0 mx-0 px-0">
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Category</label>
                <div class="col-lg-8">
                  <select name="category" id="" className="form-control" defaultValue={data?.category[0]?._id} onChange={handleChange}>
                    {
                      categoryData?.map((val, i) => {
                        return (
                          <option value={val?._id} key={i}>{val?.name}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Skill Level</label>
                <div class="col-lg-8 fv-row">
                  <select name="skills" id="" className="form-control" defaultValue={data?.skills[0]?._id} onChange={handleChange}>
                    {
                      skillsData?.map((val, i) => {
                        return (
                          <option value={val?._id} key={i}>{val?.skill}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Price per hours</label>
                <div class="col-lg-8 d-flex align-items-center">
                  <input type="text" className="form-control" name="rate" value={inputText?.rate} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-7">
                <div className="col-lg-12">
                  <Form.Group md="12">
                    <Form.Label
                      class="col-lg-4 fw-bold text-muted"
                      style={{ marginLeft: "-12px" }}
                    >
                      Images
                    </Form.Label>
                    <div
                      className="flex flex-row flex-wrap"
                      style={{ display: "flex" }}
                    >
                      {newImg?.map((img, i) => (
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "9px",
                            position: "relative"
                          }}
                        >
                          <img
                            className="rounded"
                            width={"100px"}
                            height={"100px"}
                            src={img}
                          />
                          <div className="mdCancel_Main" onClick={() => imgDelete(i)}>
                            <ImCross className="mdCancel" />
                          </div>
                        </div>
                      ))}
                      <label htmlFor="addImg" className="plus_main">
                        <FaPlus className="faPlus" />
                      </label>
                      <input type="file" name="" id="addImg" hidden onChange={imageChange} />
                    </div>
                  </Form.Group>
                </div>

                {/* <label class="col-lg-4 fw-bold text-muted">Price per hours</label>
            <div class="col-lg-8 d-flex align-items-center">
              <span class="fw-bolder fs-6 text-gray-800 me-2">
                {!data?.rate ? "-" : data?.rate}
              </span>
            </div> */}
              </div>
              <button className="btn btn-primary float-end" onClick={saveBtn}>Save Changes</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Portfolio;
