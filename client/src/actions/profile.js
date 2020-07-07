import axios from "axios";

import { setAlert } from "./alert";
import { GET_PROFILE, UPDATE_PROFILE, PROFILE_ERROR } from "./types";
import { PROFILE_API, EXPERIENCE_API, EDUCATION_API } from "../routes/backend";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get(PROFILE_API);
    dispatch({ type: GET_PROFILE, payload: res.data.profile });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.data.error,
        status: err.response.status,
      },
    });
  }
};

export const updateProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.post(PROFILE_API, formData, config);
    dispatch({ type: GET_PROFILE, payload: res.data.profile });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      error.forEach((e) => dispatch(setAlert(e.msg, "danger", 3000)));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.error, status: err.response.status },
    });
  }
};

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.put(EXPERIENCE_API, formData, config);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.profile });
    dispatch(setAlert("Experience Added", "success"));
    history.push("/dashboard");
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      error.forEach((e) => dispatch(setAlert(e.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.data.status },
    });
  }
};

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.put(EDUCATION_API, formData, config);
    dispatch({ type: UPDATE_PROFILE, payload: res.data.profile });
    dispatch(setAlert("Education Added", "success"));
    history.push("/dashboard");
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      error.forEach((e) => dispatch(setAlert(e.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.data.status },
    });
  }
};
