import React, { useEffect, useState } from "react";
import {
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import { makeStyles } from "@material-ui/styles";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";

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
const Skill_edit = ({
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
      document.getElementById("validID").style.border = "2px solid #f64e60";
      errors["name"] = "Please Enter Name";
    }
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
    console.log(name, value);
    if (value.length > 0) {
      document.getElementById("validID").style.border = "2px solid #1BC5BD";
      // console.log("sssss");
    } else {
      document.getElementById("validID").style.border = "2px solid #f64e60";
      // console.log("rrr");
    }
    if (name == "image") {
      let file = e.target.files[0];
      let fileURL = URL.createObjectURL(file);
      file.fileURL = fileURL;
      setImage([file]);
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const fetchData = (v) => {
    console.log("edit id.....", v);
    // setOpen(!open);
    ApiGet("/skill/" + v)
      .then((res) => {
        console.log("edit data....", res.data.data.skill);

        setData({ name: res.data.data.skill });
        // setImage([res.data.data.image]);
      })
      .catch(async (err) => {
        if (err.status == 410) {
          let ext = await reftoken("ApiGet", "/category/" + v);
          console.log(ext);
          setData(ext.data.data);
          setImage([ext.data.data.image]);
          //   ErrorToast(err.message);
        } else {
          ErrorToast(err.message);
        }
      });
    getUpdate(false);
  };

  const onUpdate = async () => {
    if (validateForm()) {
      enableLoading();
      setbutton(true);

      try {
        const body = {
          id: rowID,
          skill: data?.name,
        };
        console.log(body);
        ApiPut("/skill/update", body)
          .then((res) => {
            console.log(
              "ressssssssssss-----------------------------------",
              res
            );
            SuccessToast(res?.data?.message);
            fetchDatas(currentpage, pagesize, searching);
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
              console.log("err...", err?.message);
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
          skill: data.name,
        };
        console.log(body);
        console.log(body);
        ApiPost("/skill/add", body)
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
              let ext = await reftoken("ApiPost", "/category", body);
              SuccessToast(ext.data.message);
              fetchDatas(currentpage, pagesize, state, searching);
              disableLoading();
              setOpen(!open);
              setbutton(false);
            } else {
              //   ErrorToast(err.message);
              //   disableLoading();
              //   setbutton(false);
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
    console.log(rowID);
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
            {update === true ? "Add" : "Edit"} Skill{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
          <div className="form-group row">
            <div className="col-lg-12">
              <Form.Group md="6">
                <Form.Label>Skill</Form.Label>
                <Form.Control
                  type="text"
                  id="validID"
                  // className={errors["name"] && "chipInputRed"}
                  placeholder="Category Name"
                  label="Category Name"
                  required
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                />
                <span className="errorInput">
                  {data.name?.length > 0 ? "" : errors["name"]}
                </span>
              </Form.Group>
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

export default Skill_edit;
