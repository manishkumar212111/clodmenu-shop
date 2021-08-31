// import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (
  msg,
  alertType,
  err_key = "",
  timeout = 5000
) => dispatch => {
  const id = Math.random(100);
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, err_key, id }
  });

  // setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  // setTimeout(() => dispatch({ type: REMOVE_ALERT }), timeout);
};

export const removeAlert = () => dispatch => {
  dispatch({ type: REMOVE_ALERT });
};
