/**
 * Created by Lahiru on 7/18/2017.
 */

function fullNameValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your full name.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^[a-z A-Z]*$/.test(text)) {
            alert("Please use only letters for your full name.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}

function addressValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your address.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^[a-z ,0-9A-Z]*$/.test(text)) {
            alert("Please use only valid letters for your address.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}

function visaValidation(VISA, NID, max) {
    var textVISA = VISA.val();
    var lengthVISA = textVISA.length;
    var testNID = NID.val();
    var lengthNID = testNID.length;

    if(lengthNID==0 && lengthVISA==0) {
        alert("Please fill passport no or national ID no.");
        VISA.focus();
    }else if(lengthNID>max) {
        alert("Please use less than "+max+" characters.");
        NID.focus();
    }else if(lengthVISA>max) {
        alert("Please use less than "+max+" characters.");
        VISA.focus();
    }else {
        return true;
    }
    return false;
}

function telephoneValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your telephone number.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^[0-9]*$/.test(text)) {
            alert("Please use only digits for your telephone number.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}

function paymentValidate(element, notnull) {
    var text = element.val();
    var length = text.length;
    console.log(text);

    if(length == 0 && notnull) {
        alert("Please enter a value to pay.");
    }else {
        if(! /^[0-9]*$/.test(text)) {
            alert("Please use only digits for your payment.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;

}

function numberValidate(element, max, typee) {
    var number = parseInt(element.val());

    if(number == 0) {
        alert("Please provide "+typee+".");
    }else if(isNaN(number) || number<0) {
        alert("Please provide a positive number.");
    }else if(number>max) {
        alert("Please provide a number less than "+max+".");
    }else {
        return true;
    }
    element.focus();
    return false;
}

function descriptionValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your room description.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^[a-z A-Z]*$/.test(text)) {
            alert("Please use only letters for room description.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}

function nameValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your user name.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^[a-zA-Z]*$/.test(text)) {
            alert("Please use only letters for user name.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}

function passwordValidate(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your password.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        return true;
    }
    element.focus();
    return false;
}

function empIDValidation(element, max, notnull) {
    var text = element.val();
    var length = text.length;

    if(length == 0 && notnull) {
        alert("Please provide your employee ID.");
    }else if(length > max) {
        alert("Please use less than "+max+" characters.");
    }else {
        if(! /^E[0-9]*$/.test(text)) {
            alert("Please use only letters and digits for employee ID.");
        }else {
            return true;
        }
    }
    element.focus();
    return false;
}



