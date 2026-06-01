<?php

$host = 'zephyr.proxy.rlwy.net';
$user = 'root';
$password = 'MHpkCZakGgiGDjKEBWMysevFYkFaxqjb';
$database = 'railway';
$port = 40482;

$conexion = new mysqli(
    $host,
    $user,
    $password,
    $database,
    $port
);

if ($conexion->connect_error) {
    die('Error de conexión: ' . $conexion->connect_error);
}

$conexion->set_charset('utf8mb4');