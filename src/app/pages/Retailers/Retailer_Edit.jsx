import React, { useEffect, useState } from "react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  ApiUpload,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import { makeStyles } from "@material-ui/styles";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import * as Yup from "yup";
import {
  Input,
  Select,
  DatePickerField,
} from "../../../_metronic/_partials/controls";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
// Validation schema
const CustomerEditSchema = Yup.object().shape({
  category: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Category is required"),
});
const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    marginBottom: "50px",
    marginRight: "40px",
    marginLeft: "40px",
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));
const Retailer_Edit = ({
  
  open,
  setOpen,
  fetchDatas,
  currentpage, pagesize, searching
 
}) => {
  // console.log(props);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [update, getUpdate] = useState(true);
  const [errors, setError] = useState({});
  const [images, setImage] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [mainCategory, setMainCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const [validated, setValidated] = useState(false);
  const [modalState, setModalState] = useState(1);
  const validateForm = () => {
    console.log("valid");
    let errors = {};
    let formIsValid = true;
    if (!data.shopName) {
      formIsValid = false;
      document.getElementById("shopName").style.border = "2px solid #F64E60";
    }
    if (!data.phoneNumber) {
      formIsValid = false;
      document.getElementById("phoneNumber").style.border = "2px solid #F64E60";
    }
    if (!data.email) {
      formIsValid = false;
      document.getElementById("email").style.border = "2px solid #F64E60";
    }
    if (!data.businessType) {
      formIsValid = false;
      document.getElementById("businessType").style.border = "2px solid #F64E60";
    }
    
    // if (!data.description) {
    //   console.log("a");
    //   formIsValid = false;
    //   document.getElementById("description").style.border = "2px solid #F64E60";
    //   errors["name"] = "Please Enter Name";
    // }
    // if (imgUrl == '') {
    //   formIsValid = false;
    //   document.getElementById("image").style.border = "2px solid #F64E60";
    //   errors["image"] = "Please Enter Name";

    // }

    setError(errors);
    return formIsValid;
  };
  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value.length > 0) {
    //   document.getElementById("validID").style.border = "2px solid #1BC5BD";
      // console.log("sssss");
    } else {
    //   document.getElementById("validID").style.border = "2px solid #F64E60";
      // console.log("rrr");
    }
    if (name == "drugLicence" || name == "panCard" || name == "gst") {
      let file = e.target.files[0];
        let fileURL = URL.createObjectURL(file);
        file.fileURL = fileURL;
        let formData = new FormData();
        formData.append("image", file);
        console.log("run")
        ApiUpload("upload/profile", formData)
        .then((res) =>{
  
          console.log("image", res);
        //   setImgUrl(res.data.data.image)
        
          setData((prevState) => ({
            ...prevState,
            [name]: res.data.data.image,
          }));
        })
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

 
  const handleSubmit = () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);
      try {
        const body = {
          data: [{
            name: data?.name,
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            shopName: data?.shopName,
            businessType: data?.businessType,
            dDrugLicence : data?.dDrugLicence,
            dGst : data?.dGst,
            dPanCard : data?.dPanCard,
            addName : data?.addName,
            addMobile : data?.addMobile,
            addStoreNumber  : data?.addStoreNumber,
            addressLine : data?.addressLine,
            gst: data?.gst,
            drugLicence: data?.drugLicence,
            panCard: data?.panCard
          }]
        };
        console.log(body);
        ApiPost("/retailers/bulk/add", body)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(res?.data?.message);
            fetchDatas(currentpage, pagesize, searching);
            disableLoading();
            setbutton(false);
            setOpen(!open);
          })
          .catch(async (err) => {
            if (err.status == 410) {
              let ext = await reftoken("ApiPost", "/banner", body);
              SuccessToast(ext.data.message);
            //   fetchDatas(currentpage, pagesize, state, searching);
              disableLoading();
              setOpen(!open);
              setbutton(false);
            } else {
              ErrorToast(err.message);
              disableLoading();
              setbutton(false);
            }
          });
      } catch (error) {}
    }
    // setValidated(true);
  };
  const onSubmit = async () => {
    // if (validateForm()) {
    //   } catch (err) {}
    // }
  };

  const clear = () => {
    setOpen(!open);
    // setRowID("");
  };
  return (
    <>
   
        <Modal
          show={open}
          centered
          size="lg"
          onHide={() => clear()}
          aria-labelledby="example-modal-sizes-title-lg"
          contentClassName="modaldailog"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Medicine Edit
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="overlay overlay-block cursor-default">
            {modalState == 1 && (
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
            {/* <div className="mb-7 text-center d-flex flex-column align-center align-items-center overflow-scroll"> */}
           
            
            
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Shop Name
              </label>
              <div className="col-lg-8">
                <input
                  name="shopName"
                  id="shopName"
                  className="form-control"
                  onChange={handleChange}
                  value={data.shopName}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Email
              </label>
              <div className="col-lg-8">
                <input
                  name="email"
                  id="email"
                  className="form-control"
                  onChange={handleChange}
                  value={data.email}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Phone Number
              </label>
              <div className="col-lg-8">
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  className="form-control"
                  onChange={handleChange}
                  value={data.phoneNumber}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Bussiness Type
              </label>
              <div className="col-lg-8">

              <Form.Group md="6">
                        
                      
                      <Form.Control
                        as="select"
                        placeholder="select category"
                            onChange={handleChange}
                            name="businessType"
                      >
                        <option selected>Select Status</option>
                         <option value="Chemist" >Chemist</option>
                         <option value="Clinic"  >Clinic</option>
                         <option value="Hospital"  >Hospital</option>
                         <option value="Other"  >Other</option>
                      </Form.Control>
                    </Form.Group>
                    </div>
            </div>
          </div>
            )}
            {modalState == 2 && (
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
            {/* <div className="mb-7 text-center d-flex flex-column align-center align-items-center overflow-scroll"> */}
           
            
            
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Drug Licence Number
              </label>
              <div className="col-lg-8">
                <input
                  name="dDrugLicence"
                  id="dDrugLicence"
                  className="form-control"
                  onChange={handleChange}
                  value={data.dDrugLicence}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Pan Card Number
              </label>
              <div className="col-lg-8">
                <input
                  name="dPanCard"
                  id="dPanCard"
                  className="form-control"
                  onChange={handleChange}
                  value={data.dPanCard}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Gst Number
              </label>
              <div className="col-lg-8">
                <input
                  name="dGst"
                  id="dGst"
                  className="form-control"
                  onChange={handleChange}
                  value={data.dGst}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
          </div>
            )}
            {modalState == 3 && (
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
            {/* <div className="mb-7 text-center d-flex flex-column align-center align-items-center overflow-scroll"> */}
           
            
            
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Address Name
              </label>
              <div className="col-lg-8">
                <input
                  name="addName"
                  id="addName"
                  className="form-control"
                  onChange={handleChange}
                  value={data.addName}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Address Mobile Number
              </label>
              <div className="col-lg-8">
                <input
                  name="addMobile"
                  id="addMobile"
                  className="form-control"
                  onChange={handleChange}
                  value={data.addMobile}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Shop Number
              </label>
              <div className="col-lg-8">
                <input
                  name="addStoreNumber"
                  id="addStoreNumber"
                  className="form-control"
                  onChange={handleChange}
                  value={data.addStoreNumber}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Address
              </label>
              <div className="col-lg-8">
                <input
                  name="addressLine"
                  id="addressLine"
                  className="form-control"
                  onChange={handleChange}
                  value={data.addressLine}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
          </div>
            )}
            {modalState == 4 && (
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
            {/* <div className="mb-7 text-center d-flex flex-column align-center align-items-center overflow-scroll"> */}
           
            <div className="mb-7 text-center d-flex flex-row align-center align-items-center overflow-scroll">
            {data?.drugLicence ? <div
                              style={{
                                marginRight: "auto",
                                marginLeft: "auto",
                                width: "135px",
                                height: "135px",
                                borderRadius: "12%",
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                          
                              <iframe
                                src={data?.drugLicence}
                                alt="imgUrl"
                                className="editImg"
                                width={"130px"}
                                height={"130px"}
                                style={{ borderRadius: "12%" }}
                              />
                              <div>
                                <div
                                  className="cursor-pointer"
                                  style={{color:'#3699FF'}}
                                  onClick={()=>{}}
                                >
                                  <label htmlFor="drugLicence" role="button">
                                    <FiEdit2
                                      style={{
                                        position: "absolute",
                                        left: "-25px",
                                        top: 0,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </div>
                                <div
                                  className="cursor-pointer"
                                  style={{ color: "#3699FF" }}
                                  onClick={() => {}}
                                >
                                  <AiTwotoneDelete
                                    style={{
                                      position: "absolute",
                                      top: "30px",
                                      left: "-25px",
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      padding: "6px",
                                      background: "transparent",
                                    }}
                                  ></AiTwotoneDelete>
                                </div>
                              </div>
                            </div> : (

            <><label htmlFor="drugLicence"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "130px",
                            height: "130px",
                            borderRadius: "12%",
                            background: "#f3f3f3",
                            position: "relative",
                          }}
                        > select DrugLicence</label>
                       <input
                    type="file"
                    name="drugLicence"
                    id="drugLicence"
                    hidden
                    onChange={handleChange}
                  />     
                        </>
            )}
            {data?.panCard ? <div
                              style={{
                                marginRight: "auto",
                                marginLeft: "auto",
                                width: "135px",
                                height: "135px",
                                borderRadius: "12%",
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                          
                              <iframe
                                src={data?.panCard}
                                alt="imgUrl"
                                className="editImg"
                                width={"130px"}
                                height={"130px"}
                                style={{ borderRadius: "12%" }}
                              />
                              <div>
                                <div
                                  className="cursor-pointer"
                                  style={{color:'#3699FF'}}
                                  onClick={()=>{}}
                                >
                                  <label htmlFor="panCard" role="button">
                                    <FiEdit2
                                      style={{
                                        position: "absolute",
                                        left: "-25px",
                                        top: 0,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </div>
                                <div
                                  className="cursor-pointer"
                                  style={{ color: "#3699FF" }}
                                  onClick={() => {}}
                                >
                                  <AiTwotoneDelete
                                    style={{
                                      position: "absolute",
                                      top: "30px",
                                      left: "-25px",
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      padding: "6px",
                                      background: "transparent",
                                    }}
                                  ></AiTwotoneDelete>
                                </div>
                              </div>
                            </div> : (

           <> <label htmlFor="panCard"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "130px",
                            height: "130px",
                            borderRadius: "12%",
                            background: "#f3f3f3",
                            position: "relative",
                          }}
                        > select Pancard</label>
                        <input
                    type="file"
                    name="panCard"
                    id="panCard"
                    hidden
                    onChange={handleChange}
                  />
                        </>
                        
            )}
            {data?.gst ? <div
                              style={{
                                marginRight: "auto",
                                marginLeft: "auto",
                                width: "135px",
                                height: "135px",
                                borderRadius: "12%",
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                          
                              <iframe
                                src={data?.gst}
                                alt="imgUrl"
                                className="editImg"
                                width={"130px"}
                                height={"130px"}
                                style={{ borderRadius: "12%" }}
                              />
                              <div>
                                <div
                                  className="cursor-pointer"
                                  style={{color:'#3699FF'}}
                                  onClick={()=>{}}
                                >
                                  <label htmlFor="gst" role="button">
                                    <FiEdit2
                                      style={{
                                        position: "absolute",
                                        left: "-25px",
                                        top: 0,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </div>
                                <div
                                  className="cursor-pointer"
                                  style={{ color: "#3699FF" }}
                                  onClick={() => {}}
                                >
                                  <AiTwotoneDelete
                                    style={{
                                      position: "absolute",
                                      top: "30px",
                                      left: "-25px",
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      padding: "6px",
                                      background: "transparent",
                                    }}
                                  ></AiTwotoneDelete>
                                </div>
                              </div>
                            </div> : (

            <label htmlFor="gst"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "130px",
                            height: "130px",
                            borderRadius: "12%",
                            background: "#f3f3f3",
                            position: "relative",
                          }}
                        > select gstNumber</label>
            )}
                        <input
                    type="file"
                    name="gst"
                    id="gst"
                    hidden
                    onChange={handleChange}
                  />
            </div>
          </div>
            )}
          
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100 ">
              <button
                onClick={() => {
                  setModalState(modalState - 1);
                  // console.log(addData);
                }}
                // disabled={button}
                className={`btn btn-primary btn-elevate ${
                  modalState == 1 ? "invisible" : "visible"
                }`}
              >
                PREV
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => clear()}
                  className="btn btn-light btn-elevate mr-2"
                >
                  Cancel
                </button>

                {modalState != 4 ? (
                  <button
                    type="submit"
                    onClick={() => {
                      setModalState(modalState + 1);
                      // console.log(addData);
                    }}
                    className="btn btn-primary btn-elevate"
                    // disabled={button}
                  >
                    NEXT
                  </button>
                ) : (
                  <button
                    type="submit"
                      onClick={handleSubmit}
                    // disabled={button}
                    className="btn btn-primary btn-elevate"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </Modal.Footer>
        </Modal>
     
    </>
  );
};
export default Retailer_Edit;
