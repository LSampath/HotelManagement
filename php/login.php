<?php
/**
 * Created by PhpStorm.
 * User: Lahiru
 * Date: 7/6/2017
 * Time: 7:30 PM
 */

require('connection.php');

$q= $_GET["q"];
if($q == 'login') {

    $name = $_GET["name"];
    $pass = $_GET["pass"];

    $query = "select name, position from user where name='".$name."' and password='".$pass."'";


}else if($q = 'getuser') {
    $name = $_GET["name"];
    $pass = $_GET["pass"];

    $query = "select * from users where name='".$name."' and password='".$pass."'";
}

if ($query_run = @mysqli_query($connection, $query)) {

    $result = array();
    while ($row = mysqli_fetch_assoc($query_run)) {
        $result[] = $row;
    }
    echo json_encode($result);

}else {
    echo "connection error";
}


