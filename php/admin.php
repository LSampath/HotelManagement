<?php
/**
 * Created by PhpStorm.
 * User: Lahiru
 * Date: 7/15/2017
 * Time: 11:05 AM
 */

require('connection.php');

$q= $_GET["q"];

if($q == "getrooms") {

    $type = $_GET["type"];
    $size = $_GET["size"];

    if($type == "any") {
        $query = "select roomno, floor, size, prize, AC, description from room where size='".$size."'";
    }else {
        $query = "select roomno, floor, size, prize, AC, description from room where size='".$size."' and AC=".$type;
    }


}else if($q == "editableroom") {

    $roomNo = $_GET['roomno'];
    $query = "select roomno from reservation where roomno='".$roomNo."'";


}else if($q == "roomexist") {

    $roomNo = $_GET['roomno'];
    $query = "select roomno from room where roomno='" . $roomNo . "'";


}else if($q == "addroom") {

    $roomno = $_GET['roomno'];
    $floor = $_GET['floor'];
    $size = $_GET['size'];
    $prize =$_GET['prize'];
    $AC =$_GET['AC'];
    $description =$_GET['description'];

    $query = "insert into room values(".$roomno.", ".$floor.", '".$size."', ".$prize.", ".$AC.", '".$description."', 'available');";


}else if($q == 'updateroom') {

    $oldno = $_GET['oldno'];
    $roomno = $_GET['roomno'];
    $floor = $_GET['floor'];
    $size = $_GET['size'];
    $prize =$_GET['prize'];
    $AC =$_GET['AC'];
    $description =$_GET['description'];

    $query = "update room set roomno='".$roomno."', floor='".$floor."', prize='".$prize."', size='".$size."', AC='".$AC."', 
    description='".$description."' where roomno='".$oldno."'";


}else if($q == "getusers") {

    $name = $_GET['name'];
    $query = "select * from user where NOT ( name='".$name."')";


}else if($q == 'getuser') {

    $name = $_GET['name'];
    $query = "select * from user where name='".$name."'";


}else if($q == 'adduser') {

    $name = $_GET['name'];
    $password = $_GET['password'];
    $fullname = $_GET['fullname'];
    $position = $_GET['position'];
    $empid = $_GET['empid'];

    $query = "insert into user values('".$name."', '".$password."', '".$fullname."', '".$position."', '".$empid."')";


}else if($q == 'updateuser') {

    $name = $_GET['name'];
    $password = $_GET['password'];
    $fullname = $_GET['fullname'];
    $position = $_GET['position'];
    $empid = $_GET['empid'];
    $oldname = $_GET['oldname'];
    echo $fullname;

    $query = "update user set name='".$name."', password='".$password."', fullname='".$fullname."', ".
        "position='".$position."', empid='".$empid."' where name='".$oldname."'";
    echo $query;


}else if($q == "removeroom") {

    $roomno = $_GET['roomno'];
    $query = "delete from room where roomno='".$roomno."'";


}else if($q == "removeuser") {

    $name = $_GET['name'];
    $query = "delete from user where name='".$name."'";


}



if ($query_run = @mysqli_query($connection, $query)) {
    $result = array();
    while ($row = mysqli_fetch_assoc($query_run)) {
        $result[] = $row;
    }
    echo json_encode($result);
} else {
    echo "connection error";
}

