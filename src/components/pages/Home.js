import React, { useCallback, useEffect, useState } from "react";
import { getProductByUserId, getRestaurantById } from "../../actions/product";
import { useDispatch } from "react-redux";
import Shimmer from "../widgets/shimmerEffect";
import { useHistory } from "react-router-dom";
import TopImg from "../../scss/img/restaurant-interior.jpg";
import logo from "../../scss/img/rest-logo.png";
import orderTable from "../../scss/img/order-table.png";
import foodImg from "../../scss/img/food-img-1.png";
import { setLanguage } from "../../actions/language";

import { connect } from "react-redux";
import { BASE_URL } from "../../API/config";
import Modifier from "./modifier";

var delayTimer;
const Home = (props) => {
  const [restaurant, setRestaurant] = useState({});
  const [products, setProducts] = useState({});
  const [tableNo, setTableNo] = useState(props.match.params.tableNo);
  const [active, setActive] = useState(0);
  const [cart, setCart] = useState({});
  const [modifier, setModifiers] = useState(false);
  const [activeProduct, setActiveProduct] = useState(false);
  const [language, setLanguage] = useState("en");
  const [langSelect, setLangSelect] = useState(false);
  useEffect(() => {
    props.getRestaurantById(props.match.params.restaurantId);
  }, [props.getRestaurantById]);

  useEffect(() => {

    if(props?.match?.params?.clientId && (props?.match?.params?.clientId != localStorage.getItem("clientId"))){
      localStorage.setItem("clientId" , props?.match?.params?.clientId);
      localStorage.setItem("cart", JSON.stringify({}));
    }
  }, [props?.match?.params?.clientId])
  useEffect(() => {
    setRestaurant(props.restaurant);
    if(props.restaurant && props.restaurant.menu){
      props.getProductByUserId({
        menu: props.restaurant.menu.id,
        restaurant: props.match.params.restaurantId,
        limit: 5000,
      });
      localStorage.setItem("language", props.restaurant?.menu?.settings?.language);
    }
    localStorage.setItem("tableNo" , props.match.params.tableNo);

  }, [props.restaurant]);

  useEffect(() => {
      setLanguage(localStorage.getItem("language") | 'en')  
  }, [props.language]);

  useEffect(() => {
    if (props.productList && props.productList.length) {
      setProducts(groupBy(props.productList));
      setActive(Object.keys(groupBy(props.productList))[0]);
      setCart(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {})
    }
  }, [props.productList]);

  const handleScroll = (e) => {
    document.querySelectorAll("#menu-list ul").forEach(function (itm) {
      if (isScrolledIntoView(itm)) {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(() => {
          setActive(itm.id.replace("_", " "));
        }, 50);
      }
    });
  };

  const handleCartAdd = (itm) => {
      setModifiers(itm.modifierGroup);
      if(itm.modifierGroup.length){
        
        setModifiers(itm.modifierGroup.map((itm) => ({
          id: itm?.id?.id,
          isRequired: itm?.id?.isRequired,
          max: itm?.id.max,
          min: itm?.id.min,
          modifiers: itm.modifiers,
          name: itm?.id.name,
          nameAr: itm?.id.nameAr,
          restaurant: itm?.id.restaurant,
          status: itm?.id.status          
        })))
      } else{
        setModifiers([])

      }
      setActiveProduct(itm);

      document.body.style.overflow = "hidden"


    // let field = cart[itm.id] || {};
    // if (!field.qty) {
    //   field = {
    //     categroyName: itm.category.name,
    //     productTitle: itm.title,
    //   };
    // }

    // field.qty = (field.qty || 0) + 1;
    // field.price = itm.sellingPrice;

    // setCart((crt) => ({ ...crt, [itm.id]: field }));
  };

  const handleCartAddCb = (product, id) => {

      console.log(product)
      setCart((crt) => ({ ...crt, [id] :product }));
      setActiveProduct(false);
      setModifiers([]);
      document.body.style.overflow = ""
      
      setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify({ ...cart, [id] :product }));
      },100)

  };

  const handleCartRemove = (itm) => {
    let field = cart[itm.id] || {};
    field.qty = (field.qty || 0) - 1;
    if (field.qty == 0) {
      field[itm.id] = null;
    }
    setCart((crt) => ({ ...crt, [itm.id]: field }));
  };
  const isScrolledIntoView = (ele) => {
    const { top, bottom } = ele.getBoundingClientRect();
    const vHeight = window.innerHeight || document.documentElement.clientHeight;

    return (top > 0 || bottom > 0) && top < vHeight;
  };

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x.category?.name] = rv[x.category?.name] || []).push(x);
      return rv;
    }, {});
  };

  const handleCategoryClick = (id) => {
    let doc = document.getElementById(id.replace(" ", "_"));
    if (id) {
      doc.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    setActive(id);
  };
  if (props.product_detail_loading || props.product_list_loading) {
    return <Shimmer />;
  }

  const renderCartPopup = () => {
    let price = getPriceCountInCart();
    // let itemCount = 0;
    // Object.keys(cart).map((itm) => {
    //   if (cart[itm] && cart[itm].qty) {
    //     itemCount += cart[itm].qty;
    //     price += cart[itm].qty * parseInt(cart[itm].price);
    //   }
    // });
    return price > 0 ? (
      <div className="view-cart order-btn">
        <div className="container-fluid">
          <a href="/cart">
            <p>
              {getTotalProductCount()} items in cart <span><span className="arabicRs">S<span className="arabicSmallRs">R</span></span> {price}</span>
            </p>
            <h5>
              view cart <i className="bx bx-chevron-right"></i>
            </h5>
          </a>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const getProductCountInCart = (id) => {
    let cartObj = cart[id];
    if(!cartObj){
      return "";
    } else{
      let temp = 0;
      Object.keys(cartObj).map(itm => {
        temp += cartObj[itm].qty;
      })
      return temp;
    }
  }

  const getTotalProductCount = () => {
    let count = 0;
    Object.keys(cart).map(itm => {
      count += getProductCountInCart(itm)
    })
    return count;
  }

  const getPriceCountInCart = () => {
    if(!cart){
      return 0;
    } else{
      let temp = 0;
      Object.keys(cart).map(itm => {
        Object.keys(cart[itm]).map(item => {
          temp += cart[itm][item].price * cart[itm][item].qty;
          if(cart[itm][item].modifiers){
            Object.keys(cart[itm][item].modifiers).map(data => {
              cart[itm][item].modifiers[data].map(dta => {
                temp += dta.price * cart[itm][item].qty
              }) 
            })
          }
        })
      })
      return temp;
    }
  }

  return (
    <>
      <section data-select-name className="restaurant-header">
        <div className="restaurant-image">
          <img height="160" src={BASE_URL + restaurant.banner_url} alt="" />
          <div className="lang-select select_location">
          <div class="lang-select select_location">
            <div class="select">
              <select id="mounth" class="select-hidden">
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            <div class={`select-styled ${langSelect?  "active" : ""}`} onClick={() => setLangSelect(!langSelect)}>{localStorage.getItem("language") == "en" ? "EN" : "AR"}</div>
            <ul class="select-options" style={{display: langSelect ? "" : "none"}}>
              <li onClick={(e) =>{props.setLanguage("en"); setLangSelect(false)}}>EN</li>
              <li onClick={(e) =>{props.setLanguage("ar"); setLangSelect(false)}}>AR</li></ul></div>
          </div>
            {/* <select id="mounth" value={localStorage.getItem("language") || "en"}  onChange={(e) => props.setLanguage(e.target.value)}>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select> */}
          </div>
        </div>
        <div className="restaurant-details">
          <div className="container-fluid">
            <div className="restaurant-logo">
              <img
                className="img-fluid"
                width="75"
                height="75"
                src={
                  BASE_URL + (restaurant.logo_url)
                }
                alt=""
              />
            </div>
            <div className="rest-name">
              <h4>{restaurant?.name}</h4>
              <div className="rest-contact">
                <div className="contact-item">
                  <p>
                    <img src={orderTable} alt="" /> Table{" "}
                    {tableNo ? tableNo : ""}
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
            {Object.keys(products).map((itm, index) => (
              <span
                onClick={() => handleCategoryClick(itm)}
                className={`navigation__link ${itm === active ? "active" : ""}`}
              >
                {itm}
              </span>
            ))}
          </nav>
          <div className="menu-list" id="menu-list">
            {Object.keys(products).map((item, index) => (
              <ul className="page-section hero" id={item.replace(" ", "_")}>
                {products[item] &&
                  products[item].map((itm, index) => (
                    <li>
                      <div className="dish-name">
                        <h4>{itm.title}</h4>
                        <p className="more">{itm.description}</p>
                        <h5><span className="arabicRs">S<span className="arabicSmallRs">R</span></span> {itm.sellingPrice}</h5>
                      </div>
                      <div className="dish-img">
                        {itm.imageUrl && <img
                          width="35"
                          height="40"
                          src={BASE_URL + itm.imageUrl}
                          alt=""
                        />}
                        <div className="add-dish">
                          <div
                            id="two"
                            className="button"
                            onClick={() => handleCartAdd(itm)}
                          >
                            ADD
                          </div>
                            <>
                              {getProductCountInCart(itm.id) ? <span>{getProductCountInCart(itm.id)}</span> : ""}
                              {/* <div
                                id="two"
                                className="button"
                                onClick={() => handleCartRemove(itm)}
                              >
                                Remove
                              </div> */}
                            </>
                          
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {cart && renderCartPopup()}
      <Modifier 
        modifier={modifier}
        activeProduct={activeProduct}
        handleClose={() => {
         setActiveProduct("");
         setModifiers("")
         document.body.style.overflow = ""
        }
        
        }
        handleCartAdd={handleCartAddCb}
        alreadyInCart = { cart[activeProduct.id] ? cart[activeProduct.id] : {}}
      />                      
    </>
  );
};
const mapStateToProps = (state) => ({
  productList: state.product.productList,
  product_detail_loading: state.product.product_detail_loading,
  product_list_loading: state.product.product_list_loading,
  restaurant: state.product.restaurant,
  language: state.language.language,
});

const mapDispatchToProps = {
  getProductByUserId,
  getRestaurantById,
  setLanguage

};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
