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
        $query = "select distinct r.roomno, floor, size, prize, AC, description from Room r left join Reservation s using(roomno) 
                  where r.size='".$size."' and ( (s.checkout<'".$checkIn."' or s.checkin>'".$checkOut."') or
                  r.roomno not in (select roomno from reservation) )";
    }else {
        $query = "select distinct r.roomno, floor, size, prize, AC, description from Room r left join Reservation s using(roomno) 
                  where r.AC=".$type." and r.size='".$size."' and ( (s.checkout<'".$checkIn."' or s.checkin>'".$checkOut."') or
                  r.roomno not in (select roomno from reservation) )";
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
    $mealtype = $_GET['mealtype'];
    $mealpre = $_GET['mealpre'];

    $toResID = "select resid from reservation order by resid desc limit 1";
    $toCusID = "select custid from customer order by custid desc limit 1";
    $toMealID = "select mealid from meal order by mealid desc limit 1";

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
    if ($query_run = @mysqli_query($connection, $toMealID)) {
        $result = mysqli_fetch_assoc($query_run);
        $value = substr($result["mealid"], 1);
        $value += 1;
        $mealID = "M" . sprintf("%04d", $value);
    } else {
        $mealID = "M0001";
    }

    echo $mealID.$custID.$resID;

    $query = "update room set status='".$method."' where roomno='".$roomNo."'";
    echo $query;
    if(!$query_run = @mysqli_query($connection, $query)) {
        $query = "";
        echo "error";
    }else {
        $query = "insert into customer values('" . $custID . "', '" . $name . "', '" . $ID . "', '" . $VISA . "', " . $phone . ", '" . $address . "')";
        echo $query;
        if(!$query_run = @mysqli_query($connection, $query)) {
            echo "error";
            $query = "";
        }else {
            $query = "insert into reservation values('" . $resID . "', " . $roomNo . ", '" . $checkIn . "', '" . $checkOut . "', " . $days . ", " . $totalFee . ", " .
                $balance . ", '" . $custID . "', '".$method."')";
            echo $query;
            if(!$query_run = @mysqli_query($connection, $query)) {
                echo "error";
                $query = "";
            }else {
                $query = "insert into meal values('".$mealID."', '".$resID."', '".$mealtype."', '".$mealpre."')";
                echo $query;
            }
        }
    }


}else if($q == "getreserves") {

    $reserved = $_GET["reserved"];
    $checkedIn = $_GET["checkedIn"];
    $checkedOut = $_GET["checkedOut"];

    $query = "select * from reservation r, customer c where c.custid=r.custid";

    if($reserved == 'false') {
        $query .= " and status!='Reserved'";
    }
    if($checkedIn == 'false') {
        $query .= " and status!='CheckedIn'";
    }
    if($checkedOut == 'false') {
        $query .= " and status!='CheckedOut'";
    }


}else if($q == "getcust") {

    $custID = $_GET["custid"];

    $query = "select * from customer where custid='" . $custID . "'";
    echo $query;


}else if($q == "reservedetails") {

    $resID = $_GET["resid"];

    $query = "select * from customer c, room o, reservation r, meal m where r.resid=m.resid and".
        " r.custid=c.custid and r.roomno=o.roomno and r.resid='".$resID."'";


}else if($q == "updatereserve") {

    $resid = $_GET["resid"];
    $totalfee = $_GET["totalfee"];
    $balance = $_GET["balance"];
    $status = $_GET["status"];
    $mealtype = $_GET["mealtype"];
    $mealpre = $_GET["mealpre"];
    $name = $_GET["name"];
    $NID = $_GET["NID"];
    $VISA = $_GET["VISA"];
    $address = $_GET["address"];
    $telephone = $_GET["telephone"];
    $custid = $_GET["custid"];

    $query = "update reservation set totalfee=".$totalfee.", balance=".$balance.", status='".$status."' where resid='".$resid."'";
    if(!$query_run = @mysqli_query($connection, $query)) {
        echo "error";
        $query = "";
    }else {
        $query = "update customer set name='".$name."', nid='".$NID."', visa='".$VISA."', telephone=".$telephone.", address='".$address."' where custid='".$custid."'";
        echo $query;
        if(!$query_run = @mysqli_query($connection, $query)) {
            echo "error";
            $query = "";
        }else {
            $query = "update meal set type='".$mealtype."', pre='".$mealpre."' where resid='".$resid."'";
        }
    }


}else if($q == "cancelreserve") {

    $resid = $_GET['resid'];
    $custid = $_GET['custid'];

    $query = "delete from reservation where resid='".$resid."'";
    if(!$query_run = @mysqli_query($connection, $query)) {
        echo "error";
        $query = "";
    }else {
        $query = "delete from meal where resid='".$resid."'";
        if(!$query_run = @mysqli_query($connection, $query)) {
            echo "error";
            $query = "";
        }else {
            $query = "delete from customer where custid='".$custid."'";
        }
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


