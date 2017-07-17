/**
 * Created by Lahiru on 6/24/2017.
 */
window.onload = function() {
}

////////////////////////Receptions Menu/////////////////////////
$("#new_reserve_m").click( function(){
    initNewReservation();

    var newResDiv = $("#new_reserve_r");
    $(this).parent("#reception_menu").hide();
    newResDiv.show();
});


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



$("#new_reserve_r input[type='radio'], #new_reserve_r #check_out").change( loadAvailableRooms );


$("#new_reserve_r #check_in").change( function() {
    validateDates();
    loadAvailableRooms();
});


$("#new_reserve_r .back_btn").click(function(){
    var receptionMenu = $("#reception_menu");
    $("#new_reserve_r").hide();
    receptionMenu.show();
});


function initNewReservation() {
    var today = dateToString(new Date());

    $("#new_reserve_r input[id='check_in']").val(today);
    $("#new_reserve_r input[id='check_out']").val(today);

    $("#new_reserve_r input[id='any_type']").attr("checked",true);
    $("#new_reserve_r input[id='single_size']").attr("checked",true);

    validateDates();
    loadAvailableRooms();
}


function validateDates() {
    $("#new_reserve_r input[name='check_in']").attr("min",dateToString(new Date()));

    var checkIn = new Date($("input[name='check_in']").val());
    var checkOut = new Date();
    checkOut.setDate(checkIn.getDate()+1);

    var nextDayString = dateToString(checkOut);
    $("input[name='check_out']").attr("min", nextDayString);
    $("input[name='check_out']").val(nextDayString);

    if(checkIn.getTime() >= checkOut.getTime()){
        $("input[name='check_out']").val(nextDayString);
    }
}


function loadAvailableRooms() {

    $("#new_reserve_r table").empty();
    var availableRooms = new Array();

    var checkIn = dateToString(new Date($("#new_reserve_r #check_in").val()));
    var checkOut =dateToString(new Date($("#new_reserve_r #check_out").val()));

    var type = $("#new_reserve_r input[name='room_type']:checked").attr('id');
    if( type == "any_type" ) {
        type = "any";
    }else if( type == "AC_type" ) {
        type = "1";
    }else {
         type = "0";
    }
    var size = $("#new_reserve_r input[name='room_size']:checked").attr('id');
    if(size == "single_size") {
        size = "Single";
    }else {
        size = "Double";
    }

    var preStatement = "?q=getAvailableRooms&checkin="+checkIn+"&checkout="+checkOut+"&type="+type+"&size="+size;
    connectDB("reception.php", preStatement, function(result) {
        if(result == "[]") return;

        var rooms = [];
        rooms = result.match(/[^{\}]+(?=})/g);
        for(var i=1; i<rooms.length; i++) {
            var data =[];
            data = rooms[i].match(/:"[\w\d]+"/gi);
            for(var j=0; j<rooms[i].length; j++) {
                if(data[j]==undefined) {
                    data[j] = "";
                }else {
                    data[j] = data[j].substring(2,data[j].length-1);
                }
            }
            var room = new Room(data[0], data[1],data[2], data[3], data[4], data[5]);
            availableRooms.push(room);
        }

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
            var selectedRoom = availableRooms[($(this).parent("tr").index()) / 2];
            var checkIn = dateToString(new Date($("#new_reserve_r #check_in").val()));
            var checkOut = dateToString(new Date($("#new_reserve_r #check_out").val()));

            var reservation = new Reservation("R0000", selectedRoom.number, checkIn, checkOut);

            initReserveRoom(reservation);

            var reserveRoom = $("#reserve_room_r");
            $("#new_reserve_r").hide();
            reserveRoom.show();
        });

    });
}


$("#reserve_room_r .back_btn").click(function(){
    var newReserve = $("#new_reserve_r");
    $("#reserve_room_r").hide();
    newReserve.show();
});



/////////////////////new reservation sub menu - reserve selected room////////////


var currentReserve = new Reservation("R0000", new Room().number,dateToString(new Date()),dateToString(new Date()));


function initReserveRoom(reservation) {
    currentReserve = reservation;

    if(currentReserve.roomNo == undefined) return;

    var preStatement = "?q=getroom&roomno="+reservation.roomNo;
    connectDB("reception.php", preStatement, function(result) {

        var data =[];
        data = result.match(/:"[\w \d]+"/gi);
        for(var i=0; i<data.length; i++) {
            if(data[i]==undefined) {
                data[i] = "";
            }else {
                data[i] = data[i].substring(2,data[i].length-1);
            }
        }

        var room = new Room(data[0], data[1], data[2], data[3], data[4], data[5]);

        var AC ="None AC";
        if(room.AC) {
            AC = "AC";
        }
        var floor = "Ground Floor";
        if(room.floor != 0 ) {
            floor = "Floor #"+room.floor;
        }

        $("#reserve_detail").empty();
        $("#reserve_detail").append("<p><b># "+room.number+"</b></p>");
        $("#reserve_detail").append("<p>"+AC+", "+floor+", "+room.size+", "+room.description+"</p>");
        $("#reserve_detail").append("<p>Rs. "+room.prize+" per day</p>");
        $("#reserve_detail").append("<p>Check In - "+reservation.checkIn+" , Check out - "+reservation.checkOut+"</p>");

    });


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

$("#reserve_room_r #customer_phone").keyup(function() {
    var text = $("#customer_phone").val();
    if(isNaN(text.charAt(text.length-1))) {
        $("#customer_phone").val(text.substr(0,text.length-1));
    }
});


function calculateFee() {

    if(currentReserve.roomNo == undefined) return;

    var preStatement = "?q=getfee";
    connectDB("reception.php", preStatement, function(result) {

        var fees = [];
        var mealType = $(".radio_group input[name='meal_type']:checked").attr('id');
        var mealPre = $(".radio_group input[name='meal_pre']:checked").attr('id');

        if(result == '[]') return;

        var rows = [];
        rows = result.match(/[^{\}]+(?=})/g);

        for(var i=0; i<rows.length; i++) {
            var data = rows[i].match(/:"[\w.\d]+"/gi);
            fees.push(data[1].substring(2,data[1].length-1));
        }

        var mealFee = 0;
        if(mealType == "Breakfast_type") {
            mealFee = fees[2];
        }else if(mealType == "HB_type") {
            mealFee = fees[1];
        }else if(mealType == "FB_type") {
            mealFee = fees[0];
        }
        if(mealPre == "none_veg") {
            mealFee *= fees[3];
        }

        var preStatement = "?q=getroom&roomno="+currentReserve.roomNo;
        connectDB("reception.php", preStatement, function(result) {

            var data =[];
            data = result.match(/:"[\w \d]+"/gi);
            for(var i=0; i<data.length; i++) {
                if(data[i]==undefined) {
                    data[i] = "";
                }else {
                    data[i] = data[i].substring(2,data[i].length-1);
                }
            }

            var room = new Room(data[0], data[1], data[2], data[3], data[4], data[5]);

            var days = 0;
            if(currentReserve.checkIn != undefined && currentReserve.checkOut != undefined) {
                var checkIn = stringToDate(currentReserve.checkIn);
                var checkOut = stringToDate(currentReserve.checkOut);

                var ms1 = Date.UTC(checkIn.getFullYear(),checkIn.getMonth(),checkIn.getDate());
                var ms2 = Date.UTC(checkOut.getFullYear(),checkOut.getMonth(),checkOut.getDate());
                days = Math.floor(ms2-ms1)/(1000*3600*24);
                currentReserve.days = days;
            }
            currentReserve.totalFee = (currentReserve.days*room.prize)+(mealFee*currentReserve.days);
            currentReserve.balance = currentReserve.totalFee;

            $("#meal_fee_div").empty();
            $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Room rental  </span>" +
                "Rs. "+(currentReserve.days*room.prize)+" ( "+room.prize+" x "+currentReserve.days+" )</p>");
            $("#meal_fee_div").append("<p><span style='display: inline-block; width: 120px;'>Meal fee </span>" +
                "Rs. "+(mealFee*currentReserve.days)+" ( "+mealFee+" x "+currentReserve.days+" )</p>")
            $("#meal_fee_div").append("<p><b><span style='display: inline-block; width: 120px;'>Total value </span>" +
                "Rs. "+(currentReserve.totalFee)+"</b></p>");

        });
    });
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
        $("#payment_reserve").append("<input type='text' id='payed_value' autocomplete='off'>");
        $("#payment_reserve").append("<br>");
        $("#payment_reserve").append("<label class='text_label'>Balance Rs.  </label>");
        $("#payment_reserve").append("<p style='display: inline-block' id='balance_value'><b>"+currentReserve.totalFee+"</b></p>");

        $("#payment_reserve #payed_value").keyup(function() {
            var text = $("#payed_value").val();
            if(isNaN(text.charAt(text.length-1))) {
                $("#payed_value").val(text.substr(0,text.length-1));
            }

            var payedValue = parseInt($("#payment_reserve #payed_value").val());
            if(payedValue<0 || payedValue>currentReserve.balance){

                $("#payment_reserve #payed_value").val("");
                currentReserve.balance = currentReserve.totalFee;
                $("#payment_reserve #balance_value").text(currentReserve.totalFee);
            }else{
                $("#payment_reserve #balance_value").text(currentReserve.totalFee - payedValue);
                currentReserve.balance = currentReserve.totalFee - payedValue;
            }
        });

        $("#reserve_room_r #reserve_btn").text("Check-In To Room");
        $("#reserve_room_r #reserve_btn").unbind('click');
        $("#reserve_room_r #reserve_btn").click(checkInRoom);
    }
});


function reserveRoom() {
    if(validateCustomerDetail()) {
        var name = $("#reserve_room_r input[id='customer_name']").val().slice(0,99).split(" ").join("+");
        var ID = $("#reserve_room_r input[id='customer_ID']").val().slice(0,10).split(" ").join("+");
        var VISA = $("#reserve_room_r input[id='customer_VISA']").val().slice(0,15).split(" ").join("+");
        var phone = $("#reserve_room_r input[id='customer_phone']").val().slice(0,10).split(", ").join("+");
        var address = $("#reserve_room_r input[id='customer_add']").val().slice(0,99).split(" ").join("+");

        var mealtype = $("#reserve_room_r input[name='meal_type']:checked").attr("id");
        var mealpre = $("#reserve_room_r input[name='meal_pre']:checked").attr("id");
        mealtype = mealtype.substr(0,mealtype.length-5);
        if(mealtype == "stay_only") {
            mealtype = "Stay_only";
        }
        if(mealpre == "none") {
            mealpre = 'none_veg';
        }

        var res = currentReserve;
        var preStatement = "?q=makereserve&roomno="+res.roomNo+"&checkIn="+res.checkIn+"&checkOut="+res.checkOut+"&days="
            +res.days+"&totalfee="+res.totalFee+"&balance="+res.balance+"&method=Reserved"
            +"&name="+name+"&ID="+ID+"&VISA="+VISA+"&phone="+phone+"&address="+address+
            "&mealtype="+mealtype+"&mealpre="+mealpre;
        connectDB("reception.php", preStatement, function(result) {
            console.log(result);//........................................................................................................................
            if(result != "connection error") {
                alert("reservation will be saved as a GRC");

                var receptionMenu = $("#reception_menu");
                $("#reserve_room_r").hide();
                receptionMenu.show();
            }
        });
    }
}


function checkInRoom() {
    if(validateCustomerDetail()) {
        var name = $("#reserve_room_r input[id='customer_name']").val().slice(0,99).split(" ").join("+");
        var ID = $("#reserve_room_r input[id='customer_ID']").val().slice(0,10).split(" ").join("+");
        var VISA = $("#reserve_room_r input[id='customer_VISA']").val().slice(0,15).split(" ").join("+");
        var phone = $("#reserve_room_r input[id='customer_phone']").val().slice(0,10).split(", ").join("+");
        var address = $("#reserve_room_r input[id='customer_add']").val().slice(0,99).split(" ").join("+");

        var mealtype = $("#reserve_room_r input[name='meal_type']:checked").attr("id");
        var mealpre = $("#reserve_room_r input[name='meal_pre']:checked").attr("id");
        if(mealtype == "stay_only") {
            mealtype = "Stay_only";
        }
        if(mealpre == "none") {
            mealpre = 'none_veg';
        }

        var res = currentReserve;
        var preStatement = "?q=makereserve&roomno="+res.roomNo+"&checkIn="+res.checkIn+"&checkOut="+res.checkOut+"&days="
            +res.days+"&totalfee="+res.totalFee+"&balance="+res.balance+"&method=CheckedIn"
            +"&name="+name+"&ID="+ID+"&VISA="+VISA+"&phone="+phone+"&address="+address+
            "&mealtype="+mealtype+"&mealpre="+mealpre;

        connectDB("reception.php", preStatement, function(result) {
            console.log(result);//........................................................................................................................
            if(result != "connection error") {
                alert("reservation will be saved as a FIT");
            }
            var receptionMenu = $("#reception_menu");
            $("#reserve_room_r").hide();
            receptionMenu.show();
        });


    }
}


function validateCustomerDetail() {
    var valid = true;
    if($("#reserve_room_r input[id='customer_name']").val().length == 0) {
        $("#reserve_room_r label[for='customer_name']").css("color", "red");
        alert("Provide Customer Name");
        valid = false;
    }
    console.log($("#reserve_room_r input[id='customer_ID']").val());
    console.log($("#reserve_room_r input[id='customer_VISA']").val());//....................handle errors..................................................
    if( ($("#reserve_room_r input[id='customer_ID']").val().length == 0) && ($("#reserve_room_r input[id='customer_VISA']").val().length == 0) ) {
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

    var reserved = $("#current_reserve_r #reserved").is(":checked");
    var checkedIn = $("#current_reserve_r #in_state").is(":checked");
    var checkedOut = $("#current_reserve_r #out_state").is(":checked");

    var preStatement = "?q=getreserves&reserved="+reserved+"&checkedIn="+checkedIn+"&checkedOut="+checkedOut;
    connectDB("reception.php", preStatement, function(result) {

        if(result == "[]") return;

        var reserves = [];
        reserves = result.match(/[^{\}]+(?=})/g);
        for(var i=0; i<reserves.length; i++) {
            var data = reserves[i].match(/:"[\w \-\d]+"/gi);
            for(var j=0; j<data.length; j++) {
                data[j] = data[j].substring(2, data[j].length - 1);
            }
            var reservation = new Reservation(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
            currReserves.push(reservation);

            var custName = data[9];

            var classs = "reserved_res";
            var statusString = "Reserved";
            if(reservation.status == "CheckedOut") {
                classs = "out_res";
                statusString = "Checked Out"
            }else if(reservation.status == "CheckedIn") {
                classs = "in_res";
                statusString = "Checked In";
            }

            reserveContainer.append("<div class='reservation "+classs+"'><p><b> # "+reservation.roomNo+"</b> by <b> "+custName+
                " </b></p><p>Check-In : "+reservation.checkIn+", Check-out : "+reservation.checkOut+"</p>" +
                "<p style='text-align: right; color: white;'> "+statusString+" </p><div/>");
        }

        $("#current_reserve_r .reservation").click(function() {
            initManageReservations(currReserves[$(this).index()]);

            var manageReserve = $("#manage_reserve_r");
            $("#current_reserve_r").hide();
            manageReserve.show();
        });
    });
}


$("#current_reserve_r input[type='checkbox']").change(loadCurrentReservations);


$("#current_reserve_r .back_btn").click(function() {
    var receptionMenu = $("#reception_menu");
    $("#current_reserve_r").hide();
    receptionMenu.show();
});



/////////////////////////////////////manage reservations////////////////////////////////////////////////////////////////

var currentCustomer = new Customer();
var currentMeal = new Meal();
var currentRoom = new Room();


function initManageReservations(reservation) {
    currentReserve = reservation;
    $("#manage_reserve_r h3").text("# "+reservation.roomNo);

    var preStatement = "?q=reservedetails&resid="+reservation.resID;
    connectDB("reception.php", preStatement, function(result) {

        if(result == '[]') return;
        var data =[];
        data = result.match(/:"[\w, \-\d]+"/gi);
        for(var i=0; i<result.length; i++) {
            if(data[i]!=undefined) {
                data[i] = data[i].substring(2,data[i].length-1);
            }
        }
        var customer = new Customer(data[0], data[1], data[2], data[3], data[4], data[5]);
        var room = new Room(data[6], data[7], data[8], data[9], data[10], data[11]);
        var meal = new Meal(data[19], data[20], data[21]);
        currentCustomer = customer;
        currentRoom = room;
        currentMeal = meal;

        var AC = "None AC";
        if(room.AC) {
            AC = "AC";
        }
        var floor = "Ground floor";
        if(room.floor != 0) {
            floor = "Floor #"+room.floor;
        }
        var descriptionDiv = $("#manage_reserve_r #room_des");
        descriptionDiv.empty();

        descriptionDiv.append("<p id='room_des'><span style='display: inline-block; width: 150px;'>Room Description </span>" +
            " "+AC+", "+room.size+" bed, "+room.description+", "+floor+"</p>");

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

        $("#manage_reserve_r #checkin").text("Check-In : "+reservation.checkIn);
        $("#manage_reserve_r #checkout").text("Check-Out : "+reservation.checkOut);

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

        if(currentReserve.status == "Reserved") {
            $("#cancel_reserve").show();
            $("#cancel_reserve").click(function() {

                var preStatement = "?q=cancelreserve&resid=" + currentReserve.resID + "&custid=" + currentReserve.customerID;
                connectDB("reception.php", preStatement, function (result) {});
            });
        }else {
            $("#cancel_reserve").hide();
        }
    });
}


$("#manage_reserve_r .back_btn").click(function() {
    initReservations();

    var currReserves = $("#current_reserve_r");
    $("#manage_reserve_r").hide();
    currReserves.show();
});


$("#manage_reserve_r input[name='meal_type']").change(changeMealFee);
$("#manage_reserve_r input[name='meal_pre']").change(changeMealFee);


function saveReservationChanges() {

    currentCustomer.name = $("#manage_reserve_r input[name='customer_name']").val();
    currentCustomer.NID = $("#manage_reserve_r input[name='customer_ID']").val();
    currentCustomer.VISA = $("#manage_reserve_r input[name='customer_VISA']").val();
    currentCustomer.address = $("#manage_reserve_r input[name='customer_add']").val();
    currentCustomer.telephone = $("#manage_reserve_r input[name='customer_telephone']").val();

    var preStatement = "?q=updatereserve&resid="+currentReserve.resID+"&totalfee="+currentReserve.totalFee+"&balance="+
            currentReserve.balance+"&status="+currentReserve.status+
            "&mealtype="+currentMeal.typee+"&mealpre="+currentMeal.pre+"&name="+currentCustomer.name+"&NID="+currentCustomer.NID+
            "&VISA="+currentCustomer.VISA+"&address="+currentCustomer.address+"&telephone="+currentCustomer.telephone+
            "&custid="+currentCustomer.custID;
    connectDB("reception.php", preStatement, function(result) {});

    initReservations();

    var currReserves = $("#current_reserve_r");
    $("#manage_reserve_r").hide();
    currReserves.show();
}


function nextReservationStatus() {
    var nextStatus = "CheckedIn";
    if(currentReserve.status == "CheckedIn" ) {
        if(currentReserve.balance != 0 ) {
            return;
        }else {
            nextStatus = "CheckedOut";
        }
    }
    currentReserve.status = nextStatus;
    saveReservationChanges();
}


function changeMealFee() {
    var preStatement = "?q=getfee";
    connectDB("reception.php", preStatement, function(result) {

        var fees = [];

        var mealType = $("#manage_reserve_r input[name='meal_type']:checked").attr('id');
        var mealPre = $("#manage_reserve_r input[name='meal_pre']:checked").attr('id');
        currentMeal.pre = mealPre;
        currentMeal.typee = mealType;

        if (result == '[]') return;

        var rows = [];
        rows = result.match(/[^{\}]+(?=})/g);

        for (var i = 0; i < rows.length; i++) {
            var data = rows[i].match(/:"[\w.\d]+"/gi);
            fees.push(parseFloat(data[1].substring(2, data[1].length - 1)));
        }

        var mealFee = 0;
        if (mealType == "Breakfast") {
            mealFee = fees[2];
        } else if (mealType == "HB") {
            mealFee = fees[1];
        } else if (mealType == "FB") {
            mealFee = fees[0];
        }
        if (mealPre == "none") {
            mealFee *= fees[3];
        }

        var roomFee = parseInt(currentRoom.prize);
        var newTotal = (roomFee + mealFee)*currentReserve.days;
        var newBalance = newTotal - (currentReserve.totalFee - currentReserve.balance);

        currentReserve.totalFee = parseInt(newTotal);
        currentReserve.balance = parseInt(newBalance);

        $("#manage_reserve_r #total_value").text(newTotal);
        $("#manage_reserve_r #payed_value").text(newTotal-newBalance);
        $("#manage_reserve_r #balance_value").text(newBalance);
    });
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

