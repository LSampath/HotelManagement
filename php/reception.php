<?php
/**
 * Created by PhpStorm.
 * User: Lahiru
 * Date: 7/7/2017
 * Time: 10:22 PM
 */

require('connection.php');

$q= $_GET["q"];


if($q == 'getrooms') {

    $checkIn = $_GET["checkin"];
    $checkout = $_GET["checkout"];
    $type = $_GET["type"];
    $size = $_GET["size"];

    if( $type == 'any' ) {
        $query = "select distinct r.roomno, floor, size, prize, AC, description from Room r, Reservation s
                  where r.roomno=s.roomno and r.size='".$size."' and (s.checkin>'".$checkIn."' or checkout<'".$checkIn."')";
    }else {
        $query = "select distinct r.roomno, floor, size, prize, AC, description from Room r, Reservation s
                  where r.roomno=s.roomno and r.AC=".$type." and r.size='".$size."' and (s.checkin>'".$checkIn."' or checkout<'".$checkIn."')";
    }


}else if($q == "getAvailableRooms") {

    $type = $_GET["type"];
    $size = $_GET["size"];

    $query = "select roomno, floor, size, prize, AC, description from room where status='available'";


}else if($q == 'getroom') {
    $roomNo = $_GET["roomno"];

    $query = "select * from room where roomno='".$roomNo."'";


}else if($q == 'getfee') {

    $query = "select * from fee";


}else if($q == "makereserve") {

    $roomNo = $_GET['roomno'];
    $checkIn = $_GET['checkIn'];
    $checkOut = $_GET['checkOut'];
    $days = $_GET['days'];
    $totalFee = $_GET['totalfee'];
    $balance = $_GET['balance'];
    $name = $_GET['name'];
    $ID = $_GET['ID'];
    $VISA = $_GET['VISA'];
    $phone = $_GET['phone'];
    $address = $_GET['address'];
    $method = $_GET['method'];

    $toResID = "select resid from reservation order by resid desc limit 1";
    $toCusID = "select custid from customer order by custid desc limit 1";

    if ($query_run = @mysqli_query($connection, $toResID)) {
        $result = mysqli_fetch_assoc($query_run);
        $value = substr($result["resid"], 1);
        $value += 1;
        $resID = "R" . sprintf("%04d", $value);
    } else {
        $resID = "R0001";
    }
    if ($query_run = @mysqli_query($connection, $toCusID)) {
        $result = mysqli_fetch_assoc($query_run);
        $value = substr($result["custid"], 1);
        $value += 1;
        $custID = "C" . sprintf("%04d", $value);
    } else {
        $custID = "C0001";
    }
    $query = "insert into customer values('" . $custID . "', '" . $name . "', '" . $ID . "', '" . $VISA . "', " . $phone . ", '" . $address . "')";
    if(!$query_run = @mysqli_query($connection, $query)) {
        $query = "";
    }else {
        $query = "insert into reservation values('" . $resID . "', " . $roomNo . ", '" . $checkIn . "', '" . $checkOut . "', " . $days . ", " . $totalFee . ", " .
            $balance . ", '" . $custID . "', '".$method."')";
    }


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


