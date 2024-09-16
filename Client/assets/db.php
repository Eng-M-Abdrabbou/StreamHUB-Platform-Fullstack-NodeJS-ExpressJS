<?php
//this is db.php
if (!isset($conn) || !($conn instanceof mysqli) || $conn->connect_error) {
$server = "localhost";
$username = "root";
$password = "";
$dbname = "streamhubdb";

$conn = new mysqli($server, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Unable to connect");
}
}
?>
