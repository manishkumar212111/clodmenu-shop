import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../API/config";

const Modifier = ({ activeProduct, modifier, handleClose, handleCartAdd , alreadyInCart}) => {
  const [selectedModifiers, setSelectedModifier] = useState({});
  const [finalProduct, setProduct] = useState(alreadyInCart || {});

  const handleRadioClick = (itm, mainItem) => {
    console.log(itm);
    setSelectedModifier((fld) => ({
      ...fld,
      [mainItem.name]: [
        {
          title: itm.name,
          price: itm.price,
        },
      ],
    }));
  };

  useEffect(() => {
    console.log(alreadyInCart)
    setProduct(alreadyInCart);
  }, [alreadyInCart])
  const handleCheckBoxClick = (itm, mainItem) => {
    console.log(itm);
    let temp = 0;
    let field = selectedModifiers[mainItem.name] || [];
    if (field && field.length) {
      let h = [];
      field.map((it, index) => {
        if (it.title == itm.name) {
          console.log("deleted field");
          temp = 1;
        } else {
          h.push(it);
        }
      });
      field = h;
    } else {
      field = [
        {
          title: itm.name,
          price: itm.price,
        },
      ];
      temp = 1;
    }

    if (temp == 0) {
      field.push({
        title: itm.name,
        price: itm.price,
      });
    }
    setSelectedModifier((fld) => ({
      ...fld,
      [mainItem.name]: field,
    }));
  };

  useEffect(() => {
    setSelectedModifier({});
  }, [activeProduct, modifier, handleClose]);
  useEffect(() => {
    let field = {};
    modifier &&
      modifier.map((itm) => {
        if (itm.isRequired) {
          if (itm.modifiers && itm.modifiers.length) {
            field = {
              ...field,
              [itm.name]: [
                { title: itm.modifiers[0].name, price: itm.modifiers[0].price },
              ],
            };
          }
        }
      });

    setSelectedModifier(field);
  }, [modifier]);

  const handleDecreaseProduct = () => {
    let tempName = Object.keys(finalProduct)[Object.keys(finalProduct).length -1];
    
    // const tempName = getSelectedModifiersName(selectedModifiers);
    let count =
      finalProduct[tempName] &&
      finalProduct[tempName]["qty"] > 1
        ? finalProduct[tempName]["qty"] - 1
        : 0;
    if (count == 0) {
      let product = finalProduct;
      delete product[tempName]
      setProduct((pro) => ({
        ...product      
      }));
    } else 
    setProduct((product) => ({
      ...product,
      [tempName]: {
        qty: count,
        title: activeProduct.title,
        price: activeProduct.sellingPrice,
        modifiers: selectedModifiers,
      },
    }));
  };

  const getSelectedModifiersName = (product) => {
    let testStr = "";
    Object.keys(product).map((itm) => {
      testStr +=
        product[itm] && product[itm].length
          ? product[itm].map((it) => it.title.replaceAll(" ", "_")).join(",")
          : "";
    });
    return testStr;
  };

  const handleIncreaseProduct = () => {
    console.log("dsvjbjb");
    const tempName = getSelectedModifiersName(selectedModifiers);
    setProduct((product) => ({
      ...product,
      [activeProduct.id + tempName]: {
        qty:
          product[activeProduct.id + tempName] &&
          product[activeProduct.id + tempName]["qty"]
            ? product[activeProduct.id + tempName]["qty"] + 1
            : 1,
        title: activeProduct.title,
        price: activeProduct.sellingPrice,
        modifiers: selectedModifiers,
      },
    }));
  };

  console.log(selectedModifiers);
  console.log(finalProduct);

  const getProductCount = () => {
    let obj = {
      count: 0,
      price: 0,
    };

    finalProduct &&
      Object.keys(finalProduct).map((itm) => {
        obj.count += parseInt(finalProduct[itm].qty);
        obj.price += parseInt(finalProduct[itm].price) * parseInt(finalProduct[itm].qty);
        Object.keys(finalProduct[itm].modifiers).map(dta => {
          console.log(finalProduct[itm].modifiers , dta)
          let temp = 0;
           finalProduct[itm].modifiers[dta].map(it => {temp += parseInt(it.price)});
           obj.price += temp * parseInt(finalProduct[itm].qty);
        })
      });
    
      console.log(finalProduct, obj)
      return obj;
  };
  return (
    <>
      <div
        id="modal-container"
        tabindex="-1"
        class={activeProduct ? "two" : ""}
      >
        <div className="modal-background">
          <div id="close" onClick={() => handleClose()}>
            <i className="bx bx-x"></i>
          </div>
          <div className="modal">
            <div className="pop-up-body">
              <div className="popup-banner">
                <img
                  src={BASE_URL + activeProduct.imageUrl}
                  height="100"
                  alt=""
                />
              </div>
              <div className="container-fluid">
                <div className="pop-dish-name">
                  <h4>{activeProduct.title}</h4>
                  <h5>270 cal</h5>
                </div>
                <div className="dish-desc">
                  <p>{activeProduct.description}</p>
                </div>
                <div className="dis-topping">
                  {modifier &&
                    modifier.length &&
                    modifier.map((itm) => (
                      <>
                        <h3>
                          {itm.name}{" "}
                          <span
                            className={`${
                              itm.isRequired ? "required" : "optional"
                            }`}
                          >
                            {itm.isRequired ? "Required" : "Optional"}
                          </span>
                        </h3>
                        <ul>
                          {itm.max > 0 ? (
                            <>
                              {itm.modifiers &&
                                itm.modifiers.map((it) => (
                                  <li>
                                    <p>{it.name}</p>
                                    <div className="radio-item">
                                      <span for="table-order">
                                        {"$"}
                                        {it.price}
                                      </span>
                                      <input
                                        type={"radio"}
                                        id={`${it.name}${it.price}`}
                                        name={itm.name}
                                        onChange={() =>
                                          handleRadioClick(it, itm)
                                        }
                                        checked={
                                          selectedModifiers &&
                                          selectedModifiers[itm.name] &&
                                          selectedModifiers[itm.name].length &&
                                          selectedModifiers[itm.name].filter(
                                            (data) => data.title === it.name
                                          ).length
                                            ? true
                                            : false
                                        }
                                      />

                                      <label
                                        for={`${it.name}${it.price}`}
                                      ></label>
                                    </div>
                                  </li>
                                ))}
                            </>
                          ) : (
                            <>
                              {itm.modifiers &&
                                itm.modifiers.map((it) => (
                                  <li>
                                    <p>{it.name}</p>
                                    <div className="checkbox-item">
                                      <span>
                                        {"$"}
                                        {it.price}
                                      </span>
                                      <label className="check-container">
                                        <input
                                          type="checkbox"
                                          id={`${it.name}${it.price}`}
                                          name={itm.name}
                                          onChange={() =>
                                            handleCheckBoxClick(it, itm)
                                          }
                                          checked={
                                            selectedModifiers &&
                                            selectedModifiers[itm.name] &&
                                            selectedModifiers[itm.name]
                                              .length &&
                                            selectedModifiers[itm.name].filter(
                                              (data) => data.title === it.name
                                            ).length
                                              ? true
                                              : false
                                          }
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                    </div>
                                  </li>
                                ))}
                            </>
                          )}
                        </ul>
                      </>
                    ))}
                </div>
              </div>
            </div>

            <div className="order-btn">
              <div className="container-fluid">
                <div className="quantity-wraper">
                  <div
                    className="value-button"
                    onClick={handleDecreaseProduct}
                    id="decrease"
                    value="Decrease Value"
                  >
                    -
                  </div>
                  <input
                    type="number"
                    id="number1"
                    value={getProductCount().count}
                    disabled
                  />
                  <div
                    className="value-button"
                    id="increase"
                    onClick={handleIncreaseProduct}
                    value="Increase Value"
                  >
                    +
                  </div>
                </div>
                <a className="add-item-close" href="javascript:void(0)">
                <h5 onClick={() => (getProductCount().count ? handleCartAdd(finalProduct, activeProduct.id): () => {} )}>ADD ITEM</h5>
                  <p>
                    Total <span>${getProductCount().price}</span>
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

export default Modifier;
