import axios from "axios";

export const LOGIN_URL = "http://urgent-cart.herokuapp.com/v1/login";
export const REGISTER_URL = "http://urgent-cart.herokuapp.com/v1/register";

export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(
  email,
  f_name,
  l_name,
  userType,
  password,
  phoneNumber,
  phoneCode,
  loginType
) {
  return axios.post(REGISTER_URL, {
    email,
    f_name,
    l_name,
    userType,
    phoneNumber,
    password,
    phoneCode,
    loginType
  });
}


export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return true; //axios.get(ME_URL);
}
