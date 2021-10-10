import { setAlert } from "./alert";
import API from "../API";
// import { clearPlanData } from '../utils/globals'

export const createPayment = ( data, cb ) => ( dispatch ) =>{
    try{
      API.post('CreatePayment' , data ,'', function(res){
        if(res && res.data){
            cb(res.data);
            // dispatch(setAlert("Orders Added successfully" , 'success'));    

          } else {
              cb({error: true, message: "fdvdlkfn"})    
          }
    })
      
    } catch (err) {
        cb({error: true, message: "fdvdlkfn"})    
        
      console.log(err)
      console.log(err)
    }
}
