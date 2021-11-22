import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../API/config";
import { t } from "../language";
const Modifier = ({ activeProduct, modifier, handleClose, handleCartAdd , alreadyInCart = {}}) => {
  const [selectedModifiers, setSelectedModifier] = useState({});
  const [finalProduct, setProduct] = useState({});
  const [activeItem , setActiveItem] = useState({
      
  });

  useEffect(() => {
    activeProduct.id && setActiveItem({
      [activeProduct.id] : {
        qty: 1,
        title: activeProduct.title,
        titleAr: activeProduct.titleAr,
        price: activeProduct.sellingPrice,
        modifiers: [],
      }
    })
  }, [activeProduct])
  useEffect(() => {
    if(Object.keys(selectedModifiers).length){
      let tempName = getSelectedModifiersName(selectedModifiers);
      setActiveItem({
        [activeProduct.id + tempName] : {
          qty: 1,
          titleAr: activeProduct.titleAr,
          title: activeProduct.title,
          price: activeProduct.sellingPrice,
          modifiers: selectedModifiers,
        }
      })
    }
  }, [selectedModifiers])
  const handleRadioClick = (itm, mainItem) => {
    setSelectedModifier((fld) => ({
      ...fld,
      [mainItem.name]: [
        {
          title: itm.name,
          titleAr: itm.nameAr,
          price: itm.price,
        },
      ],
    }));
  };

  useEffect(() => {
    console.log(alreadyInCart)
    setProduct({});
  }, [alreadyInCart])

  const handleCheckBoxClick = (itm, mainItem) => {
    let temp = 0;
    let field = selectedModifiers[mainItem.name] || [];
    if (field && field.length) {
      let h = [];
      field.map((it, index) => {
        if (it.title == itm.name) {
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
          titleAr: itm.nameAr,
          price: itm.price,
        },
      ];
      temp = 1;
    }

    if (temp == 0) {
      field.push({
          titleAr: itm.nameAr,
          title: itm.name,
        price: itm.price,
      });
    }

    if(mainItem.isRequired){
      if((mainItem.min > field.length) || (mainItem.max < field.length)){
        return;
      }
    } else {
      if((mainItem.max < field.length)){
        return;
      }
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
        let count = itm.min;
        if (itm.isRequired) {
          let h = [];
          itm.modifiers.map((item , idx) => {
            console.log(count , h)
            if (count > 0) {
              h = field[itm.name] || [];
              h.push({ title: item.name,titleAr: item.nameAr, price: item.price })
                field = {
                ...field,
                [itm.name]: h
              };
              count = count-1;
            }
          })
          
        }
      });
      console.log(field)
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
        titleAr: activeProduct.titleAr,
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
    let currentActiveItem = Object.keys(activeItem)[0];
    let newItem= activeItem;
    if(finalProduct[currentActiveItem]){
      newItem = { [currentActiveItem] : {...activeItem[currentActiveItem], qty: finalProduct[currentActiveItem].qty + 1 }}
    }

    setProduct((product) => ({...product, 
      ...newItem
    }));
  };

  
  const getProductCount = () => {
    let obj = {
      count: 0,
      price: 0,
    };
    if(Object.keys(activeItem)[0]){
      let newFinalProduct = {...finalProduct, ...{[Object.keys(activeItem)[0]] : finalProduct[Object.keys(activeItem)[0]] ? { ...finalProduct[Object.keys(activeItem)[0]] , qty : finalProduct[Object.keys(activeItem)[0]].qty + 1} :  activeItem[Object.keys(activeItem)[0]] }};

      newFinalProduct &&
        Object.keys(newFinalProduct).map((itm) => {
          obj.count += parseInt(newFinalProduct[itm].qty);
          obj.price += parseInt(newFinalProduct[itm].price) * parseInt(newFinalProduct[itm].qty);
          Object.keys(newFinalProduct[itm].modifiers).map(dta => {
            let temp = 0;
            newFinalProduct[itm].modifiers[dta].map(it => {temp += parseInt(it.price)});
             obj.price += temp * parseInt(newFinalProduct[itm].qty);
          })
        });
      
   
    }
    return obj;
  };
  
  const handleAddItem = () => {
    let currentActiveItem = Object.keys(activeItem)[0];
    let newItem= activeItem;
    if(finalProduct[currentActiveItem]){
      newItem = { [currentActiveItem] : {...activeItem[currentActiveItem], qty: finalProduct[currentActiveItem].qty + 1 }}
    }
    console.log(alreadyInCart); 
    const currentFinalProduct = {...finalProduct , ...newItem};
    let obj = {};
    if(Object.keys({...alreadyInCart, ...currentFinalProduct}).length){
      Object.keys({...alreadyInCart, ...currentFinalProduct}).map(itm => {
        if(currentFinalProduct[itm] && alreadyInCart[itm]){
          obj[itm] =  {...alreadyInCart[itm], qty : (alreadyInCart[itm].qty || 0) + currentFinalProduct[itm].qty};

        } else if(currentFinalProduct[itm]){
          obj[itm] =  currentFinalProduct[itm];
        } else{
          obj[itm] =  alreadyInCart[itm];
        }
      })
    }

    handleCartAdd(obj, activeProduct.id)

  };

  if(!activeProduct){
    return null;
  }
  console.log(modifier)
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
                  <h4>{localStorage.getItem("language") == "en" ? activeProduct.title : activeProduct.titleAr}</h4>
                  <h5>{t("Calorie")}: {activeProduct.calorie}</h5>
                </div>
                <div className="dish-desc">
                  <p>{localStorage.getItem("language") == "en" ? activeProduct.description : activeProduct.descriptionAr}</p>
                </div>
                <div className="dis-topping">
                  {(modifier
                    ) &&
                    modifier.map((itm) => (
                      <>
                        <h3>
                          {itm.name}{" "}
                          <span
                            className={`${
                              itm.isRequired ? "required" : "optional"
                            }`}
                          >
                            {itm.isRequired ? t("Required") : t("Optional")}
                          </span>
                        </h3>
                        {itm.max > 1 ? <>
                        <span className="required">  {t("Select Upto")} {itm.max}</span>
                        </> : <></>}
                        <ul>
                          { (itm.isRequired && itm.min == 1 && itm.max == 1) ? (
                            <>
                              {itm.modifiers &&
                                itm.modifiers.map((it) => (
                                  <li>
                                    <p>{localStorage.getItem("language") == "en" ? it.name : it.nameAr }</p>
                                    <div className="radio-item">
                                      <span for="table-order">
                                        <span className="arabicRs">S<span className="arabicSmallRs">R</span></span>
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
                          ) : 
                          <>
                              {(itm.modifiers && itm.modifiers.length) &&
                                itm.modifiers.map((it) => (
                                  <li>
                                    <p>{localStorage.getItem("language") =="en" ?  it.name : it.nameAr}</p>
                                    <div className="checkbox-item">
                                      <span>
                                      <span style={{marginRight : 0}} className="arabicRs">S<span className="arabicSmallRs">R</span></span>
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
                            }
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
                <a onClick={() => (getProductCount().count ? handleAddItem(): () => {} )} className="add-item-close" href="javascript:void(0)">
                <h5> {t("ADD ITEM")}</h5>
                  <p>
                    {t("Total")} <span><span className="arabicRs">S<span className="arabicSmallRs">R</span></span> {getProductCount().price}</span>
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
