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
        if(result == '[]') {
            alert("Wrong authentication");
        }else {

            var data = result.match(/:"[\w\d]+"/gi);
            var name = data[0].substring(2,data[0].length-1);
            var position = data[1].substring(2,data[1].length-1);

            loadHomePage(name, position);
        }
    });
});


function loadHomePage(name, position) {
    window.location = "http://localhost/HotelManagement/view/home.html?name="+name+"?position="+position;
}








