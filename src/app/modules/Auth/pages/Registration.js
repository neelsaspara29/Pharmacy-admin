import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
// import { toast } from "react-toastify";

import {
  Col,

  Row,

} from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
// import { register } from "../_redux/authCrud";
import { ApiPost } from "../../../../helpers/API/ApiData";
// import * as authUtil from "../../../../utils/auth.util";
// import * as userUtil from "../../../../utils/user.util";
const initialValues = {
  firstName: "",

  email: "",

  password: "",

  changepassword: "",
  loginType: "Manager",
  // acceptTerms: false,
};

function Registration(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [storeType, setStoreType] = useState([])
  const [marke, setMarket] = useState("Hackensack")
  const history = useHistory();
  const RegistrationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),

    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),


    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    changepassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password didn't match"
        ),
      }),
    // acceptTerms: Yup.bool().required(
    //   "You must accept the terms and conditions"
    // ),
  });
  const handleOnchange = (e) => {
    console.log(e.target)

    setMarket(e.target.value)

  }
  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({

    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      console.log("jjjjjjjj")
      setTimeout(() => {



        // console.log(data)
        var accountData1 = {

          name: values.firstName,
          market: marke,
          email: values.email,
          role: values.loginType,
          password: values.password

        }
        ApiPost("user/signup", accountData1)
          .then((res) => {
            console.log("res", res);
            if (res.data.status === 200) {
              alert(res && res.data && res.data.message)




              history.push("/auth/login");

              disableLoading();

            } else {
              console.log(res)
              alert(res.data.message)
              // history.push("/auth/registration");
              window.location.reload()
              disableLoading();
            }

          })




      }, 1000);
    },
  });
  useEffect(() => {
    ApiPost("get-all-store-type")
      .then((res) => {
        console.log("res--->>>>>>", res);
        setStoreType(res.data.data);
      })
      .catch((err) => {
        console.log("Error");
      });
  }, []);
  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <ToastContainer />
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your details to create your account
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Fullname */}

        <Row>
          <Col md={12}>
            <div className="form-group fv-plugins-icon-container">
              <input
                placeholder="First name"
                type="text"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "firstName"
                )}`}
                name="firstName"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.firstName}</div>
                </div>
              ) : null}
            </div>
          </Col>
          <Col md={12}>
            <div className="form-group fv-plugins-icon-container">
              <select
                placeholder="Market"
                type="select"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "Market"
                )}`}
                name="Market"
                {...formik.getFieldProps("Market")}
                value={marke}
                onChange={(e) => handleOnchange(e)}
              >

                <option value="Hackensack">Hackensack</option>
                <option value="New York">New York</option>
              </select>
              {formik.touched.Market && formik.errors.Market ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.Market}</div>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>


        {/* <div className="form-group fv-plugins-icon-container">
         
        </div> */}
        {/* end: Fullname */}

        {/* begin: Email */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        {/* end: Email */}

        {/* begin: userType */}
        <div className="form-group fv-plugins-icon-container">
          <Row>

            <Col md={12}>
              <input
                disabled
                placeholder="Type"
                type="text"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "loginType"
                )}`}
                name="loginType"
                {...formik.getFieldProps("loginType")}
              />
              {formik.touched.loginType && formik.errors.loginType ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.loginType}</div>
                </div>
              ) : null}
            </Col>
          </Row>

        </div>

        {/* end: userType */}

        {/* begin: Password */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        {/* end: Password */}

        {/* begin: Confirm Password */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Confirm Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "changepassword"
            )}`}
            name="changepassword"
            {...formik.getFieldProps("changepassword")}
          />
          {formik.touched.changepassword && formik.errors.changepassword ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.changepassword}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Confirm Password */}
        <div className="form-group d-flex flex-wrap flex-center">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>

          <Link to="/auth/login">
            <button
              type="button"
              className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
            >
              Cancel
            </button>
          </Link>
        </div>
        {/* begin: Terms and Conditions */}
        {/* <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              className="m-1"
              {...formik.getFieldProps("acceptTerms")}
            />
            <Link
              to="/terms"
              target="_blank"
              className="mr-1"
              rel="noopener noreferrer"
            >
              I agree the Terms & Conditions
            </Link>
            <span />
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          ) : null}
        </div> */}
        {/* end: Terms and Conditions */}
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));
