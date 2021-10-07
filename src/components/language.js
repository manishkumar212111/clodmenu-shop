const translate = {
    "view cart" : "view cart",
    "items in cart" : "items in cart",
    "Table" : "Table",
    "MENU": "MENU",
    "ADD" : "ADD",
    "Calorie": "Calorie",
    "Select Upto": "Select Upto",
    "ADD ITEM" : "ADD ITEM",
    "Total" : "Total",
    "Order": "Order",
    "Creating order, Please wait": "Creating order, Please wait",
    "Order on the way": "Order on the way",
    "We have start preparing your order, it will be served you soon" : "We have start preparing your order, it will be served you soon",
    "Order Number": "Order Number",
    "Missed Something ?": "Missed Something ?",
    "Order More": "Order More",
    "Your Cart" : "Your Cart",
    "Your cart is empty" : "Your cart is empty",
    "payments" : "payments",
    "Payment method" : "Payment method",
    "Pay Cash" : "Pay Cash",
    "Pay Via Card": "Pay Via Card",
    "MADA" : "MADA",
    "Great we will accept your payment after serving you." : "Great we will accept your payment after serving you.",
    "use this card" : "use this card",
    "Select" : "Select",
    "Payment Option": "Payment Option",
    "Cash" : "Cash",
    "Mada" : "Mada",
    "Order Instructions": "Order Instructions",
    "Ex - Do not put bell pepper in pizza, serve beer chilled": "Ex - Do not put bell pepper in pizza, serve beer chilled",
    "Order Serve At": "Order Serve At",
    "Take Away" : "Take Away",
    "Item Total": "Item Total",
    "Sales Tax": "Sales Tax",
    "Place Order" : "Place Order"

}

const t = (str) => {
    let lang = localStorage.getItem("language") || "en";
    return  lang == "ar" ? translate[str] : str;
}

module.exports = {
    t
}
