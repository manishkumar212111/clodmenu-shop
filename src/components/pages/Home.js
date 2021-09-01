import React, { useEffect, useState } from "react";
import { getProductByUserId, getRestaurantById } from "../../actions/product";
import { useDispatch } from "react-redux";
import Shimmer from "../widgets/shimmerEffect";
import { useHistory } from "react-router-dom";
import TopImg from "../../scss/img/restaurant-interior.jpg";
import logo from "../../scss/img/rest-logo.png";
import orderTable from "../../scss/img/order-table.png";
import foodImg from "../../scss/img/food-img-1.png";

import { connect } from "react-redux";
import { BASE_URL } from "../../API/config";

const Home = (props) => {
  const [restaurant , setRestaurant] = useState({}); 
  const [products , setProducts] = useState({}); 
  const [tableNo , setTableNo] = useState(props.match.params.tableNo);
  const [active, setActive] = useState(0);
  useEffect(() => {
    props.getRestaurantById(props.match.params.restaurantId);
    props.getProductByUserId( { restaurant : props.match.params.restaurantId, limit : 5000})
  }, [props.getRestaurantById, props.getProductByUserId]);

  useEffect(() => {
    setRestaurant(props.restaurant)
  }, [props.restaurant]);


  useEffect(() => {
    setProducts(groupBy(props.productList));
    setActive(Object.keys(groupBy(props.productList))[0]);
  }, [props.productList]);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x.category?.name] = rv[x.category?.name] || []).push(x);
      return rv;
    }, {});
  };
  console.log(props, active, products[active]);
  if(props.product_detail_loading || props.product_list_loading){
    return <Shimmer />
  }
  return (
    <>
      <section data-select-name className="restaurant-header">
        <div className="restaurant-image">
          <img height="160" src={BASE_URL + restaurant.coverImage} alt="" />
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
              <img className="img-fluid" width="75" height="75" src={BASE_URL + restaurant.coverImage} alt="" />
            </div>
            <div className="rest-name">
              <h4>{restaurant?.name}</h4>
              <div className="rest-contact">
                <div className="contact-item">
                  <p>
                    <img src={orderTable} alt="" /> Table {tableNo? tableNo: ""}
                  </p>
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
            {Object.keys(products).map((itm , index) => (
              <span onClick={() => setActive(itm)} className={`navigation__link ${itm === active ? "active" : ""}`}>
                {itm}
              </span>
            ))}
          </nav>
          <div className="menu-list">
            <ul className="page-section hero" id="chinese">
              {
                products[active] && products[active].map((itm) => (
                  <li>
                  <div className="dish-name">
                    <h4>{itm.title}</h4>
                    <p className="more">
                      {itm.description}
                    </p>
                    <h5>$ {itm.sellingPrice}</h5>
                  </div>
                  <div className="dish-img">
                    <img width="35" height="40" src={BASE_URL+itm.imageUrl} alt="" />
                    <div className="add-dish">
                      <a id="two" className="button" href="javascript:void(0)">
                        ADD
                      </a>
                      {/* <span>99</span> */}
                    </div>
                  </div>
                </li>
             
                ))
              }
            </ul>
          </div>
        </div>
      </section>

      {/* <div className="view-cart order-btn">
        <div className="container-fluid">
          <a href="cart.html">
            <p>
              5 items in cart <span>$36</span>
            </p>
            <h5>
              view cart <i className="bx bx-chevron-right"></i>
            </h5>
          </a>
        </div>
      </div> */}

      <div id="modal-container" tabindex="-1">
        <div className="modal-background">
          <div id="close">
            <i className="bx bx-x"></i>
          </div>
          <div className="modal">
            <div className="pop-up-body">
              <div className="popup-banner">
                <img src="assets/img/restaurant-2.jpg" alt="" />
              </div>
              <div className="container-fluid">
                <div className="pop-dish-name">
                  <h4>Veg Salami Pizza</h4>
                  <h5>270 cal</h5>
                </div>
                <div className="dish-desc">
                  <p>
                    Spread the tomato sauce over the dough. Sprinkle with
                    cheese, top with the vegetables, drizzle with olives.
                  </p>
                </div>
                <div className="dis-topping">
                  <h3>
                    Size <span className="required">Required</span>
                  </h3>
                  <ul>
                    <li>
                      <p>Small</p>
                      <div className="radio-item">
                        <span for="table-order">$7</span>
                        <input
                          type="radio"
                          id="table-order"
                          name="order"
                          value="table"
                        />
                        <label for="table-order"></label>
                      </div>
                    </li>
                    <li>
                      <p>Medium</p>
                      <div className="radio-item">
                        <span for="table-order">$9</span>
                        <input
                          type="radio"
                          id="table-order1"
                          name="order"
                          value="table"
                        />
                        <label for="table-order1"></label>
                      </div>
                    </li>
                    <li>
                      <p>Large</p>
                      <div className="radio-item">
                        <span for="table-order">$11</span>
                        <input
                          type="radio"
                          id="table-order2"
                          name="order"
                          value="table"
                        />
                        <label for="table-order2"></label>
                      </div>
                    </li>
                  </ul>
                  <h3>
                    Crust <span className="optional">Optional</span>
                  </h3>
                  <ul>
                    <li>
                      <p>Hand Toasted</p>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="table-order3"
                          name="order1"
                          value="table"
                        />
                        <label for="table-order3"></label>
                      </div>
                    </li>
                    <li>
                      <p>Cheese Burst</p>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="table-order4"
                          name="order1"
                          value="table"
                        />
                        <label for="table-order4"></label>
                      </div>
                    </li>
                  </ul>
                  <h3>
                    Toppings <span className="optional">Optional</span>
                  </h3>
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
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <p>Panner</p>
                      <div className="checkbox-item">
                        <span>$2</span>
                        <label className="check-container">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <p>Baby Corn</p>
                      <div className="checkbox-item">
                        <span>$2</span>
                        <label className="check-container">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                  </ul>
                  <h3>
                    Cheese <span className="optional">Optional</span>
                  </h3>
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
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <p>Chipotle cheese</p>
                      <div className="checkbox-item">
                        <span>$2</span>
                        <label className="check-container">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <p>Tandori cheese</p>
                      <div className="checkbox-item">
                        <span>$2</span>
                        <label className="check-container">
                          <input type="checkbox" />
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
                  <div
                    className="value-button"
                    id="decrease"
                    onclick="decreaseValue1()"
                    value="Decrease Value"
                  >
                    -
                  </div>
                  <input type="number" id="number1" value="1" />
                  <div
                    className="value-button"
                    id="increase"
                    onclick="increaseValue1()"
                    value="Increase Value"
                  >
                    +
                  </div>
                </div>
                <a className="add-item-close" href="javascript:void(0)">
                  <h5>ADD ITEM</h5>
                  <p>
                    Total <span>$36</span>
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = ( state ) => ( {
  productList: state.product.productList,
  product_detail_loading : state.product.product_detail_loading,
  product_list_loading : state.product.product_list_loading,
  restaurant : state.product.restaurant,
} );

const mapDispatchToProps = {
  getProductByUserId,
  getRestaurantById
};

export default connect( mapStateToProps, mapDispatchToProps )( Home );
