/**
 * Created by Lahiru on 7/3/2017.
 */

function Reservation(resID, roomNo, checkIn, checkOut, days, totalFee, balance, customerID, status) {
    this.resID = resID;
    this.roomNo = roomNo;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.days = days;
    this.totalFee = totalFee;
    this.balance = balance;
    this.customerID = customerID;
    this.status = status;
}


function Room(number, floor, size, prize, AC, description) {
    this.number = number;
    this.floor = floor;
    this.size = size;
    this.prize = prize;
    this.AC = AC;
    this.description = description;
}


function Customer(custID, name, NID, VISA, telephone, address) {
    this.custID = custID;
    this.name = name;
    this.NID = NID;
    this.VISA = VISA;
    this.telephone = telephone;
    this.address = address;
}


function Meal(mealID, pre, type) {
    this.mealID = mealID;
    this.pre = pre;
    this.typee = type;
}


function Payment(paymentID, date, value) {
    this.paymentID = paymentID;
    this.date = date;
    this.value = value;
}


function User(name, password, fullName, position, empID) {
    this.name = name;
    this.password = password;
    this.fullName = fullName;
    this.position = position;
    this.empID = empID;
}


function stringToDate(dateString) {
    var dateArray = dateString.split("-");
    return new Date(dateArray[0], dateArray[1], dateArray[2]);
}


function dateToString(date) {
    var year = date.getFullYear();
    var month =  ("0" + (date.getMonth()+1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return ( year+"-"+month+"-"+day);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// $("#logout").click(function() {
//     window.location = "http://localhost/HotelManagement/view/index.html";
// })


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function connectDB(file, preStatement, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callback(xmlhttp.responseText);
        }else {
            // alert(xmlhttp.readyState + " " + xmlhttp.status+ " ");
        }
    }
    var path = "http://localhost/HotelManagement/php/" + file + preStatement;
    xmlhttp.open("GET",path,true);

    xmlhttp.send();
}


