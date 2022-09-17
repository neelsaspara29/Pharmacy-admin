import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";

const Zazzi_Info = ({ data }) => {
  const [flag, setFlag] = useState(0);
  const [inputText, setInputText] = useState({})
  const [categoryData, setCategoryData] = useState([])
  const history = useHistory()

  const handleChange = (e) => {
    setInputText({ ...inputText, [e.target.name]: e.target.value });
  }
  const saveBtn = async () => {
    let body = {
      id: data?._id,
      categoryId: inputText?.category,
      sessionTime: inputText?.sessionTime,
      equipment: inputText?.equipment,
      props: inputText?.props,
    }
    console.log('body', body)
    await ApiPut("/update_photographer_profile", body)
      .then(res => {
        SuccessToast("photographer has been Successfully Updated !!!");
        setFlag(0)
        history.push("/photographers")
      })
      .catch(err => ErrorToast("photographer Update Failed"))
  }
  const getCategoryApi = async () => {
    await ApiGet("/category")
      .then(res => setCategoryData(res?.data?.data))
      .catch(err => console.log('res_category', err))
  }
  console.log('categoryData', categoryData)
  useEffect(() => {
    getCategoryApi()
  }, [])
  return (
    <>
      <div class="zazzi_info position-relative" id="">
        {flag === 0 && (
          <>
            <button className="btn btn-primary edit_profile_btn" onClick={() => {
              setFlag(1); setInputText({
                category: data?.category[0]?._id,
                sessionTime: data?.sessionTime,
                equipment: data?.equipment,
                props: data?.props,
              })
            }}>Edit Profile</button>
            <div class="card-body pt-9 pb-0 mx-0 px-0">
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Category</label>
                <div class="col-lg-8">
                  <span class="fw-bolder fs-6 text-gray-800">
                    {data?.category && data?.category[0]?.name}
                  </span>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Min. Session Time</label>
                <div class="col-lg-8 fv-row">
                  <span class="fw-bold text-gray-800 fs-6">
                    {data?.sessionTime}
                  </span>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Equipment</label>
                <div class="col-lg-8 d-flex align-items-center">
                  <span class="fw-bolder fs-6 text-gray-800 me-2">
                    {!data?.equipment ? "-" : data?.equipment}
                  </span>
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Props</label>
                <div class="col-lg-8">
                  <a class="fw-bold fs-6 text-gray-800 text-hover-primary">
                    {!data?.props ? "-" : data?.props}
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
        {flag === 1 && (
          <>
            <div class="card-body pt-9 pb-0 mx-0 px-0">
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Category</label>
                <div class="col-lg-8">
                  {/* <input type="text" className="form-control" name="category" value={inputText?.category} onChange={handleChange} /> */}
                  <select name="categoryId" id="" className="form-control" defaultValue={data?.category[0]?._id} onChange={handleChange}>
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
                <label class="col-lg-4 fw-bold text-muted">Min. Session Time</label>
                <div class="col-lg-8 fv-row">
                  <input type="text" className="form-control" name="sessionTime" value={inputText?.sessionTime} onChange={handleChange} />
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Equipment</label>
                <div class="col-lg-8 d-flex align-items-center">
                  <input type="text" className="form-control" name="equipment" value={inputText?.equipment} onChange={handleChange} />
                </div>
              </div>
              <div class="row mb-7">
                <label class="col-lg-4 fw-bold text-muted">Props</label>
                <div class="col-lg-8">
                  <input type="text" className="form-control" name="props" value={!data?.props ? "-" : inputText?.props} onChange={handleChange} />
                </div>
              </div>
              <button className="btn btn-primary float-end" onClick={saveBtn}>Save Changes</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Zazzi_Info;
