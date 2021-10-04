import { setAlert } from "./alert";
import API from "../API";
// import { clearPlanData } from '../utils/globals'

export const setLanguage = ( language ) => ( dispatch ) =>{
  dispatch({
      type: "SET_LANGUAGE",
      data: language
  })
}
