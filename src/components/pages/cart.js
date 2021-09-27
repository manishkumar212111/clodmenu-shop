import React, { useEffect, useState } from "react";
import { create } from "../../actions/order";
import { connect } from "react-redux";

const Cart = (props) => {
  const [cart, setCart] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [orderObj, setOrderObj] = useState({
    orderType: "dinein",
    tableNo: localStorage.getItem("tableNo"),
    orderNote: "",
  });
  const [paymentObj, setPaymentObj] = useState({
    type: "cash",
    cardDetails: {},
  });

  useEffect(() => {
    localStorage.getItem("cart") &&
      typeof JSON.parse(localStorage.getItem("cart")) == "object" &&
      setCart(JSON.parse(localStorage.getItem("cart")));
  }, [localStorage.getItem("cart")]);

  useEffect(() => {
    if (props?.orderDetail?.id) {
      setCart({});
      localStorage.removeItem("cart");
    }
  }, [props?.orderDetail?.id]);

  useEffect(() => {
    setOrderObj((ord) => ({
      ...ord,
      cart: { product: cart, price: getPriceCountInCart() },
    }));
  }, [cart]);

  const deleteProductFromCart = (cartKey, mainKartKey) => {
    let newCartObj = cart;
    delete newCartObj[mainKartKey][cartKey];
    localStorage.setItem(
      "cart",
      JSON.stringify(updateStateAndLocalStorage(newCartObj))
    );
    setCart((crt) => ({ ...newCartObj }));

    // let newCartObj = cart;
    // let obj = newCartObj[mainKartKey][cartKey]
    // if(obj.qty == 1){
    //   delete newCartObj[mainKartKey][cartKey]
    //   localStorage.setItem("cart", JSON.stringify(updateStateAndLocalStorage(newCartObj)));
    //   setCart( crt => ({...updateStateAndLocalStorage(newCartObj)}));
    // } else{
    //   newCartObj[mainKartKey][cartKey].qty = obj.qty - 1;
    //   localStorage.setItem("cart", JSON.stringify(updateStateAndLocalStorage(newCartObj)));
    //   setCart( crt => ({...updateStateAndLocalStorage(newCartObj)}));

    // }
  };

  const updateStateAndLocalStorage = (obj) => {
    console.log(obj);
    let returnObj = {};
    Object.keys(obj).map((itm) => {
      if (Object.keys(obj[itm]).length > 0) {
        returnObj[itm] = obj[itm];
      }
    });
    console.log(returnObj);
    return returnObj;
  };
  const getProductCountInCart = (id) => {
    let cartObj = cart[id];
    if (!cartObj) {
      return "";
    } else {
      let temp = 0;
      Object.keys(cartObj).map((itm) => {
        temp += cartObj[itm].qty;
      });
      return temp;
    }
  };
  const getTotalProductCount = () => {
    let count = 0;
    Object.keys(cart).map((itm) => {
      count += getProductCountInCart(itm);
    });
    return count;
  };

  const getSingleProductCount = (finalProduct) => {
    console.log(finalProduct);
    let obj = {
      count: 0,
      price: 0,
    };
    obj.price = parseInt(finalProduct.price);
    finalProduct &&
      finalProduct.modifiers &&
      Object.keys(finalProduct.modifiers).map((itm) =>
        finalProduct.modifiers[itm].map((item) => {
          obj.price += parseInt(item.price);
        })
      );
    obj.price = obj.price * finalProduct.qty;
    return obj;
  };

  const getPriceCountInCart = () => {
    if (!cart) {
      return 0;
    } else {
      let temp = 0;
      Object.keys(cart).map((itm) => {
        Object.keys(cart[itm]).map((item) => {
          temp += cart[itm][item].price * cart[itm][item].qty;
          if (cart[itm][item].modifiers) {
            Object.keys(cart[itm][item].modifiers).map((data) => {
              console.log(cart[itm][item].modifiers[data], data);
              cart[itm][item].modifiers[data].map((dta) => {
                temp += dta.price * cart[itm][item].qty;
              });
            });
          }
        });
      });
      return temp;
    }
  };
  console.log(props);
  const handleCreateOrder = () => {
    props.create({
      orderNote: orderObj.orderNote,
      orderType: orderObj.orderType,
      products: cart,
      tableNo:localStorage.getItem("tableNo"),
      restaurant: localStorage.getItem("restaurant")
        ? JSON.parse(localStorage.getItem("restaurant")).id
        : "",
      subTotalAmount: getPriceCountInCart(),
      tax: 0,
      totalAmount: getPriceCountInCart(),
      paymentType: paymentObj.type,
      paymentStatus:
        paymentObj.type == "cash" || paymentObj.type == "mada"
          ? "To pay"
          : "pending",
    });
  };
  if (props.order_detail_loading) {
    return (
      <section class="app-body">
        <header>
          <div class="container-fluid d-flex">
            <h4>Order</h4>
          </div>
        </header>

        <div class="browser-main">
          <div class="thank-img">
            <div class="container-fluid">
              {/* <img
                class="img-fluid"
                src={
                  "https://ik.imagekit.io/lcq5etn9k/restro/Group_g-O576nIx.png"
                }
                alt=""
              /> */}
              <p>Creating order, Please wait</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (props?.orderDetail?.id) {
    return (
      <section class="app-body" style={{backgroundColor: "white"}}>
        <header>
          <div class="container-fluid d-flex">
            <h4>Order on the way</h4>
          </div>
        </header>

        <div class="browser-main">
          <div class="thank-img">
            <div class="container-fluid">
              <img
                class="img-fluid mt-5"
                src={
                  "https://ik.imagekit.io/lcq5etn9k/restro/Group_g-O576nIx.png"
                }
                alt=""
              />
              <p className="mt-5">
                We have start preparing your order, it will be served you soon
              </p>
              <h3>Order Number - {props?.orderDetail?.orderNo}</h3>
            </div>
          </div>
        </div>

        <div class="order-btn">
          <div class="container-fluid">
            <h4>Missed Something ?</h4>
            <a onClick={() => window.history.go(-1)}>
              <h6>Order More</h6>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (!Object.keys(cart).length) {
    return (
      <section className="app-body">
        <header>
          <div className="container-fluid d-flex">
            <span onClick={() => window.history.go(-1)}>
              <i className="bx bx-chevron-left"></i>
            </span>
            <h4>Your Cart ({getTotalProductCount()})</h4>
          </div>
        </header>
        <div className="browser-main">
          <div className="cart-area">
            <div className="container-fluid">
              <p style={{ textAlign: "center" }}>Your cart is empty</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  
  if (showPayment) {
    return (
      <section className="app-body">
        <header>
          <div className="container-fluid d-flex">
            <span onClick={() => setShowPayment(false)}>
              <i className="bx bx-chevron-left"></i>
            </span>
            <h4>payments</h4>
          </div>
        </header>

        <div className="browser-main">
          <div className="payment-method">
            <div className="container-fluid">
              <div className="pay-method">
                <h4>Payment method</h4>
                <ul className="payment-option">
                  <li
                    onClick={() =>
                      setPaymentObj((pto) => ({ ...pto, type: "cash" }))
                    }
                  >
                    <a className={paymentObj.type == "cash" ? "active" : ""}>
                      <i className="bx bx-wallet"></i> Pay Cash
                    </a>
                  </li>
                  <li
                    onClick={() =>
                      setPaymentObj((pto) => ({ ...pto, type: "card" }))
                    }
                  >
                    <a className={paymentObj.type == "card" ? "active" : ""}>
                      <i className="bx bx-credit-card-alt"></i> Pay Via Card
                    </a>
                  </li>
                  <li
                    onClick={() =>
                      setPaymentObj((pto) => ({ ...pto, type: "mada" }))
                    }
                  >
                    <a className={paymentObj.type == "mada" ? "active" : ""}>
                      <i className="mada">
                        <img
                          src={
                            "https://ik.imagekit.io/lcq5etn9k/restro/mada_SFaA_bLT0-.png"
                          }
                          alt=""
                        />
                      </i>{" "}
                      MADA
                    </a>
                  </li>
                </ul>
              </div>

              {paymentObj.type == "card" && (
                <div className="card-fields">
                  <div className="row">
                    <div className="col-12 form-group">
                      <label for="">Name on card</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          setPaymentObj((pto) => ({
                            ...pto,
                            cardDetails: {
                              ...pto.cardDetails,
                              name: e.target.value,
                            },
                          }))
                        }
                      />
                      <img
                        src="assets/img/user.svg"
                        className="left-icon field-icon"
                        alt=""
                      />
                    </div>
                    <div className="col-12 form-group">
                      <label for="">Card number</label>
                      <input
                        id="cc"
                        type="text"
                        name="creditcard"
                        placeholder="0123 4567 8901 4321"
                        onChange={(e) =>
                          setPaymentObj((pto) => ({
                            ...pto,
                            cardDetails: {
                              ...pto.cardDetails,
                              cardNumber: e.target.value,
                            },
                          }))
                        }
                      />
                      <img
                        src={
                          "https://ik.imagekit.io/lcq5etn9k/restro/credit-card_E6bJFYg-CE.svg"
                        }
                        className="left-icon field-icon"
                        alt=""
                      />
                      {/* <img src={"https://ik.imagekit.io/lcq5etn9k/restro/mc-symbol_Yi6-dNRmE_J.svg"} className="right-icon field-icon" alt="" /> */}
                    </div>
                    <div className="col-6 form-group">
                      <label for="">Expiry Date</label>
                      <input
                        maxlength="5"
                        placeholder="MM/YY"
                        type="text"
                        onChange={(e) =>
                          setPaymentObj((pto) => ({
                            ...pto,
                            cardDetails: {
                              ...pto.cardDetails,
                              cardExpiry: e.target.value,
                            },
                          }))
                        }
                      />
                      <img
                        src={
                          "https://ik.imagekit.io/lcq5etn9k/restro/calendar_Gr23OBS-Q2.svg"
                        }
                        className="left-icon field-icon"
                        alt=""
                      />
                    </div>
                    <div className="col-6 form-group">
                      <label for="">CVV</label>
                      <input
                        maxlength="4"
                        type="password"
                        onChange={(e) =>
                          setPaymentObj((pto) => ({
                            ...pto,
                            cardDetails: {
                              ...pto.cardDetails,
                              cvv: e.target.value,
                            },
                          }))
                        }
                      />
                      <img
                        src={
                          "https://ik.imagekit.io/lcq5etn9k/restro/hint_nofsZ8__WxW.svg"
                        }
                        className="left-icon field-icon"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
              {paymentObj.type !== "card" && (
                <div class="cash-content">
                  <img
                    class="img-fluid"
                    src={
                      "https://ik.imagekit.io/lcq5etn9k/restro/wallet-big_TNI1TIi4FT.png"
                    }
                    alt=""
                  />
                  <p>Great we will accept your payment after serving you.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-btn">
          <div className="container-fluid">
            <a onClick={() => setShowPayment(false)}>
              <h6>{paymentObj.type == "card" ? "use this card" : "Select"}</h6>
            </a>
          </div>
        </div>
      </section>
    );
  }
  console.log(orderObj);
  return (
    <section className="app-body">
      <header>
        <div className="container-fluid d-flex">
          <span onClick={() => window.history.go(-1)}>
            <i className="bx bx-chevron-left"></i>
          </span>
          <h4>Your Cart ({getTotalProductCount()})</h4>
        </div>
      </header>
      <div className="browser-main">
        <div className="cart-area">
          <div className="container-fluid">
            <ul>
              {Object.keys(cart).map((itm) =>
                Object.keys(cart[itm]).map((item) => (
                  <li>
                    <div className="dish-quan-wrapper">
                      <div className="dis-quan">
                        <p>{cart[itm][item].qty}X</p>
                      </div>
                      <div className="dish-name">
                        <h5>{cart[itm][item].title}</h5>
                        <p>
                          {cart[itm][item].modifiers &&
                            Object.keys(cart[itm][item].modifiers)
                              .map((data) => {
                                let temp = [];
                                temp = cart[itm][item].modifiers[data]
                                  .map((dta) => dta.title)
                                  .join(",");
                                return temp;
                              })
                              .join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="dish-cost">
                      <h5>
                        ${getSingleProductCount(cart[itm][item]).price}
                        <a onClick={() => deleteProductFromCart(item, itm)}>
                          <i className="bx bx-trash-alt"></i>
                        </a>
                      </h5>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="select-payment">
          <div className="container-fluid">
            <a onClick={() => setShowPayment(true)}>
              <h6>Payment Option</h6>
              <p>
                {/* <img
                  src={
                    "https://ik.imagekit.io/lcq5etn9k/restro/visa_0t_PmIryq2.png"
                  }
                  alt=""
                /> */}
                {paymentObj.type == "card"
                  ? `Card ${
                      paymentObj?.cardDetails?.cardNumber
                        ? "(Ending with " +
                          paymentObj?.cardDetails?.cardNumber.slice(
                            paymentObj?.cardDetails?.cardNumber.length - 4,
                            paymentObj?.cardDetails?.cardNumber.length
                          ) +
                          ")"
                        : ""
                    }`
                  : paymentObj.type == "mada"
                  ? "Mada"
                  : "Cash"}{" "}
                <i className="bx bx-chevron-right"></i>
              </p>
            </a>
          </div>
        </div>

        <div className="order-instruction">
          <div className="container-fluid">
            <div className="instruction">
              <h5>Order Instructions</h5>
              <textarea
                name=""
                placeholder="Ex - Do not put bell pepper in pizza, serve beer chilled"
                id=""
                value={orderObj.orderNote}
                cols="30"
                onChange={(e) =>
                  setOrderObj((ord) => ({ ...ord, orderNote: e.target.value }))
                }
                rows="2"
              ></textarea>
            </div>
            <div className="order-deliver-option">
              <ul>
                <li>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="orderTyp"
                      checked={orderObj.orderType == "dinein"}
                      name="orderType"
                    />
                    <label
                      for="table-order"
                      onClick={(e) => {
                        setOrderObj((ord) => ({ ...ord, orderType: "dinein" }));
                      }}
                    >
                      <img
                        src="https://ik.imagekit.io/lcq5etn9k/restro/order-table_VebSza4hO.png"
                        alt=""
                      />{" "}
                      Order Serve At
                    </label>
                  </div>
                  {localStorage.getItem("tableNo") && (
                    <p>
                      Table{" "}
                      {localStorage.getItem("tableNo") !== "undefined"
                        ? localStorage.getItem("tableNo")
                        : ""}
                    </p>
                  )}
                </li>
                <li>
                  <div className="radio-item">
                    <input
                      type="radio"
                      onChange={(e) => {
                        setOrderObj((ord) => ({
                          ...ord,
                          orderType: "dineout",
                        }));
                      }}
                      id="orderType"
                      name="orderType"
                      checked={orderObj.orderType == "dineout"}
                    />
                    <label
                      for="takeaway-order"
                      onClick={(e) => {
                        setOrderObj((ord) => ({
                          ...ord,
                          orderType: "dineout",
                        }));
                      }}
                    >
                      <img
                        src="https://ik.imagekit.io/lcq5etn9k/restro/take-away_JcWi5wpzBM.png"
                        alt=""
                      />{" "}
                      Take Away
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="total-amount">
          <div className="container-fluid">
            <div className="total">
              <p>Item Total</p>
              <p className="price-total">${getPriceCountInCart()}</p>
            </div>
            <div className="total">
              <p>Sales Tax</p>
              <p className="price-total">$3.00</p>
            </div>
            <div className="total all-total">
              <p>Total</p>
              <p>${getPriceCountInCart()}</p>
            </div>
          </div>
        </div>
      </div>

      {!showPayment && (
        <div className="order-btn">
          <div className="container-fluid" onClick={handleCreateOrder}>
            <a>
              <p>
                Total <span>SR {getPriceCountInCart()}</span>
              </p>
              <h5>
                place order <i className="bx bx-chevron-right"></i>
              </h5>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

const mapStateToProps = (state) => ({
  orderDetail: state.order.orderDetail,
  order_detail_loading: state.order.order_detail_loading,
  orderError: state.order.orderError,
});

const mapDispatchToProps = {
  create,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
