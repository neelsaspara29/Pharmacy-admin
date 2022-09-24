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

    if(name !='image') {

      if (value.length > 0) {
        document.getElementById(`${name}`).style.border = "2px solid #1BC5BD";
        // console.log("sssss");
      } else {
        document.getElementById(`${name}`).style.border = "2px solid #F64E60";
        // console.log("rrr");
      }
    }
   
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    
  };

 
  const handleSubmit = () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);
      try {
        const body = {
          data: [{
            shopName: data.shopName,
            email: data.email,
            businessType: data.businessType,
            phoneNumber: data.phoneNumber
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
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {update === true ? "Add" : "Edit"} Retailer{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overlay overlay-block cursor-default">
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
                <input
                  name="businessType"
                  id="businessType"
                  className="form-control"
                  onChange={handleChange}
                  value={data.businessType}
                />
                {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={clear}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-elevate"
              disabled={button}
            >
              Submit
            </button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Retailer_Edit;