'use strict'

const regexps = {
	url: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
	email: /^[a-z0-9]+[\.a-z0-9+_-]+(\.[a-z0-9+_-]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|consulting|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
	alnum: /^[A-Za-z0-9]+$/,
	alnumwithspace: /^[A-Za-z0-9 ]+$/,
	alpha: /^[A-Za-z]+$/,
	alphawithspace: /^[ A-Za-z ]+$/,
	number: /^[0-9]+$/,
	postcode: /^([1-9][0-9]{5})$/,
	mobile: /^(?![9]{10})(?:[6|7|8|9][0-9]{9})$/,
    pancard: /^[a-zA-Z]{5}\d{4}[a-zA-Z]{1}$/,
    DateBelow2000: /^(195[2-9]|19[6-9][0-9])\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/,
    DateBelow2000R : /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-(195[2-9]|19[6-9][0-9])$/,
    fullnamewithspace:/^([a-zA-z]+\s[a-zA-z])$/,
    voterID:/^([a-zA-Z]){3}([0-9]){7}?$/,
    dl: /^([A-Z]){2}(\d{2})(\d{4})(\d{7})$/,
    passport:/^[A-Z][0-9]{8}$/,
    timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
	dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
	hexadecimal: /^[0-9a-fA-F]+$/,
	hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
	ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
	ipv6: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,

	// IPV4 + IPV6
	ipV4V6: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,

	//ONLY IP V4
	ip: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
    vehiclenumber: /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{0,2}[0-9]{4}$/,
    pan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}$/
};

const defaults = {
    messages: {
        required: 'This field is required.',
        email: 'Please enter valid email.',
        pan:'Please enter valid pan number',
        url: 'Please enter valid url.',
        alnum: 'Special chars and spaces are not allowed.',
        alnumwithspace: 'Special chars are not allowed.',
        vehiclenumber: 'Please enter valid Registration Number.',
        alpha: 'Only alphabets without spaces are allowed.',
        alphawithspace: 'Only alphabets with spaces are allowed.',
        number: 'Please enter valid number.',
        postcode: 'Please enter valid six digit postcode.',
        mobile: 'Please enter valid mobile number.',
        hexadecimal: 'Please enter valid hexadecimal string.',
        ip: 'Please enter valid IP.',
        equalTo: 'String must match.',
        checked: 'Please select atleast one.',
        minLength: 'String is too small',
        maxLength: 'String is too large'
    },
};

let defaultEvent = "";
let validateUtility = {
    
    validate(selector, id , cb) {
        defaultEvent = selector;        
        let error = {
            status: true,
            message: ""
        }

        var validationType = selector.getAttribute("data-vu-type");
        if (validationType == null || typeof validationType == 'undefined') return;
        let msg = selector.getAttribute("data-vu-err-msg");
        var type = validationType.split(',');
        for (var element in type) {
            if (!validateUtility[type[element]](selector.value)) {
                    error = {
                        status: false,
                        message: msg ? msg : defaults.messages[type[element]]
                    }
                    break;
                }
            }

        cb(error , id , selector)
            
    },
    
    stopDefault(event) {
        
        var validationType = event.target.getAttribute("data-vu-type");
        if (validationType == null || typeof validationType == 'undefined') return;
        var type = validationType.split(',');
        if (type.length == 0) return;
        var key = String.fromCharCode(event.which);
        
        if (type.indexOf('alpha') > -1) {
            if (!regexps['alpha'].test(key))
                event.preventDefault();
            
        } else if (type.indexOf('alphawithspace') > -1) {
            if (!regexps['alphawithspace'].test(key))
                event.preventDefault();
        } else if (type.indexOf('number') > -1 || type.indexOf('mobile') > -1) {
            if (!regexps['number'].test(key))
                event.preventDefault();
        } else if (type.indexOf('alnumwithspace') > -1) {
            if (!regexps['alnumwithspace'].test(key))
                event.preventDefault();
        } 
    }, 

    dynamicRegx() {
        for (var regexp in regexps) {
                this._regexpCheck(regexp, regexps);
        }
        return this;
    },

    _regexpCheck: function (regexp, regexps) {
        validateUtility[regexp] = function (value) {
            return regexps[regexp].test(value);
        };
    },
    
    required(value) {
       return value.toString().trim().length !== 0;
    },
    
    minLength(value, length) {
        let len = length ? length : defaultEvent ? parseInt(defaultEvent.getAttribute('data-vu-min-length')) : 0;
        return value.trim().length >= len;
    },
    
    isEmpty(v) {
        return v.toString().trim().length === 0;
    },

    minValue: function (v,minValue) {
        let value = minValue ? minValue : defaultEvent ? parseInt(defaultEvent.getAttribute('data-vu-min-value')) : 0;
        return  v >= value;
    },

    equalTo(el , el1) {        
        return el === el1;
    },

    maxLength(v, length) {
        let len = length ? length : defaultEvent ? parseInt(defaultEvent.getAttribute('maxlength')) : defaults.maxLength;
        return v.trim().length <= len;
    },    
    isChecked(el) {
        //console.log("in checked")
        return (el.checked ? true : false);
    },
}
validateUtility = validateUtility.dynamicRegx();

export default validateUtility;