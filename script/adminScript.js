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

        if (result == '[]') return;

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

            $(".room").click(function() {
                $("#rooms_r").hide();
                $("#manage_rooms_r").show();
                initManageRoom(roomList[$(this).index()]);
            });
        }
    });

}


$("#rooms_r input[type='radio']").change(loadRooms);


$("#rooms_r .back_btn").click(function() {
    $("#rooms_r").hide();
    $("#reception_menu").show();
});



////////////////////////////////////////////////////manage rooms////////////////////////////////////////////////////////

function initManageRoom(room) {

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

            $("#save_btn").click(function() {

                var preStatement = "?q=updateroom&roomno="+room.number;
                connectDB("admin.php", preStatement, function(result) {

            });

        }else {
            $("#manage_rooms_r input").prop("disabled", true);
            $("#manage_rooms_r select").prop("disabled", true);

            $("#save_btn").click(function() {
                $("#manage_rooms_r").hide();
                $("#rooms_r").show();
                initRooms();
            });
        }
    });
}


$("#back_btn").click(function() {
    $("#manage_rooms_r").hide();
    $("#rooms_r").show();
    initRooms();
});





