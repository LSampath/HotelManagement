/**
 * Created by Lahiru on 7/3/2017.
 */
$("#make_reservation h2").click(function() {
    initReservations(undefined);

    $("#container").hide();
    $("#reservation").show();
});

var currentReserve = new Reservation();

function initReservations(reservation) {
    currentReserve = reservation;
    if(reservation != undefined) {
        var checkIn = reservation.checkIn;
        var checkOut = reservation.checkOut;
    }else {
        checkIn = dateToString(new Date());
        checkOut = dateToString(new Date());
    }
    $("#any_type").attr("checked", true);
    $("#single_size").attr("checked", true);
    $("#check_in").val(checkIn);
    $("#check_out").val(checkOut);

    loadAvailableRooms();
}


var availableRooms = new Array();

function loadAvailableRooms() {
    availableRooms.length = 0;
    $("#available_rooms").empty();

    var checkIn = dateToString(new Date($("#reservation #check_in").val()));
    var checkOut =dateToString(new Date($("#reservation #check_out").val()));

    var AC = undefined;
    var type = $("#reservation input[name='room_type']:checked").attr("id");
    if(type == "AC_type") {
        AC = true;
    }else if(type == "NONE_AC_type") {
        AC = false;
    }
    var size = $("#reservation input[name='room_size']:checked").attr("id");
    if(size == "single_size") {
        size = "Single";
    }else {
        size = "Double";
    }

    //get available rooms from database/////..........................................................................................................
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
        $("#available_rooms").append("<div class='room'><h3># "+num+"</h3><p> "+details+" </p></div>");
    }

    $("#available_rooms .room").click(function() {
        var selectedRoom = availableRooms[($(this).index())];

        var checkInString = $("#reservation #check_in").val();
        var checkOutString = $("#reservation #check_out").val();
        var checkIn = stringToDate(checkInString);
        var checkOut = stringToDate(checkOutString);

        var ms1 = Date.UTC(checkIn.getFullYear(),checkIn.getMonth(),checkIn.getDate());
        var ms2 = Date.UTC(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
        var days = Math.floor(ms2-ms1)/(1000*3600*24)+1;

        var totalPrize = selectedRoom.prize*days;

        currentReserve = new Reservation("R0000",selectedRoom.number,checkInString,checkOutString,days,totalPrize,0,"C0000","Reserved", "M0000");

        initReserveDetails(currentReserve);

        $("#reservation").hide();
        $("#reserve_detail").show();
    });
}


$("#reservation .back_btn").click(function() {
     $("#reservation").hide();
     $("#container").show();
});


$("#reservation input").click(loadAvailableRooms);



///////////////////////////////////////////////////////////////////reserve details///////////////////////////////////////

var room = new Room();
var meal = new Meal();

function initReserveDetails(reservation) {
    currentReserve = reservation;
    room = getRoom(reservation.roomNo);

    $("#room_detail #room_in").text("# "+reservation.roomNo);

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
    $("#room_detail p").text(details);

    $("#room_detail input[name='check_in']").val(reservation.checkIn);
    $("#room_detail input[name='check_out']").val(reservation.checkOut);

    $("#reserve_detail #stay_only_type").attr("checked", true);
    $("#reserve_detail #none_veg").attr("checked", true);

    $("#reserve_detail input[type='text']").val("");

    calculateFee();
}


function calculateFee() {
    var mealType = $("#reserve_detail input[name='meal_type']:checked").attr('id');
    var mealPre = $("#reserve_detail input[name='meal_pre']:checked").attr('id');
    meal.pre = mealPre;
    meal.typee = mealType;
    
    var checkIn = stringToDate( $("#reserve_detail input[name='check_in']").val());
    var checkOut = stringToDate($("#reserve_detail input[name='check_out']").val());

    var ms1 = Date.UTC(checkIn.getFullYear(),checkIn.getMonth(),checkIn.getDate());
    var ms2 = Date.UTC(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
    var days = Math.floor(ms2-ms1)/(1000*3600*24)+1;
    currentReserve.days = days;

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
    var roomFee = room.prize;
    var newTotal = (roomFee + mealFee)*currentReserve.days;
    var newBalance = newTotal - (currentReserve.totalFee - currentReserve.balance);

    currentReserve.totalFee = newTotal;
    currentReserve.balance = newBalance;

    $("#meal_fee_div").empty();
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Room rental  </span>" +
        "Rs. "+(currentReserve.days*room.prize)+" ( "+room.prize+" x "+currentReserve.days+" )</p>");
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Meal fee </span>" +
        "Rs. "+(mealFee*currentReserve.days)+" ( "+mealFee+" x "+currentReserve.days+" )</p>")
    $("#meal_fee_div").append("<p><b><span style='display: inline-block; width: 120px;'>Total value </span>" +
        "Rs. "+(currentReserve.totalFee)+"</b></p>");
}


$("#reserve_detail input").change(calculateFee,function(e){});
$("#room_detail input").change(calculateFee,function(e){});


$("#customer_phone, #customer_ID, #customer_VISA").keypress(function(event) {
    var char = event.keyCode;
    if(char < 48 || char > 57) {
        return false;
    }
});


$("#customer_name").keypress(function(event) {
    var char = event.keyCode;
    if(char >= 48 && char <= 57) {
        return false;
    }
});


function validateCustomerDetail() {
    var valid = true;
    if($("#reserve_detail input[id='customer_name']").val().length == 0) {
        $("#reserve_detail label[for='customer_name']").css("color", "red");
        alert("Provide Customer Name");
        valid = false;
    }
    if( ($("#reserve_detail input[id='customer_ID']").val().length == 0) || ($("#reserve_detail input[id='customer_ID']").val().length == 0) ) {
        $("#reserve_detail label[for='customer_ID']").css("color", "red");
        $("#reserve_detail label[for='customer_VISA']").css("color", "red");
        alert("Provide customer ID or VISA");
        valid = false;
    }
    if($("#reserve_detail input[id='customer_phone']").val().length == 0) {
        $("#reserve_detail label[for='customer_phone']").css("color", "red");
        alert("Provide Customer telephone number");
        valid = false;
    }
    return valid;
}


$("#reserve_detail #reserve_btn").click(function() {
    if(validateCustomerDetail()) {
        meal.mealID = "M0000";

        var name = $("#reserve_detail input[id='customer_name']").val();
        var ID = $("#reserve_detail input[id='customer_ID']").val();
        var VISA = $("#reserve_detail input[id='customer_VISA']").val();
        var telephone = $("#reserve_detail input[id='customer_phone']").val();
        var address = $("#reserve_detail input[id='customer_add']").val();

        var customer = new Customer("C0000", name, ID, VISA, telephone, address);

        //save reservation, customer, meal in database /////////////////////////////////////////////////////////////////

        $("#reserve_detail").hide();
        $("#container").show();
    }
});


$("#reserve_detail .back_btn").click(function() {
   initReservations(currentReserve);

   $("#reserve_detail").hide();
   $("#reservation").show();
});
