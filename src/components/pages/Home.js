import React, { useEffect } from 'react'
import { getUserConfig, getProductByUserId } from '../../actions/product'
import { useDispatch, useSelector } from 'react-redux'
import Shimmer from '../widgets/shimmerEffect'
import { useHistory } from 'react-router-dom'
import TopImg from "../../scss/img/restaurant-interior.jpg";
import logo from "../../scss/img/rest-logo.png"
import orderTable from  "../../scss/img/order-table.png"
import foodImg from "../../scss/img/food-img-1.png"
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
        <section data-select-name className="restaurant-header">
    <div className="restaurant-image">
      <img src={TopImg} alt=""/>
      <div className="lang-select select_location">
        <select id="mounth">
          <option value="EN">EN</option>
          <option value="arabic/index.html">AR</option>
        </select>
      </div>
    </div>
    <div className="restaurant-details">
      <div className="container-fluid">
        <div className="restaurant-logo">
          <img className="img-fluid" src={logo} alt=""/>
        </div>
        <div className="rest-name">
          <h4>Abrito Restaurant and Bar</h4>
          <div className="rest-contact">
            <div className="contact-item">
              <p><img src={orderTable} alt=""/> Table 11</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="menu-wrapper">
    <div className="container-fluid">
      <h3>MENU</h3>
      <nav className="navigation" id="mainNav">
        <a className="navigation__link active" href="#chinese">Chinese</a>
        <a className="navigation__link" href="#italian">Italian</a>
        <a className="navigation__link" href="#indian">Indian</a>
        <a className="navigation__link" href="#indian">Mexican</a>
        <a className="navigation__link" href="#indian">Thai</a>
        <a className="navigation__link" href="#indian">Barbecue</a>
        <a className="navigation__link" href="#indian">Sea Food </a>
        <a className="navigation__link" href="#indian">Beverage</a>
        <a className="navigation__link" href="#indian">Deserts</a>
      </nav>
      <div className="menu-list">
        <ul className="page-section hero" id="chinese">
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)">ADD</a>
                <span>99</span>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
                <span>2</span>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
        </ul>
        <ul className="page-section" id="italian">
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
        </ul>
        <ul className="page-section" id="indian">
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
          <li>
            <div className="dish-name">
              <h4>Veg Salami Pizza</h4>
              <p className="more">Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with  </p>
              <h5>$7</h5>
            </div>
            <div className="dish-img">
              <img src={foodImg} alt=""/>
              <div className="add-dish">
                <a id="two" className="button" href="javascript:void(0)" href="#">ADD</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <div className="view-cart order-btn">
    <div className="container-fluid">
      <a href="cart.html">
        <p>5 items in cart <span>$36</span></p>
        <h5>view cart <i className='bx bx-chevron-right'></i></h5>
      </a>
    </div>
  </div>

  <div id="modal-container" tabindex="-1">
    <div className="modal-background">
      <div id="close">
        <i className='bx bx-x'></i>
      </div>
      <div className="modal">
        <div className="pop-up-body">
          <div className="popup-banner">
            <img src="assets/img/restaurant-2.jpg" alt=""/>
          </div>
          <div className="container-fluid">
            <div className="pop-dish-name">
              <h4>Veg Salami Pizza</h4>
              <h5>270 cal</h5>
            </div>
            <div className="dish-desc">
              <p>Spread the tomato sauce over the dough. Sprinkle with cheese, top with the vegetables, drizzle with olives.</p>
            </div>
            <div className="dis-topping">
              <h3>Size <span className="required">Required</span></h3>
              <ul>
                <li>
                  <p>Small</p>
                  <div className="radio-item">
                    <span for="table-order">$7</span>
                    <input type="radio" id="table-order" name="order" value="table" />
                    <label for="table-order"></label>
                  </div>
                </li>
                <li>
                  <p>Medium</p>
                  <div className="radio-item">
                    <span for="table-order">$9</span>
                    <input type="radio" id="table-order1" name="order" value="table" />
                    <label for="table-order1"></label>
                  </div>
                </li>
                <li>
                  <p>Large</p>
                  <div className="radio-item">
                    <span for="table-order">$11</span>
                    <input type="radio" id="table-order2" name="order" value="table"/>
                    <label for="table-order2"></label>
                  </div>
                </li>
              </ul>
              <h3>Crust <span className="optional">Optional</span></h3>
              <ul>
                <li>
                  <p>Hand Toasted</p>
                  <div className="radio-item">
                    <input type="radio" id="table-order3" name="order1" value="table" />
                    <label for="table-order3"></label>
                  </div>
                </li>
                <li>
                  <p>Cheese Burst</p>
                  <div className="radio-item">
                    <input type="radio" id="table-order4" name="order1" value="table" />
                    <label for="table-order4"></label>
                  </div>
                </li>
              </ul>
              <h3>Toppings <span className="optional">Optional</span></h3>
              <ul>
                <li>
                  <p>Mushroom</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox" checked="checked" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Olive</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Panner</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Baby Corn</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
              </ul>
              <h3>Cheese <span className="optional">Optional</span></h3>
              <ul>
                <li>
                  <p>Mozzarella</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox" checked="checked" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Peri peri Cheese</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Chipotle cheese</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
                <li>
                  <p>Tandori cheese</p>
                  <div className="checkbox-item">
                    <span>$2</span>
                    <label className="check-container">
                      <input type="checkbox"/> 
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="order-btn">
          <div className="container-fluid">
            <div className="quantity-wraper">
              <div className="value-button" id="decrease" onclick="decreaseValue1()" value="Decrease Value">-</div>
              <input type="number" id="number1" value="1" />
              <div className="value-button" id="increase" onclick="increaseValue1()" value="Increase Value">+</div>
            </div>
            <a className="add-item-close" href="javascript:void(0)">
              <h5>ADD ITEM</h5>
              <p>Total <span>$36</span></p>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
  
        </>
    )
}

export default Home; 
