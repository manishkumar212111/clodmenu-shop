
const initialState = {
    language : "en"
  };
  
  export default function(state = initialState, action) {
    const { type , data } = action;
    switch ( type ) {
        case "SET_LANGUAGE":
            localStorage.setItem("language", data);
            console.log("in set language")
            return {...state, language :  data};
        default: return state;
    }
  }
  