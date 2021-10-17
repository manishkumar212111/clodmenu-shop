import React, { useEffect, useState } from "react";
import { create } from "../../actions/order";
import { connect } from "react-redux";
import {t } from "../language";
import { createPayment } from "../../actions/payment";
import $ from 'jquery';
import querystring from 'querystring';
import Loader from "react-loader-spinner";
import { BASE_URL } from "../../API/config";

const Cart = (props) => {
  console.log(props)
  const [cart, setCart] = useState({});
  const [checkoutDetail , setCheckoutDetail] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryObj , setQueryObj] = useState({});
  const [restaurant, setRestaurant] = useState(
    JSON.parse(localStorage.getItem("restaurant"))
  );
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
    let search = props.location.search;
    search = (querystring.parse(search));
    console.log(search)
    if(search && search["?type"]){
      setQueryObj(search);
      if(search["?type"] == "success"){
        setCart({});
        localStorage.setItem("cart", JSON.stringify({}));
      } else if(search["?type"] == "failed"){
        setShowPayment(true);
      }
    } 
  },[props.location]);

  useEffect(() => {
    localStorage.getItem("cart") &&
      typeof JSON.parse(localStorage.getItem("cart")) == "object" &&
      setCart(JSON.parse(localStorage.getItem("cart")));

      setRestaurant(JSON.parse(localStorage.getItem("restaurant")))
  }, [localStorage.getItem("cart")]);

  useEffect(() => {
    if (props?.orderDetail?.id) {
      setCart({});
      localStorage.setItem("cart", JSON.stringify({}));
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
  const handleBackClick = () => {
    window.location.href = localStorage.getItem("baseUrl")
  }
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

  const calculateTax = () => {
    let price = getPriceCountInCart();
    if(restaurant.taxStatus){
      return ((parseFloat(restaurant.taxRate || 15) / 100) * price).toFixed(2)
    }
    return 0;
  }
  console.log(props);


  const handleCreateOrder = () => {
    
    
    if(!(paymentObj && paymentObj.type)){
      
      return;
    }

    props.create({
      orderNote: orderObj.orderNote,
      orderType: orderObj.orderType,
      products: cart,
      tableNo:localStorage.getItem("tableNo"),
      restaurant: localStorage.getItem("restaurant")
        ? JSON.parse(localStorage.getItem("restaurant")).id
        : "",
      subTotalAmount: getPriceCountInCart(),
      tax: calculateTax(),
      totalAmount: parseFloat(getPriceCountInCart()) + parseFloat(calculateTax()),
      paymentType: paymentObj.type,
      paymentStatus:
        paymentObj.type == "cash" || paymentObj.type == "mada"
          ? "To pay"
          : "pending",
    });
  };

  const handleCashClick = () => {
      // var unloadWidget = function() {
      //     if (window.wpwl !== undefined && window.wpwl.unload !== undefined) {
      //         window.wpwl.unload();
      //     }
      // };
    // unloadWidget()
    $("#payCash").show();
    $(".tempC a").removeClass("active");

    setTimeout(() => {
      setPaymentObj((pto) => ({ ...pto, type: "cash" }))
    }, 500)

  }

  useEffect(() => {
    console.log(paymentObj)
      if(!queryObj?.orderId && showPayment){
        setLoading(true);
        props.createPayment({
            orderNote: orderObj.orderNote,
            orderType: orderObj.orderType,
            products: cart,
            tableNo:localStorage.getItem("tableNo"),
            restaurant: localStorage.getItem("restaurant")
              ? JSON.parse(localStorage.getItem("restaurant")).id
              : "",
            subTotalAmount: getPriceCountInCart(),
            tax: calculateTax(),
            totalAmount: parseFloat(getPriceCountInCart()) + parseFloat(calculateTax()).toFixed(2),
            paymentType: paymentObj.type,
        } , (res) => {
          setCheckoutDetail(res);
          console.log(res);
          var tag = document.createElement('script');
          tag.async = true;
          tag.id="test-payment"
          tag.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${res.id}`;
          var body = document.getElementsByTagName('body')[0];
          body.appendChild(tag);

          tag.onload = () => {
            console.log("On load is running")
            function wrapElement(element) {
              var id = $(element).attr("id");
              var wrapId = "wrap_" + id;
              $(element).wrap('<div id="' +wrapId+'"></div>"'); 
              return $('#'+wrapId);
            }
    
            var methodMapping = {
              "card": "Pay With Card",
              "mada": "Pay With Mada",
              "directDebit": " Click to pay with direct debit",
              "prepayment-BOLETO": " Click to pay with Boleto",
              "prepayment-BARPAY": " Click to pay with Barpay",
              // "onlineTransfer-IDEAL": " Click to pay with iDeal",
              "onlineTransfer-GIROPAY": " Click to pay with GiroPay",
              "invoice-INVOICE": " Click to pay with Invoice",
              "onlineTransfer-SOFORTUEBERWEISUNG": " Click to pay with SOFORT Uberweisung",
              "virtualAccount-PASTEANDPAY_V": " Click to pay with PASTEandPAY",
              "virtualAccount-VSTATION_V": " Click to pay with voucherstation",
              // "virtualAccount-PAYPAL": " Click to pay with PayPal",
              "virtualAccount-APPLEPAY": "Pay With APPLEPAY",
              "virtualAccount-UKASH": " Click to pay with Ukash",
              "virtualAccount-QOOQO": " Click to pay with QOOQO",
              "virtualAccount-KLARNA_INVOICE": " Click to pay with Klarna Invoice",
              "virtualAccount-KLARNA_INSTALLMENTS": " Click to pay with Klarna Installments",
              "cashOnDelivery": " Click to pay cash on delivery"
            }
            window.wpwlOptions = {
                brandDetection: true,
                locale: localStorage.getItem("language") == "en" ? "en" : "ar",
                style: "plain",
                maskCvv: true,
              onReady: function() {
                // <ul class="payment-option"><li><a class=""><i class="bx bx-wallet"></i> Pay Cash</a></li></ul></div>
                $('.wpwl-container').each(function() {
                  var id = $(this).attr("id");
                  console.log(id, "Id")
                  wrapElement(this).hide().before("<div  id='" + (id.indexOf("card")> -1 ? "card" : id.indexOf("APPLEPAY") > -1 ? "applepay" : "") + "' class='pay-method tempC' style='margin-top : 5px;'><ul class='payment-option'><li><a> <i class='bx bx-credit-card-alt'></i> " + methodMapping[id.substring(0, id.lastIndexOf("_"))] + "</a></li></ul></div>");
                });
                $(".tempC").click(function() {
                  console.log(this.id)
                  setPaymentObj((pto) => ({ ...pto, type: this.id}));
                  $(".tempC a").removeClass("active");

                  $("#"+this.id+" a").addClass("active");
                  $("#payCash").hide();
                  $(this).next().slideToggle();
                });
                setLoading(false)

              }
            }
          }
        
        })
        
      }
  }, [showPayment]);


  if (props.order_detail_loading) {
    return (
      <section class="app-body">
        <header>
          <div class="container-fluid d-flex">
            <h4>{t("Order")}</h4>
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
              <p>{t("Creating order, Please wait")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (props?.orderDetail?.id || (queryObj["?type"] && queryObj?.orderId)) {
    return (
      <section class="app-body">
        <header>
          <div class="container-fluid d-flex">
            <h4>{t("Order on the way")}</h4>
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
                {t("We have start preparing your order, it will be served you soon")}
              </p>
              <h3>{t("Order Number")} - {queryObj?.orderId || props?.orderDetail?.orderNo}</h3>
            </div>
          </div>
        </div>

        <div class="order-btn">
          <div class="container-fluid">
            <h4>{t("Missed Something ?")}</h4>
            <a onClick={() => handleBackClick()}>
              <h6>{t("Order More")}</h6>
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
            <span onClick={() => handleBackClick()}>
              <i className="bx bx-chevron-left"></i>
            </span>
            <h4>{t("Your Cart")} ({getTotalProductCount()})</h4>
          </div>
        </header>
        <div className="browser-main">
          <div className="cart-area">
            <div className="container-fluid">
              <p style={{ textAlign: "center" }}>{t("Your cart is empty")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
console.log(`${restaurant?.menu?.settings?.payment?.applePay ? "APPLEPAY " : ""} ${restaurant?.menu?.settings?.payment?.creditCard ? "VISA MASTER AMEX " : ""} ${restaurant?.menu?.settings?.payment?.mada ? "MADA" : ""}`)
  let paymentTypeList = " ";
  if(restaurant?.menu?.settings?.payment.creditCard){
    paymentTypeList += "VISA MASTER AMEX "
  }
  if(restaurant?.menu?.settings?.payment.mada){
    paymentTypeList += "MADA "
  }
  if(restaurant?.menu?.settings?.payment.applePay){
    paymentTypeList += "APPLEPAY "
  }
  if (showPayment) {
    return (
      <section className="app-body paymentPage">
        <header>
          <div className="container-fluid d-flex">
            <span onClick={() => setShowPayment(false)}>
              <i className="bx bx-chevron-left"></i>
            </span>
            <h4>{t("payments")}</h4>
          </div>
        </header>

        <div className="browser-main">
          <div className="payment-method">
            <div className="container-fluid">
              {queryObj && queryObj.message && <div ><p style={{color: "red"}}>{queryObj.message}</p></div>}
              <h4>{t("Payment method")}</h4>
              {loading && <div style={{ marginTop: "20%", marginLeft: "auto", marginRight: "auto", width:100}}>
                <Loader />
              </div>}
              <div className="pay-method" style={{marginBottom: -5 , display: loading ? "none": ""}}>
                <ul className="payment-option">
                  {restaurant?.menu?.settings?.payment.cash && <li
                    onClick={() =>
                      handleCashClick()
                    }
                  >
                    <a className={paymentObj.type == "cash" ? "active" : ""}>
                      <i className="bx bx-wallet"></i> {("Pay Cash")}
                    </a>
                  </li>}
                </ul>
              </div>
               <div style={{ marginTop: 10}}>
                  <form 
                    id="my-payment-form"
                    action={`${BASE_URL}api/payment/capture-payment`}
                    class="paymentWidgets"
                    data-brands={paymentTypeList}
                  >
                    <input type="hidden" value="Manish" name="teest" />

                  </form>
                </div>
              {(paymentObj.type === "cash" && !loading)  && (
                <div class="cash-content">
                  <img
                    class="img-fluid"
                    src={
                      "https://ik.imagekit.io/lcq5etn9k/restro/wallet-big_TNI1TIi4FT.png"
                    }
                    alt=""
                  />
                  <p>{("Great we will accept your payment after serving you.")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {paymentObj.type == "cash" && <div id="payCash" className="order-btn">
          <div className="container-fluid">
            <a onClick={() => handleCreateOrder()}>
              <h6>{paymentObj.type == "card" ? t("use this card") : t("Pay Cash")}</h6>
            </a>
          </div>
        </div>}
      </section>
    );
  }

  const totalAmount = parseFloat(getPriceCountInCart()) + parseFloat(calculateTax());
  console.log(orderObj);
  return (
    <section className="app-body">
      <header>
        <div className="container-fluid d-flex">
          <span onClick={() => handleBackClick()}>
            <i className="bx bx-chevron-left"></i>
          </span>
          <h4>{t("Your Cart")} ({getTotalProductCount()})</h4>
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
                        <h5>{localStorage.getItem("language") =="en" ?  cart[itm][item].title : cart[itm][item].titleAr}</h5>
                        <p>
                          {cart[itm][item].modifiers &&
                            Object.keys(cart[itm][item].modifiers)
                              .map((data) => {
                                let temp = [];
                                temp = cart[itm][item].modifiers[data]
                                  .map((dta) => localStorage.getItem("language") =="en" ? dta.title : dta.titleAr)
                                  .join(",");
                                return temp;
                              })
                              .join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="dish-cost">
                      <h5>
                      <span style={{marginRight : 2}} className="arabicRs">S<span className="arabicSmallRs">R </span></span>  {getSingleProductCount(cart[itm][item]).price}
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


        <div className="order-instruction">
          <div className="container-fluid">
            <div className="instruction">
              <h5>{t("Order Instructions")}</h5>
              <textarea
                name=""
                placeholder={t("Ex - Do not put bell pepper in pizza, serve beer chilled")}
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
                      {t("Order Serve At")}
                    </label>
                  </div>
                  {localStorage.getItem("tableNo") && (
                    <p>
                      {t("Table")}{" "}
                      {localStorage.getItem("tableNo") !== "undefined"
                        ? localStorage.getItem("tableNo")
                        : ""}
                    </p>
                  )}
                </li>
                {restaurant?.menu?.settings?.takeAwayOrder && <li>
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
                      {t("Take Away")}
                    </label>
                  </div>
                </li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="total-amount">
          <div className="container-fluid">
            <div className="total">
              <p>{t("Item Total")}</p>
              <p className="price-total"><span style={{marginRight : 0}} className="arabicRs">S<span className="arabicSmallRs">R</span></span> {getPriceCountInCart()}</p>
            </div>
            <div className="total">
              <p>{t("Sales Tax")}</p>
              <p className="price-total">SR {calculateTax()}</p>
            </div>
            <div className="total all-total">
              <p>{t("Total")}</p>
              <p><span style={{marginRight : 0}} className="arabicRs">S<span className="arabicSmallRs">R</span></span> {totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {!showPayment && (
        <div className="order-btn">
          <div className="container-fluid" onClick={() => setShowPayment(true)}>
            <a>
              <p>
                {t("Total")} <span>SR {totalAmount}</span>
              </p>
              <h5>
                {t("Place Order")} <i className="bx bx-chevron-right"></i>
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
  createPayment
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);


{/* <div className="pay-method" style={{marginBottom: -5}}>
                <ul className="payment-option">
                  {restaurant?.menu?.settings?.payment.cash && <li
                    onClick={() =>
                      handleCashClick()
                    }
                  >
                    <a>
                      <i className="bx bx-wallet"></i> {("Pay Cash")}
                    </a>
                  </li>}
                  {/* {restaurant?.menu?.settings?.payment.creditCard && <li
                    onClick={() =>
                      setPaymentObj((pto) => ({ ...pto, type: "card" }))
                    }
                  >
                    <a className={paymentObj.type == "card" ? "active" : ""}>
                      <i className="bx bx-credit-card-alt"></i> {("Pay Via Card")}
                    </a>
                  </li>} */}
                  {/* {restaurant?.menu?.settings?.payment.mada && <li
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
                      {t("MADA")}
                    </a>
                  </li>} 
                </ul>
              </div>
               <div style={{ marginTop: 10}}>
                  <form 
                    id="my-payment-form"
                    action="http://localhost:5000/api/payment/capture-payment"
                    class="paymentWidgets"
                    data-brands={`VISA MASTER AMEX MADA APPLEPAY`}
                  >
                    <input type="hidden" value="Manish" name="teest" />

                  </form>
                </div>
              {paymentObj.type == "card" && (
                <form 
                  // style={{display: "none"}}
                  // id="my-payment-form"
                  // action="https://wordpresshyperpay.docs.oppwa.com/tutorials/integration-guide"
                  // class="paymentWidgets"
                  // data-brands={`VISA MASTER AMEX ${restaurant?.menu?.settings?.payment?.applePay ? "APPLEPAY " : ""} ${restaurant?.menu?.settings?.payment?.mada ? "MADA" : ""}`}
                ></form>
                // <div className="card-fields">
                //   <div className="row">
                //     <div className="col-12 form-group">
                //       <label for="">Name on card</label>
                //       <input
                //         type="text"
                //         onChange={(e) =>
                //           setPaymentObj((pto) => ({
                //             ...pto,
                //             cardDetails: {
                //               ...pto.cardDetails,
                //               name: e.target.value,
                //             },
                //           }))
                //         }
                //       />
                //       <img
                //         src="assets/img/user.svg"
                //         className="left-icon field-icon"
                //         alt=""
                //       />
                //     </div>
                //     <div className="col-12 form-group">
                //       <label for="">Card number</label>
                //       <input
                //         id="cc"
                //         type="text"
                //         name="creditcard"
                //         placeholder="0123 4567 8901 4321"
                //         onChange={(e) =>
                //           setPaymentObj((pto) => ({
                //             ...pto,
                //             cardDetails: {
                //               ...pto.cardDetails,
                //               cardNumber: e.target.value,
                //             },
                //           }))
                //         }
                //       />
                //       <img
                //         src={
                //           "https://ik.imagekit.io/lcq5etn9k/restro/credit-card_E6bJFYg-CE.svg"
                //         }
                //         className="left-icon field-icon"
                //         alt=""
                //       />
                //       {/* <img src={"https://ik.imagekit.io/lcq5etn9k/restro/mc-symbol_Yi6-dNRmE_J.svg"} className="right-icon field-icon" alt="" /> */}
                //     </div>
                //     <div className="col-6 form-group">
                //       <label for="">Expiry Date</label>
                //       <input
                //         maxlength="5"
                //         placeholder="MM/YY"
                //         type="text"
                //         onChange={(e) =>
                //           setPaymentObj((pto) => ({
                //             ...pto,
                //             cardDetails: {
                //               ...pto.cardDetails,
                //               cardExpiry: e.target.value,
                //             },
                //           }))
                //         }
                //       />
                //       <img
                //         src={
                //           "https://ik.imagekit.io/lcq5etn9k/restro/calendar_Gr23OBS-Q2.svg"
                //         }
                //         className="left-icon field-icon"
                //         alt=""
                //       />
                //     </div>
                //     <div className="col-6 form-group">
                //       <label for="">CVV</label>
                //       <input
                //         maxlength="4"
                //         type="password"
                //         onChange={(e) =>
                //           setPaymentObj((pto) => ({
                //             ...pto,
                //             cardDetails: {
                //               ...pto.cardDetails,
                //               cvv: e.target.value,
                //             },
                //           }))
                //         }
                //       />
                //       <img
                //         src={
                //           "https://ik.imagekit.io/lcq5etn9k/restro/hint_nofsZ8__WxW.svg"
                //         }
                //         className="left-icon field-icon"
                //         alt=""
                //       />
                //     </div>
                //   </div>
                // </div>
              
            //   {(paymentObj.type === "cash")  && (
            //     <div class="cash-content">
            //       <img
            //         class="img-fluid"
            //         src={
            //           "https://ik.imagekit.io/lcq5etn9k/restro/wallet-big_TNI1TIi4FT.png"
            //         }
            //         alt=""
            //       />
            //       <p>{("Great we will accept your payment after serving you.")}</p>
            //     </div>
            //   )}
            // </div> */}