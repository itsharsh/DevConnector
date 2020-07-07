import axios from "axios";

import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { CHECKTOKEN_API, REGISTER_API, LOGIN_API } from "../routes/backend";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(CHECKTOKEN_API);
    dispatch({ type: USER_LOADED, payload: res.data.user });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post(REGISTER_API, body, config);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      error.forEach((e) => dispatch(setAlert(e.msg, "danger")));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(LOGIN_API, body, config);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      error.forEach((e) => dispatch(setAlert(e.msg, "danger")));
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
