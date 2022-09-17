import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiPostNoAuth,
} from "../../../../helpers/API/ApiData";
import { toastr } from "react-redux-toastr";
// import {  ToastContainer } from "react-toastify";
import * as userUtil from "../../../../utils/user.util";
import * as authUtil from "../../../../utils/auth.util";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: "",
};

function Login(props) {
  const { intl } = props;
  const History = useHistory();
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState(false);
  const LoginSchema = Yup.object().shape({
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
  });

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
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setbutton(true);
      setTimeout(() => {
        // console.log(data)
        var accountData1 = {
          email: values.email,
          password: values.password,
          // userRole: "Manager"
        };
        ApiPostNoAuth("admin/login", accountData1)
          .then((res) => {
            console.log("res", res);
            if (res?.data?.status === 200) {
              SuccessToast(res && res.data && res.data.message);
              // toast.success(res && res.data && res.data.message);
              // console.log(res.data.data._id);
              let rok = res?.data?.data?.role;
              userUtil.setUserInfo(res?.data?.data);
              authUtil.setToken(res?.data?.data?.token);
              // authUtil.setRToken(res.data.data.refresh_token);
              console.log(res?.data?.data?.token);
              disableLoading();
              props.login({
                token: res?.data?.data?.token,
                user: accountData1,
              });
              History.push("/dashboard");
              // console.log("kkkkkkkkjk");
              // onSubmit2(res.data.data._id);
            } else if (res?.data?.status === 401) {
              console.log(res);
              ErrorToast(res?.data?.message);
              // toast.error(res.data.message);
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
            ErrorToast(err?.message);
            // toast.error(err.message);
            setbutton(false);
            disableLoading();
          });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your email and password
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : null}

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
        <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            {/* <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" /> */}
          </Link>
          <div style={{ display: "grid" }}>
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={button}
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
            >
              <span>Login</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
            {/* <button

              type="submit"

              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
              onClick={() => History.push("/auth/registration")}
            >
              <span>Sign Up</span>

            </button> */}
          </div>
          &nbsp; &nbsp;&nbsp;
          {/* <div >
              <span className="font-weight-bold text-dark-50">
                Don't have an account yet?
              </span>
              <Link
                to="/auth/registration"
                className="font-weight-bold ml-2"
                id="kt_login_signup"
              >
                Sign Up!
              </Link>
          </div> */}
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
