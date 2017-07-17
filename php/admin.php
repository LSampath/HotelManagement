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
    $query = "select count(roomno) from room where roomno='".$roomNo."'";

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

