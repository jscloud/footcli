<?php

include_once '../lib/HTMLTable2JSON.php';
$helper = new HTMLTable2JSON();

$helper->tableToJSON('goals.json', 'http://olxfutbol6.micampeonato.com/tabla-de-goleadores.html#.VSwZ_xPF9p9');
$helper->tableToJSON('table.json', 'http://olxfutbol6.micampeonato.com/tabla-de-posiciones.html#.VSwUPRPF9p8');

header("HTTP/1.1 200 OK");
