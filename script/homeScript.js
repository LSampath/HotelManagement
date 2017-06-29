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
    var today = new Date();
    var year = today.getFullYear();
    var month =  ("0" + (today.getMonth()+1)).slice(-2);
    var date = ("0" + today.getDate()).slice(-2);
    var todayString = ( year+"-"+month+"-"+date);
    $("#new_reserve_r input[type='date']").val(todayString);

    $("#new_reserve_r input[id='any_type']").attr("checked",true);
    $("#new_reserve_r input[id='single_size']").attr("checked",true);

    $("#new_reserve_r input[name='check_in']").attr("min",todayString);
    validateDates();
    loadAvailableRooms();
}


///////////////////////New Reservation sub menu////////////////////////


var availableRooms = new Array();


function Room(number, floor, size, prize, AC, description) {
    this.number = number;
    this.floor = floor;
    this.size = size;
    this.prize = prize;
    this.AC = AC;
    this.description = description;
}


function Reservation(room, check_in, check_out) {
    this.room = room;
    this.check_in = check_in;
    this.check_out = check_out;
    this.days = 0;
}


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
    var check_in = new Date($("#new_reserve_r input[name='check_in']").val());
    var year = check_in.getFullYear();
    var month = ("0" + (check_in.getMonth()+1)).slice(-2);
    var date = ("0" + check_in.getDate()).slice(-2);
    var checkInString = ( year+"-"+month+"-"+date);

    $("#new_reserve_r input[name='check_out']").attr("min", checkInString);

    var check_out = new Date($("#new_reserve_r input[name='check_out']").val());
    if(check_in.getTime() >= check_out.getTime()){
        $("#new_reserve_r input[name='check_out']").val(checkInString);
    }
}


function loadAvailableRooms() {
    $("#new_reserve_r table").empty();
    availableRooms.length = 0;

    var check_in = new Date($("#new_reserve_r #check_in").val());
    var check_out = new Date($("#new_reserve_r #check_out").val());
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
        var check_in = new Date($("#new_reserve_r #check_in").val());
        var check_out = new Date($("#new_reserve_r #check_out").val());
        var reservation = new Reservation(selectedRoom, check_in, check_out);

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


var currentReserve = new Reservation(new Room(),undefined,undefined);


function initReserveRoom(reservation) {
    currentReserve = reservation;
    var room = reservation.room;var AC ="None AC";
    if(room.AC) {
        AC = "AC";
    }

    var year = reservation.check_in.getFullYear();
    var month = ("0" + (reservation.check_in.getMonth()+1)).slice(-2);
    var date = ("0" + reservation.check_in.getDate()).slice(-2);
    var checkInString = ( year+"-"+month+"-"+date);

    year = reservation.check_out.getFullYear();
    month = ("0" + (reservation.check_out.getMonth()+1)).slice(-2);
    date = ("0" + reservation.check_out.getDate()).slice(-2);
    var checkOutString = ( year+"-"+month+"-"+date);

    var ms1 = Date.UTC(reservation.check_in.getFullYear(),reservation.check_in.getMonth(),reservation.check_in.getDate());
    var ms2 = Date.UTC(reservation.check_out.getFullYear(),reservation.check_out.getMonth(),reservation.check_out.getDate());
    var days = Math.floor(ms2-ms1)/(1000*3600*24)+1;
    reservation.days = days;

    $("#reserve_detail").empty();
    $("#reserve_detail").append("<h2># "+currentReserve.room.number+"</h2>")
    $("#reserve_detail").append("<p>"+room.description+", #"+room.floor+" floor, "+room.size+", "+AC+"</p>");
    $("#reserve_detail").append("<p>Rental = Rs. "+room.prize+"/day <p/>")
    $("#reserve_detail").append("<p>Check-in : "+checkInString+" & Check-out : "+checkOutString+" ( "+days+" days )<p/>");

    $("#reserve_room_r input[id='stay_only_type']").attr("checked",true);
    $("#reserve_room_r input[id='none_veg']").attr("checked",true);

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
    //change these values according to the database query

    $("#meal_fee_div").empty();
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Room rental  </span>" +
    "Rs. "+(currentReserve.days*currentReserve.room.prize)+" ( "+currentReserve.room.prize+" x "+currentReserve.days+" )</p>");
    $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Meal fee </span>" +
        "Rs. "+(mealFee*currentReserve.days)+" ( "+mealFee+" x "+currentReserve.days+" )</p>")
    $("#meal_fee_div").append("<p><b><span style='display: inline-block; width: 120px;'>Total value </span>" +
        "Rs. "+((currentReserve.days*currentReserve.room.prize)+(mealFee*currentReserve.days))+"</b></p>");
}

$("#reserve_room_r input[name='meal_type']").change(calculateFee);


$("#reserve_room_r input[name='meal_pre']").change(calculateFee);


$("#reserve_room_r input[name='FIT/GRC']").change(function() {
    var method = $("#reserve_room_r input[name='FIT/GRC']:checked").attr('id');

    if(method == "GRC_check") {
        $("#reserve_room_r #reserve_btn").text("Reserve This Room");
        $("#reserve_room_r #reserve_btn").unbind('click');
        $("#reserve_room_r #reserve_btn").click(reserveRoom);
    }else {
        $("#reserve_room_r #reserve_btn").text("Check-In To Room");
        $("#reserve_room_r #reserve_btn").unbind('click');
        $("#reserve_room_r #reserve_btn").click(checkInRoom);
    }
});


function reserveRoom() {
    validateCustomerDetail();
    //reserve this room using dbms and currentReserve object.........................................................................

    // var receptionMenu = $("#reception_menu");
    // $("#reserve_room_r").hide();
    // receptionMenu.show();
    alert("reservation will be saved as GRC");
}

function checkInRoom() {
    validateCustomerDetail();
    //reserve this room using dbms and currentReserve object.................................................................................

    // var receptionMenu = $("#reception_menu");
    // $("#reserve_room_r").hide();
    // receptionMenu.show();
    alert("reservation will be saved as a FIT")
}

function validateCustomerDetail() {
    var valid = true;
    if($("#reserve_room_r input[id='customer_name']").val()) {
        alert($("#reserve_room_r input[id='customer_name']").val());
        $("#reserve_room_r label[for='customer_name']").css("color", "red");
        valid = false;
    }
    alert(valid);
}