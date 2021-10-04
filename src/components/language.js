const translate = {
    "Home" : "گھر",
    "How It Works" : "How It Works",
    "Pricing" : "Pricing",
    "FAQ's" : "FAQ's",
    "Benifits" : "Benifits",
    "login" : "login",
    "SCAN, ORDER & PAY" : "SCAN, ORDER & PAY",
    "Your customers can order from their table by" : "Your customers can order from their table by",
    "simply scanning a QR code" : "simply scanning a QR code",
    "Try it for free" : "Try it for free",
    "View Plans" : "View Plans",
    "Mobile scan code order" : "Mobile scan code order",
    "Turn on the scan QR code function in any software. Including skip-the-line, online ordering, self-service plus dishes, changing table, call attendant and other functions" : "Turn on the scan QR code function in any software. Including skip-the-line, online ordering, self-service plus dishes, changing table, call attendant and other functions",
    "Register Now" : "Register Now"
}

const t = (str) => {
    let lang = localStorage.getItem("language") || "en";
    return  lang == "ar" ? translate[str] : str;
}

module.exports = {
    t
}
