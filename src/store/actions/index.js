import history from "../../history";
import api from "../api";
// export const Sign_Up = (recData) => async (dispatch) => {
//   try {
//     dispatch({ type: "DATA_FETCHING" });
//     await api.post("/api/user/create", recData);
//     dispatch({ type: "SIGN_UP", payload: {} });
//     dispatch({ type: "SUCCESS", payload: 200 });
//   } catch (err) {
//     dispatch({
//       type: "IS_ERROR",
//       payload: err.response.data.message,
//       pay: 500,
//     });
//   }
// };

export const Sign_In = (recData) => async (dispatch) => {
  try {
    dispatch({ type: "DATA_FETCHING" });
    const { data } = await api.post("/login", recData);
    dispatch({ type: "SIGN_IN", payload: data });
    dispatch({ type: "SUCCESS" });
    localStorage.setItem("user", JSON.stringify(data));
    history.push("/");
  } catch (err) {
    dispatch({ type: "IS_ERROR", payload: err.response.data.message });
  }
};

export const Google_Sign_In = (recData) => async (dispatch) => {
  try {
    const { data } = await api.post("/google", recData);
    dispatch({ type: "SIGN_IN", payload: data });

    localStorage.setItem("user", JSON.stringify(data));
    history.push("/");
  } catch (err) {
    dispatch({ type: "IS_ERROR", payload: err.response.data.message });
  }
};

export const Log_Out = () => {
  localStorage.removeItem("user");
  history.push("/login");
  return {
    type: "LOG_OUT",
  };
};

export const Error_Clear = () => {
  return {
    type: "ERROR_LOG",
  };
};
