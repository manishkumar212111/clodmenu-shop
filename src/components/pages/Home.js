import React, { useEffect } from 'react'
import { getUserConfig, getProductByUserId } from '../../actions/product'
import { useDispatch, useSelector } from 'react-redux'
import Shimmer from '../widgets/shimmerEffect'
import { useHistory } from 'react-router-dom'

const Home = (props) => {

    const dispatch = useDispatch()
    const history = useHistory()
    console.log("dddddddddddd", props.match.params.userName)
    const userName = props.match.params.userName
    const product_detail_loading = useSelector((state) => state.product.product_detail_loading)
    const productList = useSelector((state) => state.product.productList)
    const bannerUrl = useSelector((state) => state.product.bannerUrl)

    useEffect(() => {
        dispatch(getUserConfig(userName))
        dispatch(getProductByUserId(userName))
    }, [dispatch, userName]);

    const goToDetailPage = (url) => {
        history.push(url);
    }
    return(
        <>
        <div>Home page</div>
        </>
    )
}

export default Home; 
