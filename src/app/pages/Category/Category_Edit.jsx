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
const Category_Edit = ({
  rowID,
  setRowID,
  open,
  setOpen,
  fetchDatas,
  currentpage,
  pagesize,
  state,
  searching,
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
    if (!data.name) {
      console.log("a");
      formIsValid = false;
      document.getElementById("name").style.border = "2px solid #F64E60";
      errors["name"] = "Please Enter Name";
    }
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
    if (name == "image") {
      let file = e.target.files[0];
      let fileURL = URL.createObjectURL(file);
      file.fileURL = fileURL;
      let formData = new FormData();
      formData.append("image", file);
      console.log("run")
      ApiUpload("upload/profile", formData)
      .then((res) =>{

        console.log("image", res);
        setImgUrl(res.data.data.image)
      }
        // setImage((data) => {
        //   console.log(data);

        //   return [...data, res?.data?.data?.image]; 
        // })
      )
      .catch((err) => console.log("res_blob", err));
      setImage([file]);
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const fetchData = (v) => {
    ApiGet("/category/" + v)
      .then((res) => {
        console.log("category edit",res.data.data);
        setData(res.data.data);
        setImgUrl([res.data.data.image]);
      })
      .catch(async (err) => {
        if (err.status == 410) {
          let ext = await reftoken("ApiGet", "/category/" + v);
          console.log(ext);
         
          setData(ext.data.data);
          setImgUrl([ext.data.data.image]);
          //   ErrorToast(err.message);
        } else {
          ErrorToast(err.message);
        }
      });
  };
  const onUpdate = async () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);
      try {
        const body = {
          id:rowID ,
          name: data.name,
          description: data.description,
          image: String(imgUrl),
          tags: data.tags,
        };
        console.log(body);
        ApiPut("/category/update", body)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(res?.data?.message);
            fetchDatas();
            disableLoading();
            setOpen(!open);
            setbutton(false);
          })
          .catch(async (err) => {
            console.log(err);
            if (err.status == 410) {
              let ext = await reftoken("ApiPut", "/category", body);
              SuccessToast(ext.data.message);
              fetchDatas(currentpage, pagesize, state, searching);
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
  };
  const handleSubmit = () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);
      try {
        const body = {
          name: data.name,
          description: data.description,
          image: imgUrl,
          tags: [data.tags],
        };
        console.log(body);
        ApiPost("/category/add", body)
          .then((res) => {
            console.log("ressssssssssss", res);
            SuccessToast(res?.data?.message);
            fetchDatas();
            disableLoading();
            setbutton(false);
            setOpen(!open);
          })
          .catch(async (err) => {
            if (err.status == 410) {
              let ext = await reftoken("ApiPost", "/category", body);
              SuccessToast(ext.data.message);
              fetchDatas(currentpage, pagesize, state, searching);
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
  useEffect(() => {
    if (rowID) {
      fetchData(rowID);
      getUpdate(false);
    }
  }, []);
  const clear = () => {
    setOpen(!open);
    setRowID("");
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
            {update === true ? "Add" : "Edit"} Category{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overlay overlay-block cursor-default">
          <div class="card-body pt-9 pb-0 mx-0 px-0 ">
            <div className="mb-7 text-center d-flex flex-column align-center align-items-center overflow-scroll">
            {imgUrl ? <div
                              style={{
                                marginRight: "30px",
                                width: "135px",
                                height: "135px",
                                borderRadius: "12%",
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                          {console.log('sashgv', imgUrl)}
                              <img
                                src={imgUrl}
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
                                  <label htmlFor="inFile" role="button">
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

            <label htmlFor="inFile"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "130px",
                            height: "130px",
                            borderRadius: "12%",
                            background: "#f3f3f3",
                            position: "relative",
                          }}
                        > select images</label>
            )}
                        <input
                    type="file"
                    name="image"
                    id="inFile"
                    hidden
                    onChange={handleChange}
                  />
            </div>
            
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">Category Name</label>
              <div class="col-lg-8">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  onChange={handleChange}
                  value={data.name}
                />
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">Category Tags</label>
              <div class="col-lg-8">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="form-control"
                  onChange={handleChange}
                  value={data.tags}
                />
              </div>
            </div>
            <div class="row mb-7">
              <label class="col-lg-4 fw-bold text-muted">
                Category description
              </label>
              <div className="col-lg-8">
                <textarea
                  name="description"
                  id="description"
                  className="form-control"
                  onChange={handleChange}
                  value={data.description}
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
          {update === true ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-elevate"
              disabled={button}
            >
              Submit
            </button>
          ) : (
            <button
              type="submit"
              onClick={onUpdate}
              disabled={button}
              className="btn btn-primary btn-elevate"
            >
              Update
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Category_Edit;
