/**
 * Created by Lahiru on 7/14/2017.
 */

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

    roomList.length =0;

    var preStatement = "?q=getrooms&size="+roomSize+"&type="+roomType;
    connectDB("admin.php", preStatement, function(result) {

        var roomListDiv = $("#rooms_r #room_list");
        roomListDiv.empty();

        if (result == '[]') {
            roomListDiv.append("<div  class='room'><h3>Add New Room</h3></div>");
            $(".room").click(function() {
                $("#rooms_r").hide();
                $("#manage_rooms_r").show();
                if( $(this).children("h3").text() == "Add New Room" ) {
                    initManageRoom(undefined);
                }
                initManageRoom(roomList[$(this).index()]);
            });
            return;
        }

        var rows = [];
        rows = result.match(/[^{\}]+(?=})/g);

        for (var i = 0; i < rows.length; i++) {
            var data = rows[i].match(/:"[\w. ,\d]+"/gi);
            for(var j=0; j<data.length; j++) {
                data[j] = data[j].substring(2, data[j].length - 1)
            }
            roomList.push(new Room(data[0], data[1], data[2], data[3], data[4], data[5]));
        }

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
        roomListDiv.append("<div  class='room'><h3>Add New Room</h3></div>");

        $(".room").click(function() {
            $("#rooms_r").hide();
            $("#manage_rooms_r").show();
            if( $(this).children("h3").text() == "Add New Room" ) {
                initManageRoom(undefined);
            }
            initManageRoom(roomList[$(this).index()]);
        });
    });
}


$("#rooms_r input[type='radio']").change(loadRooms);


$("#rooms_r .back_btn").click(function() {
    $("#rooms_r").hide();
    $("#reception_menu").show();
});


////////////////////////////////////////////////////manage rooms////////////////////////////////////////////////////////

function initManageRoom(room) {

    if(room == undefined) {

        $("#NONE_AC").attr("checked", true);
        $("#room_no").text("New Room");
        $("#ROOMNO").val(0);
        $("#FLOOR").val(0);
        $("#DESCRIPTION").val("");
        $("#SIZE option[value='Single']").attr("selected", true);
        $("#PRIZE").val(0);

        $("#manage_rooms_r .save_btn").text("Save Room")
        $("#manage_rooms_r .remove_btn").hide();
        $("#manage_rooms_r .save_btn").click(function() {

            var preStatement = "?q=roomexist&roomno=" + $("#ROOMNO").val();
            connectDB("admin.php", preStatement, function (result) {

                if (result == '[]') {
                    $("#manage_rooms_r input").prop("disabled", false);
                    $("#manage_rooms_r select").prop("disabled", false);

                    var valid = false;
                    if(numberValidate( $("#ROOMNO"), 100, "room number")){
                        if(numberValidate( $("#FLOOR"), 10, "floor number")){
                            if(numberValidate( $("#PRIZE"), 1000000, "room prize")){
                                if(descriptionValidation($("#DESCRIPTION"), 100, false)){
                                    valid = true;
                                }
                            }
                        }
                    }

                    if(valid) {
                        var roomno = $("#ROOMNO").val();
                        var floor = $("#FLOOR").val();
                        var prize = $("#PRIZE").val();
                        var AC = $("#manage_rooms_r input[name='AC']:checked").attr('id');
                        if(AC == "AC") {
                            AC = 1;
                        }else {
                            AC = 0;
                        }
                        var description = $("#DESCRIPTION").val();
                        var size = $("#SIZE option:selected").val();
                        /////////////////////////////////////////validate.................................................................

                        var preStatement = "?q=addroom&roomno="+roomno+"&floor="+floor+"&size="+size+"&prize="
                            +prize+"&AC="+AC+"&description="+description;
                        connectDB("admin.php", preStatement, function(result) {
                            console.log(result);
                            $("#manage_rooms_r").hide();
                            $("#rooms_r").show();
                            initRooms();
                        });
                    }

                }else {
                    alert("Room No already exits.")
                }
            });
        });

    }else {

        $("#ROOMNO").val(room.number);
        $("#FLOOR").val(room.floor);
        $("#DESCRIPTION").val(room.description);
        $("#SIZE option[value='"+room.size+"']").attr("selected", true);
        $("#PRIZE").val(room.prize);
        if(room.AC == 1) {
            $("#AC").attr("checked", true);
        }else {
            $("#NONE_AC").attr("checked", true);
        }
        $("#room_no").text("# "+room.number);

        var preStatement = "?q=editableroom&roomno="+room.number;
        connectDB("admin.php", preStatement, function(result) {

            if(result == '[]') {
                $("#manage_rooms_r input").prop("disabled", false);
                $("#manage_rooms_r select").prop("disabled", false);
                $("#manage_rooms_r .remove_btn").show();

                $("#manage_rooms_r .save_btn").click(function() {

                    var valid = false;
                    if(numberValidate( $("#ROOMNO"), 100, "room number")){
                        if(numberValidate( $("#FLOOR"), 10, "floor number")){
                            if(numberValidate( $("#PRIZE"), 1000000, "room prize")){
                                if(descriptionValidation($("#DESCRIPTION"), 100, false)){
                                    valid = true;
                                }
                            }
                        }
                    }
                    if(valid) {
                        var roomno = $("#ROOMNO").val();
                        var floor = $("#FLOOR").val();
                        var prize = $("#PRIZE").val();
                        var AC = $("#manage_rooms_r input[name='AC']:checked").attr('id');
                        if(AC == "AC") {
                            AC = 1;
                        }else {
                            AC = 0;
                        }
                        var description = $("#DESCRIPTION").val();
                        var size = $("#SIZE option:selected").val();

                        var preStatement = "?q=updateroom&oldno="+room.number+"&roomno="+roomno+"&floor="+floor+"&size="+size+"&prize="
                            +prize+"&AC="+AC+"&description="+description;
                        connectDB("admin.php", preStatement, function(result) {
                            $("#manage_rooms_r").hide();
                            $("#rooms_r").show();
                            initRooms();
                        });
                    }
                });

                $("#manage_rooms_r .remove_btn").click(function(){
                    var preStatement = "?q=removeroom&roomno="+room.number;
                    connectDB("admin.php", preStatement, function(result) {
                        console.log(result);
                        $("#manage_rooms_r").hide();
                        $("#rooms_r").show();
                        initRooms();
                    });
                });

            }else {
                $("#manage_rooms_r input").prop("disabled", true);
                $("#manage_rooms_r select").prop("disabled", true);
                $("#manage_rooms_r .remove_btn").hide();

                $("#manage_rooms_r .save_btn").click(function() {
                    $("#manage_rooms_r").hide();
                    $("#rooms_r").show();
                    initRooms();
                });
            }
        });
    }
}


$("#manage_rooms_r .back_btn").click(function() {
    $("#manage_rooms_r").hide();
    $("#rooms_r").show();
    initRooms();
});

////////////////////////////////////////////users///////////////////////////////////////////////////////////////////////


function initUsers() {

    var preStatement = "?q=getuser&name="+name;
    connectDB("admin.php", preStatement, function(result) {
        if( result == "[]") return;

        var data = result.match(/:"[\w. ,\d]+"/gi);
        for(var i=0; i<data.length; i++) {
            data[i] = data[i].substring(2,data[i].length-1);
        }
        var currentUser =new User(data[0],data[1],data[2],data[3],data[4]);

        var userList = new Array();
        $("#user_list").empty();

        $("#user_list").append("<p>Your profile,</p>")
        $("#user_list").append("<div class='user' id='profile'><h3>"+currentUser.name+"</h3>" +
            "<p>"+currentUser.fullName+"</p></div>" +
            "<p>Users,</p>");

        var preStatement = "?q=getusers&name="+currentUser.name;
        connectDB("admin.php", preStatement, function(result) {
            if( result == "[]") return;

            var rows = [];
            rows = result.match(/[^{\}]+(?=})/g);

            for (var i = 0; i < rows.length; i++) {
                var data = rows[i].match(/:"[\w. ,\d]+"/gi);
                for(var j=0; j<data.length; j++) {
                    data[j] = data[j].substring(2, data[j].length - 1)
                }
                userList.push(new User(data[0], data[1], data[2], data[3], data[4]));
            }

            for (var i=0; i<userList.length; i++) {
                var user = userList[i];
                $("#user_list").append("<div class='user exist'><h3>"+user.name+"</h3>" +
                    "<p>"+user.fullName+"</p></div>");
            }

            $("#user_list").append("<div class='user' id='new_user'><h3>New User</h3></div>");

            $(".exist").click(function() {
                console.log("user exist");
                loadUserDetails(userList[$(this).index()-3], false);
            });
            $("#profile").click(function() {
                console.log("my profile");
                loadUserDetails(currentUser, true);
            });
            $("#new_user").click(function() {
                console.log("add new user");
                loadUserDetails(undefined, false)
            });
        });
    });


}


$("#users_r .back_btn").click(function() {
    $("#users_r").hide();
    $("#reception_menu").show();
});


function loadUserDetails(user, editable) {

    $("#users_r").hide();
    $("#manage_users_r").show();

    if(user != undefined) {
        $("#manage_users_r .remove_btn").show();
        console.log("my profile or existing user");
        $("#NAME").val(user.name);
        $("#PASSWORD").val(user.password);
        $("#FULLNAME").val(user.fullName);
        $("#EMPID").val(user.empID);
        $("#POSITION option[value='"+user.position+"']").attr("selected", true);
        $("#user_name").text(user.name);

        if(editable) {
            console.log("my profile");
            $("#NAME").prop("disabled",false);
            $("#PASSWORD").prop("disabled",false);
            $("#FULLNAME").prop("disabled",false);
            $("#EMPID").prop("disabled",false);
            $("#POSITION").prop("disabled",false);

            $("#manage_users_r .save_btn").text("Update & Exit");
            $("#manage_users_r .save_btn").click(function() {

                var valid = false;
                if(nameValidation($("#NAME"), 30, true)){
                    if(passwordValidate($("#PASSWORD"), 30, true)) {
                        if(fullNameValidation($("#FULLNAME"), 80, false)) {
                            if(empIDValidation($("#EMPID"), 10, true)) {
                                valid = true;
                            }
                        }
                    }
                }
                if(valid) {
                    var name = $("#NAME").val();
                    var password = $("#PASSWORD").val();
                    var fullName = $("#FULLNAME").val();
                    var empID = $("#EMPID").val();
                    var position = $("#POSITION option:selected").val();
                    var oldName = $("#user_name").text();

                    var preStatement = "?q=updateuser&oldname="+oldName+"&name="+name+"&password="+password
                        +"&fullname="+fullName+"&empid="+empID+"&position="+position;
                    connectDB("admin.php", preStatement, function(result) {
                        console.log(result);
                        $("#manage_users_r").hide();
                        $("#users_r").show();
                        initUsers();
                    });
                }
            });

        }else {
            $("#NAME").prop("disabled",true);
            $("#PASSWORD").prop("disabled",true);
            $("#FULLNAME").prop("disabled",true);
            $("#EMPID").prop("disabled",true);
            $("#POSITION").prop("disabled",true);

            $("#manage_users_r .save_btn").text("Exit");
            $("#manage_users_r .save_btn").click(function(){
                $("#manage_users_r").hide();
                $("#users_r").show();
                initUsers();
            });

            $("#manage_users_r .remove_btn").click(function(){
                var preStatement = "?q=removeuser&name="+$("#NAME").val();
                connectDB("admin.php", preStatement, function(result) {
                    console.log(result);
                    $("#manage_users_r").hide();
                    $("#users_r").show();
                    initUsers();
                });
            });
        }

    }else {
        console.log("new user");
        $("#manage_users_r .remove_btn").hide();

        $("#NAME").prop("disabled",false);
        $("#PASSWORD").prop("disabled",false);
        $("#FULLNAME").prop("disabled",false);
        $("#EMPID").prop("disabled",false);
        $("#POSITION").prop("disabled",false);

        $("#NAME").val("");
        $("#PASSWORD").val("");
        $("#FULLNAME").val("");
        $("#EMPID").val("");
        $("#POSITION option[value='reception']").attr("selected", true);
        $("#user_name").text("New User");

        $("#manage_users_r .save_btn").text("Save & Exit");
        $("#manage_users_r .save_btn").click(function() {
            var preStatement = "?q=getuser&name="+$("#NAME").val();
            connectDB("admin.php", preStatement, function(result) {

                var valid = false;
                if(nameValidation($("#NAME"), 30, true)){
                    if(passwordValidate($("#PASSWORD"), 30, true)) {
                        if(fullNameValidation($("#FULLNAME"), 80, false)) {
                            if(empIDValidation($("EMPID"), 10, true)) {
                                valid = true;
                            }
                        }
                    }
                }
                if(valid) {
                    var name = $("#NAME").val();
                    var password = $("#PASSWORD").val();
                    var fullName = $("#FULLNAME").val();
                    var empID = $("#EMPID").val();
                    var position = $("#POSITION option:selected").val();

                    if(result == '[]') {
                        var preStatement = "?q=adduser&name="+name+"&password="+password+"&fullname="+fullName+"&position="+position+"&empid="+empID;
                        connectDB("admin.php", preStatement, function(result) {
                            $("#manage_users_r").hide();
                            $("#users_r").show();
                            initUsers();
                        });
                    }else {
                        alert("User name is already taken.");
                    }
                }
            });
        });
    }
}


$("#manage_users_r .back_btn").click(function () {
    $("#manage_users_r").hide();
    $("#users_r").show();
    initUsers();
});

