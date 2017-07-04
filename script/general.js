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


function getRoom(roomNo) {
    //////query room from the database.................................................................................................................
    var floor = 0;
    var size = "Double";
    var prize = 13500;
    if(roomNo > 50) {
        floor =1;
        prize = 16000;
    }else if(roomNo > 100) {
        floor = 2;
        size = "Single";
    }
    return new Room(roomNo, floor, size, prize, true, "View of Lagoon and Temple");
}


function getCustomer(customerID) {
    var name = "Lahiru Sampath";
    var NID = "960313690v";
    var VISA = "";
    var telephone = "+94719360004";
    var addresss = "Nandana, Penatiyana, Weligama";
    //use databse //////////////.........................................................................................................................
    return new Customer(customerID,name,NID,VISA,telephone,addresss);
}


function getMeal(mealID) {
    //query from the database...........................................................................................................................
    var pre = "Veg";
    var type = "Full Bread";
    return new Meal(mealID, pre, type);
}


