/**
 * Created by Lahiru on 6/24/2017.
 */

////////////////////////Receptions Menu/////////////////////////
$("#new_reserve_m").click( function(){
    initNewReservation();

    var newResDiv = $("#new_reserve_r");
    $(this).parent("#reception_menu").hide();
    // $("#content").append(newResDiv);
    newResDiv.show();
});


function initNewReservation() {
    var today = dateToString(new Date());
    $("#new_reserve_r input[type='date']").val(today);

    $("#new_reserve_r input[id='any_type']").attr("checked",true);
    $("#new_reserve_r input[id='single_size']").attr("checked",true);

    $("#new_reserve_r input[name='check_in']").attr("min",today);
    validateDates();
    loadAvailableRooms();
}


$("#current_reserve_m").click(function() {
    initReservations();

    var currReserves = $("#current_reserve_r");
    $("#reception_menu").hide();
    currReserves.show();
});


function initReservations() {
    $("#current_reserve_r input[type='checkbox']").attr("checked",true);
    $("#current_reserve_r #search_btn").val("");

    loadCurrentReservations();
}


$("#rooms_m").click(function() {
    initRooms();

    $("#reception_menu").hide();
    $("#rooms_r").show();
});


///////////////////////New Reservation sub menu////////////////////////


var availableRooms = new Array();


$("#new_reserve_r input[type='radio'], #new_reserve_r #check_out").change( loadAvailableRooms );


$("#new_reserve_r #check_in").change( function() {
    validateDates();
    loadAvailableRooms();
});


$("#new_reserve_r .back_btn").click(function(){
    var receptionMenu = $("#reception_menu");
    $("#new_reserve_r").hide();
    // $("#content").append(receptionMenu);
    receptionMenu.show();
});


function validateDates() {
    var checkIn = new Date($("#new_reserve_r input[name='check_in']").val());
    var checkOut = new Date($("#new_reserve_r input[name='check_out']").val());

    var checkInString = dateToString(checkIn);
    $("#new_reserve_r input[name='check_out']").attr("min", checkInString);


    if(checkIn.getTime() >= checkOut.getTime()){
        $("#new_reserve_r input[name='check_out']").val(checkInString);
    }
}


function loadAvailableRooms() {
    $("#new_reserve_r table").empty();
    availableRooms.length = 0;

    var checkIn = dateToString(new Date($("#new_reserve_r #check_in").val()));
    var checkOut =dateToString(new Date($("#new_reserve_r #check_out").val()));
    var type = $("#new_reserve_r input[name='room_type']:checked").attr('id');
    var size = $("#new_reserve_r input[name='room_size']:checked").attr('id');

    //connect to database and load available rooms use a design pattern to build room objects and connect to database..............................
    availableRooms.push(new Room(34, 0, "Single", 12500, true, "Terrace with view of lagoon"));
    availableRooms.push(new Room(124, 1, "Double", 15700, true, "Bath in morning light"));
    availableRooms.push(new Room(67, 3, "Single", 12500, true, "Sight of lagoon"));
    availableRooms.push(new Room(01, 2, "Double", 17500, true, "Sight of lagoon and temple"));
    availableRooms.push(new Room(38, 2, "Double", 13500, false, "Terrace with view of lagoon"));
    availableRooms.push(new Room(83, 2, "single", 10500, true, "Bath in morning light"));
    availableRooms.push(new Room(185, 0, "Double", 12500, false, "Terrace with view of lagoon"));
    availableRooms.push(new Room(19, 1, "Single", 12500, true, "Cool breeze flows through the room"));
    availableRooms.push(new Room(72, 3, "Single", 10500, false, "Nearest to the elevator"));

    for (var i=0; i<availableRooms.length; i++) {
        var room = availableRooms[i];
        var AC = "AC";
        if(room.AC == false) {
            AC = "None AC";
        }
        var floor = "Ground floor";
        if(room.floor != 0){
            floor = "Floor "+"#"+room.floor;
        }
        var num = room.number;
        var details = "Rs. "+room.prize+"/day"+", "+room.description+", "+room.size+", "+AC+", "+floor;
        $("#new_reserve_r table").append("<tr><td class='available_room'><h3># "+num+"</h3><p>"+details+"</p></td><tr/>");
    }

    $("#new_reserve_r .available_room").click(function() {
        var selectedRoom = availableRooms[($(this).parent("tr").index())/2];
        var checkIn = dateToString(new Date($("#new_reserve_r #check_in").val()));
        var checkOut = dateToString(new Date($("#new_reserve_r #check_out").val()));
        var reservation = new Reservation("R0012", selectedRoom.number, checkIn, checkOut);

        initReserveRoom(reservation);

        var reserveRoom = $("#reserve_room_r");
        $("#new_reserve_r").hide();
        // $("#content").append(reserveRoom);
        reserveRoom.show();
    });
}


$("#reserve_room_r .back_btn").click(function(){
    var newReserve = $("#new_reserve_r");
    $("#reserve_room_r").hide();
    // $("#content").append(newReserve);
    newReserve.show();
});



/////////////////////new reservation sub menu - reserve selected room////////////


var currentReserve = new Reservation(new Room().number,undefined,undefined);


function initReserveRoom(reservation) {
    currentReserve = reservation;
    var room = getRoom(reservation.roomNo);
    ;var AC ="None AC";
    if(room.AC) {
        AC = "AC";
    }
    alert(reservation.checkIn+ " " + reservation.checkOut);
    var checkInString = reservation.checkIn;
    var checkIn = stringToDate(reservation.checkIn);

    var checkOutString = reservation.checkOut;
    var checkOut = stringToDate(reservation.checkOut);

    var ms1 = Date.UTC(checkIn.getFullYear(),checkIn.getMonth(),checkIn.getDate());
    var ms2 = Date.UTC(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
    var days = Math.floor(ms2-ms1)/(1000*3600*24)+1;
    reservation.days = days;

    $("#reserve_detail").empty();
    $("#reserve_detail").append("<h2># "+currentReserve.roomNo+"</h2>")
    $("#reserve_detail").append("<p>"+room.description+", #"+room.floor+" floor, "+room.size+", "+AC+"</p>");
    $("#reserve_detail").append("<p>Rental = Rs. "+room.prize+"/day <p/>")
    $("#reserve_detail").append("<p>Check-In : "+checkInString+" & Check-Out : "+checkOutString+" ( "+days+" days )<p/>");

    $("#reserve_room_r input[id='stay_only_type']").attr("checked",true);
    $("#reserve_room_r input[id='none_veg']").attr("checked",true);

    $("#reserve_room_r input[id='customer_name']").val("");
    $("#reserve_room_r input[id='customer_ID']").val("");
    $("#reserve_room_r input[id='customer_VISA']").val("");
    $("#reserve_room_r input[id='customer_phone']").val("");
    $("#reserve_room_r input[id='customer_add']").val("");

    $("#reserve_room_r input[id='GRC_check']").attr("checked",true);
    $("#reserve_room_r #reserve_btn").text("Reserve This Room");
    $("#reserve_room_r #reserve_btn").unbind('click');
    $("#reserve_room_r #reserve_btn").click(reserveRoom);

    calculateFee();
}


function calculateFee() {
    var mealType = $(".radio_group input[name='meal_type']:checked").attr('id');
    var mealPre = $(".radio_group input[name='meal_pre']:checked").attr('id');

    //load meal fee and other related fees from the database.....................................................................................
    var mealFee = 0;
    if(mealType == "Breakfast_type") {
        mealFee = 500;
    }else if(mealType == "HB_type") {
        mealFee = 1000;
    }else if(mealType == "FB_type") {
        mealFee = 1500;
    }
    if(mealPre == "none_veg") {
        mealFee *= 1.5;
    }
    //change these values according to the database query.....................................................................................
    var room = getRoom(currentReserve.roomNo);

    currentReserve.totalFee = (currentReserve.days*room.prize)+(mealFee*currentReserve.days);

    $("#meal_fee_div").empty();
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Room rental  </span>" +
    "Rs. "+(currentReserve.days*room.prize)+" ( "+room.prize+" x "+currentReserve.days+" )</p>");
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Meal fee </span>" +
        "Rs. "+(mealFee*currentReserve.days)+" ( "+mealFee+" x "+currentReserve.days+" )</p>")
    $("#meal_fee_div").append("<p><b><span style='display: inline-block; width: 120px;'>Total value </span>" +
        "Rs. "+(currentReserve.totalFee)+"</b></p>");
}


$("#reserve_room_r input[name='meal_type']").change(calculateFee);


$("#reserve_room_r input[name='meal_pre']").change(calculateFee);


$("#reserve_room_r input[name='FIT/GRC']").change(function() {
    var method = $("#reserve_room_r input[name='FIT/GRC']:checked").attr('id');

    if(method == "GRC_check") {
        $("#payment_reserve").empty();
        $("#reserve_room_r #reserve_btn").text("Reserve This Room");
        $("#reserve_room_r #reserve_btn").unbind('click');
        $("#reserve_room_r #reserve_btn").click(reserveRoom);
    }else {
        $("#payment_reserve").append("<label for='payed_value' class='text_label'>Payed Rs.  </label>");
        $("#payment_reserve").append("<input type='text' id='payed_value'>");
        $("#payment_reserve").append("<br>");
        $("#payment_reserve").append("<label class='text_label'>Balance Rs.  </label>");
        $("#payment_reserve").append("<p style='display: inline-block' id='balance_value'><b>"+currentReserve.totalFee+"</b></p>");

        $("#payment_reserve #payed_value").keypress(function() {
            var payedValue = parseInt($("#payment_reserve #payed_value").val());
            $("#payment_reserve #balance_value b").text(currentReserve.totalFee - payedValue);
        })

        $("#reserve_room_r #reserve_btn").text("Check-In To Room");
        $("#reserve_room_r #reserve_btn").unbind('click');
        $("#reserve_room_r #reserve_btn").click(checkInRoom);
    }
});


function reserveRoom() {
    if(validateCustomerDetail()) {
        //reserve this room using dbms and currentReserve object.................................................................................

        var receptionMenu = $("#reception_menu");
        $("#reserve_room_r").hide();
        receptionMenu.show();
        alert("reservation will be saved as a GRC")
    }
}


function checkInRoom() {
    if(validateCustomerDetail()) {
        //reserve this room using dbms and currentReserve object.................................................................................

        var receptionMenu = $("#reception_menu");
        $("#reserve_room_r").hide();
        receptionMenu.show();
        alert("reservation will be saved as a FIT");
    }
}


function validateCustomerDetail() {
    var valid = true;
    if($("#reserve_room_r input[id='customer_name']").val().length == 0) {
        $("#reserve_room_r label[for='customer_name']").css("color", "red");
        alert("Provide Customer Name");
        valid = false;
    }
    if( ($("#reserve_room_r input[id='customer_ID']").val().length == 0) || ($("#reserve_room_r input[id='customer_ID']").val().length == 0) ) {
        $("#reserve_room_r label[for='customer_ID']").css("color", "red");
        $("#reserve_room_r label[for='customer_VISA']").css("color", "red");
        alert("Provide customer ID or VISA");
        valid = false;
    }
    if($("#reserve_room_r input[id='customer_phone']").val().length == 0) {
        $("#reserve_room_r label[for='customer_phone']").css("color", "red");
        alert("Provide Customer telephone number");
        valid = false;
    }
    return valid;
}



////////////////////////current reservations///////////////////////////////////////////////

var currReserves = new Array();


function loadCurrentReservations() {
    var reserveContainer = $("#current_reserve_r #reserve_container");
    reserveContainer.empty();
    currReserves.length = 0;
    //select values from the checkboxes and query from the database.............................................................................

    currReserves.push(new Reservation("R0023","123","2017-03-23","2017-03-31",8,23500,12000,"C0123","Reserved", "M0023"));
    currReserves.push(new Reservation("R0045","34","2017-03-23","2017-03-31",8,23500,12000,"C0123","CheckedIn", "M0023"));
    currReserves.push(new Reservation("R0013","175","2017-03-23","2017-03-31",8,23500,12000,"C0123","CheckedOut", "M0023"));
    currReserves.push(new Reservation("R0073","03","2017-03-23","2017-03-31",8,23500,12000,"C0123","CheckedOut", "M0023"));
    currReserves.push(new Reservation("R0123","67","2017-03-23","2017-03-31",8,23500,12000,"C0123","Reserved", "M0023"));
    currReserves.push(new Reservation("R0183","34","2017-03-23","2017-03-31",8,23500,12000,"C0123","CheckedIn", "M0023"));
    currReserves.push(new Reservation("R0003","45","2017-03-23","2017-03-31",8,23500,12000,"C0123","CheckedOut", "M0023"));

    for(var i=0; i<currReserves.length; i++) {
        var room = getRoom(currReserves[i].roomNo);
        var customer = getCustomer(currReserves[i].customerID);

        var classs = "reserved_res";
        var statusString = "Reserved";
        if(currReserves[i].status == "CheckedOut") {
            classs = "out_res";
            statusString = "Checked Out"
        }else if(currReserves[i].status == "CheckedIn") {
            classs = "in_res";
            statusString = "Checked In";
        }

        reserveContainer.append("<div class='reservation "+classs+"'>" +
            "<p><b> # "+room.number+"</b> by <b> "+customer.name+" </b></p>" +
            "<p>Check-In : "+currReserves[i].checkIn+", Check-out : "+currReserves[i].checkOut+"</p>" +
            "<p style='text-align: right; color: white;'> "+statusString+" </p>" +
            "<div/>");
    }

    $("#current_reserve_r .reservation").click(function() {
        initManageReservations(currReserves[$(this).index()]);

        var manageReserve = $("#manage_reserve_r");
        $("#current_reserve_r").hide();
        manageReserve.show();
    });
}


$("#current_reserve_r #search_btn").keypress( loadCurrentReservations );


$("#current_reserve_r .back_btn").click(function() {
    var receptionMenu = $("#reception_menu");
    $("#current_reserve_r").hide();
    receptionMenu.show();
});



/////////////////////////////////////manage reservations////////////////////////////////////////////////////////////////

var currentCustomer = new Customer();
var currentMeal = new Meal();


function initManageReservations(reservation) {
    currentReserve = reservation;

    $("#manage_reserve_r h3").text("# "+reservation.roomNo);

    var room = getRoom(reservation.roomNo);
    var AC = "None AC";
    if(room.AC) {
        AC = "AC";
    }
    var floor = "Gound floor";
    if(room.floor != 0) {
        floor = "Floor #"+room.floor;
    }
    var descriptionDiv = $("#manage_reserve_r #room_des");
    descriptionDiv.empty();

    descriptionDiv.append("<p id='room_des'><span style='display: inline-block; width: 150px;'>Room Description </span>" +
        " "+AC+", "+room.size+" bed, "+room.description+", "+floor+"</p>");

    var meal = getMeal(reservation.mealID);
    if(meal.pre == "None Veg") {
        $("#manage_reserve_r input[id='none']").attr("checked", true);
    }else {
        $("#manage_reserve_r input[id='veg']").attr("checked", true);
    }

    if(meal.typee == "Full Bread") {
        $("#manage_reserve_r input[id='FB']").attr("checked", true);
    }else if(meal.typee == "Half Bread") {
        $("#manage_reserve_r input[id='HB']").attr("checked", true);
    }else if(meal.typee == "Breakfast Only") {
        $("#manage_reserve_r input[id='Breakfast']").attr("checked", true);
    }else {
        $("#manage_reserve_r input[id='stay_only']").attr("checked", true);
    }

    $("#manage_reserve_r input[name='check_out']").val(reservation.checkOut);
    $("#manage_reserve_r input[name='check_in']").val(reservation.checkIn);

    var customer = getCustomer(reservation.customerID);
    $("#manage_reserve_r input[name='customer_name']").val(customer.name);
    $("#manage_reserve_r input[name='customer_ID']").val(customer.NID);
    $("#manage_reserve_r input[name='customer_VISA']").val(customer.VISA);
    $("#manage_reserve_r input[name='customer_add']").val(customer.address);
    $("#manage_reserve_r input[name='customer_telephone']").val(customer.telephone);

    $("#manage_reserve_r #total_value").text(currentReserve.totalFee);
    $("#manage_reserve_r #payed_value").text(currentReserve.totalFee-currentReserve.balance);
    $("#manage_reserve_r #balance_value").text(currentReserve.balance);

    if(reservation.status != "CheckedOut") {
        $("#manage_reserve_r #next_status").show();
        var task1 = "Check In";
        if(reservation.status == "CheckedIn") {
            task1 = "Check Out";
        }
        $("#manage_reserve_r #next_status").text(task1);

    }else {
        $("#manage_reserve_r #next_status").hide();
    }

    $("#next_status").click(nextReservationStatus);
    $("#save_reserve").click(saveReservationChanges);
    $("#manage_reserve_r #make_payment").click(makePayment);

    $("#manage_reserve_r input[name='check_in']").attr("min", dateToString(new Date()));
    var checkIn = new Date($("#manage_reserve_r input[name='check_in']").val());
    var checkOut = new Date($("#manage_reserve_r input[name='check_out']").val());
    var checkInString = dateToString(checkIn);
    $("#manage_reserve_r input[name='check_out']").attr("min", checkInString);
    if(checkIn.getTime() >= checkOut.getTime()){
        $("#manage_reserve_r input[name='check_out']").val(checkInString);
    }

    if(reservation.status == "CheckedIn") {
        $("#manage_reserve_r input[name='check_in']").prop("disabled", true);
        $("#manage_reserve_r input[name='check_out']").prop("disabled", false);
    }else if(reservation.status == "CheckedOut") {
        $("#manage_reserve_r input[name='check_in']").prop("disabled", true);
        $("#manage_reserve_r input[name='check_out']").prop("disabled", true);
    }else {
        $("#manage_reserve_r input[name='check_in']").prop("disabled", false);
        $("#manage_reserve_r input[name='check_out']").prop("disabled", false);
    }
}


$("#manage_reserve_r .back_btn").click(function() {
    initReservations();

    var currReserves = $("#current_reserve_r");
    $("#manage_reserve_r").hide();
    currReserves.show();
});


$("#manage_reserve_r input[name='meal_type']").change(changeMealFee);
$("#manage_reserve_r input[name='meal_pre']").change(changeMealFee);


$("#manage_reserve_r input[type='date']").change(function() {
    validateDates();
    var checkInString = $("#manage_reserve_r input[name='check_in']").val();
    var checkOutString = $("#manage_reserve_r input[name='check_out']").val();
    var checkIn = stringToDate(checkInString);
    var checkOut = stringToDate(checkOutString);

    var ms1 = Date.UTC(checkIn.getFullYear(),checkIn.getMonth(),checkIn.getDate());
    var ms2 = Date.UTC(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
    var days = Math.floor(ms2-ms1)/(1000*3600*24)+1;

    currentReserve.checkIn = checkIn;
    currentReserve.checkOut = checkOut;
    var newDays = days;

    var newTotal = parseInt((currentReserve.totalFee/currentReserve.days)*newDays);
    var newBalance = newTotal - (currentReserve.totalFee - currentReserve.balance);

    currentReserve.totalFee = newTotal;
    currentReserve.balance = newBalance;

    $("#manage_reserve_r #total_value").text(newTotal);
    $("#manage_reserve_r #payed_value").text(newTotal-newBalance);
    $("#manage_reserve_r #balance_value").text(newBalance);


});


function saveReservationChanges() {
    currentCustomer = getCustomer(currentReserve.customerID);
    currentCustomer.name = $("#manage_reserve_r input[name='customer_name']").val();
    currentCustomer.NID = $("#manage_reserve_r input[name='customer_ID']").val();
    currentCustomer.VISA = $("#manage_reserve_r input[name='customer_VISA']").val();
    currentCustomer.address = $("#manage_reserve_r input[name='customer_add']").val();
    currentCustomer.telephone = $("#manage_reserve_r input[name='customer_telephone']").val();

    //save changes in database////////////.......................................................................................................................................

    initReservations();

    var currReserves = $("#current_reserve_r");
    $("#manage_reserve_r").hide();
    currReserves.show();
}


function nextReservationStatus() {
    var nextStatus = "Checked In";
    if(currentReserve.status == "CheckedIn" ) {
        nextStatus = "CheckedOut";
    }
    currentReserve.status = nextStatus;
    saveReservationChanges();
}


function changeMealFee() {
    var mealType = $("#manage_reserve_r input[name='meal_type']:checked").attr('id');
    var mealPre = $("#manage_reserve_r input[name='meal_pre']:checked").attr('id');
    currentMeal.pre = mealPre;
    currentMeal.typee = mealType;

    //load meal fee and other related fees from the database.....................................................................................
    var mealFee = 0;
    if(mealType == "Breakfast") {
        mealFee = 500;
    }else if(mealType == "HB") {
        mealFee = 1000;
    }else if(mealType == "FB") {
        mealFee = 1500;
    }
    if(mealPre == "none") {
        mealFee *= 1.5;
    }
    var roomFee = getRoom(currentReserve.roomNo).prize;
    var newTotal = (roomFee + mealFee)*currentReserve.days;
    var newBalance = newTotal - (currentReserve.totalFee - currentReserve.balance);

    currentReserve.totalFee = newTotal;
    currentReserve.balance = newBalance;

    $("#manage_reserve_r #total_value").text(newTotal);
    $("#manage_reserve_r #payed_value").text(newTotal-newBalance);
    $("#manage_reserve_r #balance_value").text(newBalance);
}


function makePayment() {
    var toPay = currentReserve.totalFee - currentReserve.balance;
    var newPayment = parseInt($("#manage_reserve_r #payment_div input[type='text']").val());
    if(toPay < newPayment) {
        alert("Only Rs."+toPay+" need to paid. Extra charges won't be calculated.");
        newPayment = toPay;
    }
    currentReserve.balance -= newPayment;

    $("#manage_reserve_r #payed_value").text(currentReserve.totalFee - currentReserve.balance);
    $("#manage_reserve_r #balance_value").text(currentReserve.balance);
}



/////////////////////////////////////////rooms /////////////////////////////////////////////////////////////////////////

var roomList = new Array();


function initRooms() {
    $("#rooms_r input[id='any_room']").attr("checked", true);
    $("#rooms_r input[id='single_room']").attr("checked", true);

    loadRooms();
}


function loadRooms() {
    var roomType = $("#rooms_r input[name='room_type']:checked").val();
    var roomSize = $("#rooms_r input[name='room_size']:checked").val();

    /////load rooms from the database.............................................................................................................................
    roomList.length =0;
    roomList.push(new Room(34, 0, "Single", 12500, true, "Terrace with view of lagoon"));
    roomList.push(new Room(124, 1, "Double", 15700, true, "Bath in morning light"));
    roomList.push(new Room(67, 3, "Single", 12500, true, "Sight of lagoon"));
    roomList.push(new Room(01, 2, "Double", 17500, true, "Sight of lagoon and temple"));
    roomList.push(new Room(38, 2, "Double", 13500, false, "Terrace with view of lagoon"));
    roomList.push(new Room(83, 2, "single", 10500, true, "Bath in morning light"));
    roomList.push(new Room(185, 0, "Double", 12500, false, "Terrace with view of lagoon"));
    roomList.push(new Room(19, 1, "Single", 12500, true, "Cool breeze flows through the room"));
    roomList.push(new Room(72, 3, "Single", 10500, false, "Nearest to the elevator"));

    var roomListDiv = $("#rooms_r #room_list");
    roomListDiv.empty();
    for(var i=0; i<roomList.length; i++) {

        var room = roomList[i];
        var AC = "AC";
        if(room.AC == false) {
            AC = "None AC";
        }
        var floor = "Ground floor";
        if(room.floor != 0){
            floor = "Floor "+"#"+room.floor;
        }
        roomListDiv.append("<div class='room'><h3># "+room.number+"</h3>" +
            "<p>"+AC+", "+room.size+" bed, "+floor+", "+room.description+", Rs. "+room.prize+"/day</p></div>");
    }

}


$("#rooms_r .back_btn").click(function() {
    $("#rooms_r").hide();
    $("#reception_menu").show();
});


