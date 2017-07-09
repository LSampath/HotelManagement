/**
 * Created by Lahiru on 6/23/2017.
 */
$("#submit_btn").click(function(){
    var name = $("#login_name").val();
    var pass = $("#login_pass").val();

    if(name == "") {
        alert("Provide name");
        return;
    }
    if(pass == "") {
        alert("Provide password");
        return;
    }

    var preStatement = "?q=login&name="+name+"&pass="+pass;

    connectDB("login.php", preStatement, function(result) {
        if(result.charAt(result.length-4) == 1) {

            var preStatement = "?q=getuser&name="+name+"&pass="+pass;
            var file = "login.php";
            loadHomePage(name);

            // connectDB(file, preStatement, function(result) {
            //     var data = result.match(/:"[\w\d]+"/gi);
            //     for(var i=0; i<data.length; i++) {
            //         data[i] = data[i].substring(2,data[i].length-1);
            //     }
            //
            //     var user = new User(data[0],data[1],data[2]);
            //     loadHomePage(user);
            // });
        }
    });

});


function loadHomePage(name) {
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open("GET", "http://localhost/HotelManagement/view/home.html", false);
    // xmlhttp.send();
    // document.getElementsByTagName("container_div").innerHTML = xmlhttp.responseText;
    window.location = "http://localhost/HotelManagement/view/home.html?name="+name;
}








