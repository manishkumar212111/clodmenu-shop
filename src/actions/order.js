import { setAlert } from "./alert";
import API from "../API";
// import { clearOrderData } from '../utils/globals'

export const getOrders = ( page = 1) => ( dispatch ) =>{
  
    dispatch({
        type : "PAGE_LOADING",
        data : {}
    })
    API.get('Orders', {page : page} , "" , function(res){
    dispatch( 
      { type: "ORDER_LIST",
        data : res.data
      }
    );

    dispatch({
        type : "REMOVE_LOADING",
        data : {}
    })
  })
}


export const create = (data) => dispatch =>{
    try{
        dispatch({
            type : "ORDER_DETAIL_LOADING",
            data : true
        })
        if(!data.orderNote){
          delete data.orderNote;
        }
      API.post('Orders' , data ,'', function(res){
        console.log(res);
        if(res && res.data.id){
            dispatch( { type: "ORDER_DETAIL",
              data : res.data
            });
            // dispatch(setAlert("Orders Added successfully" , 'success'));    

          } else {
              dispatch({
                  type: "ORDER_ERROR",
                  data: res.data.message
              })    
          }
      
          dispatch({
            type : "ORDER_DETAIL_LOADING",
            data : false
           })
    })
      
    } catch (err) {
        console.log(err)
        dispatch({
            type : "ORDER_DETAIL_LOADING",
            data : false
        })
      console.log(err)
      console.log(err)
    }
  }
  
export const GetOrderById = (orderId) => dispatch =>{
  try{
        dispatch({
            type : "PAGE_LOADING",
            data : {}
        })
    API.get('Orders' , {}, orderId , function(res){
      
      if(res && res.data){
          dispatch( { type: "ORDER_DETAIL",
            data : res.data
          });
        } else {
            //console.log(res.data.message);
            res && res.data && dispatch(setAlert(res.data.message , 'danger'));    
        }

        dispatch({
            type : "REMOVE_LOADING",
            data : {}
        })
    })
    
  } catch (err) {

    dispatch({
        type : "REMOVE_LOADING",
        data : {}
    })
    console.log(err)
    console.log(err)
  }
}

export const UpdateOrderById = (orderId , data) => dispatch =>{
    try{
        dispatch({
            type : "PAGE_LOADING",
            data : {}
        })
      API.patch('Orders' , data , orderId , function(res){
        
        if(res && res.data.id) {
            dispatch( { type: "ORDER_DETAIL",
              data : res.data
            });
            dispatch(setAlert("Details updated successfully" , 'success'));    
          } else {
              //console.log(res.data.message);
              res && res.data && dispatch(setAlert(res.data.message , 'danger'));    
          }

            dispatch({
                type : "REMOVE_LOADING",
                data : {}
            })
      })
      
    } catch (err) {

        dispatch({
            type : "REMOVE_LOADING",
            data : {}
        })
      console.log(err)
      console.log(err)
    }
  }
  