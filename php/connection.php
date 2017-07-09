<?php
/**
 * Created by PhpStorm.
 * User: Lahiru
 * Date: 7/6/2017
 * Time: 7:15 PM
 */

$host = 'localhost';
$user = 'root';
$pass = '';
$database = 'hotelsystem';

if(! $connection = @mysqli_connect($host, $user, $pass)) {
    die("connection__error ");
}
if(!@mysqli_select_db($connection, $database)) {
    die("database__error ");
}


