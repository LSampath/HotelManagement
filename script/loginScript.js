/**
 * Created by Lahiru on 6/23/2017.
 */
$(document).ready(function(){
    //fuck off
});

$("#submit_btn").click(function(){
    var name = document.getElementById("login_name").value;
    var pass = document.getElementById("login_pass").value;
    alert(name+pass);
    window.location.href = "../view/home.html";
})