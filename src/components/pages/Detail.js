import React, { useState, useEffect } from 'react'
import { getProductById, getUserConfig } from '../../actions/product'
import { useDispatch, useSelector } from 'react-redux'
import Shimmer from '../widgets/shimmerEffect'
import { ReactComponent as FacebookIcon } from '../../static/image/facebook.svg'
import { ReactComponent as TwitterIcon } from '../../static/image/twitter.svg'
import { ReactComponent as PinterestIcon } from '../../static/image/pinterest.svg'

const Detail = (props) => {

    const dispatch = useDispatch()
    const [productId] = useState(props.match.params.productId);
    const [userName] = useState(props.match.params.userName);
    const product_detail_loading = useSelector((state) => state.product.product_detail_loading)
    const productDetail = useSelector((state) => state.product.productDetail)
console.log("productDetail",productDetail)
    useEffect(() => {
      dispatch(getUserConfig(userName))
      dispatch(getProductById(productId))
    }, [dispatch, productId, userName])
    

    return(

      productDetail ? 
      <div className="detail-main">
        <div className="avatar">
          <img src={productDetail.imgUrl} alt="" />
        </div>
    
        <div className="detail">
          <p className="title">{productDetail.productName && productDetail.productName}</p>
          <p className="price">${productDetail.price}</p>
          <p className="author">{productDetail.brandName && productDetail.brandName}</p>
          <p className="author">{productDetail.promoCode && productDetail.promoCode}</p>
          <div className="buy_now">
            <a href={productDetail.url}><button>Buy Now</button></a>
          </div>
          {productDetail.productDescription && <div dangerouslySetInnerHTML={{ __html: productDetail.productDescription ? productDetail.productDescription.replaceAll('&lt;' , '<') : 'product description' }} className="description">
          </div>}
          <div className="share">
            <span>Share</span>
            <ul>
              <li><FacebookIcon /></li>
              <li><TwitterIcon/></li>
              <li><PinterestIcon/></li>
            </ul>
          </div>
        </div>
      </div>
      : <div></div>
    )
}

export default Detail
