import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "./authCrud";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
};

const initialAuthState = {
  user: undefined,
  token: undefined,
  id: undefined
};

export const reducer = persistReducer(
  { storage, key: "v706-demo1-auth", whitelist: ["user", "token"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { token, user } = action.payload;
        console.log("user ", token);
        return { token: token.token, user: token.user };
      }

      case actionTypes.Register: {
        const { token } = action.payload;

        return { token, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        console.log("userloaded ac ", user);
        return { ...state };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (token) => ({ type: actionTypes.Login, payload: { token } }),
  register: (token) => ({
    type: actionTypes.Register,
    payload: { token },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user },
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken();

    yield put(actions.fulfillUser(user));
  });
}
