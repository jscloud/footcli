<?php

include_once '../lib/HTMLTable2JSON.php';
$helper = new HTMLTable2JSON();

$numeroFechas = 16;

$helper->tableToJSON('goals.json', 'http://olxfutbol6.micampeonato.com/tabla-de-goleadores.html#.VSwZ_xPF9p9');
$helper->tableToJSON('table.json', 'http://olxfutbol6.micampeonato.com/tabla-de-posiciones.html#.VSwUPRPF9p8');

$stream 		= file_get_contents('http://olxfutbol6.micampeonato.com/fixture.html#.VS51s63BzGe');
$initTarget 	= '<div id="fechas-zona-0"';
$finalTarget 	= '<!-- fechas-zona-0!-->';

$initPos 	= strpos($stream, $initTarget);
$finalPos 	= strpos($stream, $finalTarget);

$nowDate 		= date("d-m-Y"); 
$initialStream 	= substr($stream, $initPos, ($finalPos - $initPos));
$lenTotal 		= strlen($initialStream);

$dateTargetInit 	= '<div class="informacion">Resultados de la';
$dateTargetFinal 	= '</div>';

$initPos 	= 0;
$dates = array();
for ($i=1; $i <= 16; $i++) { 

	$initPos		= strpos($initialStream, $dateTargetInit, $initPos);

	$finalPos		= strpos($initialStream, $dateTargetFinal, $initPos);

	$currentDate 	= substr($initialStream, $initPos, ($finalPos - $initPos));

	$initPos = $finalPos;

	$currentDate = explode('|', $currentDate);
	$currentDate = trim(str_replace('.', '-', $currentDate[1]));

	$aux = new DateTime($currentDate);
	$aux = $aux->getTimestamp();
	$dates[$aux] = array('pos' => $initPos, 'date' => $currentDate);
}

ksort($dates);

$nowTimestamp 	= new DateTime($nowDate);
$nowTimestamp 	= $nowTimestamp->getTimestamp();
$nextMatch = false;
foreach ($dates as $dateTimeStamp => $obj) {
	if ($dateTimeStamp >= $nowTimestamp) {
		$nextMatch = $obj;
		break;
	}
}

if ($nextMatch) {
	$nextMatch['data'] = getTeams($initialStream, $nextMatch['pos']);

	$out = json_encode($nextMatch);

	if (false == ($out_handle = fopen('fixture.json', 'w')))
		die('Failed to create output file fixture');

	fwrite($out_handle, $out);
	fclose($out_handle);
	echo "ok";
}

function getTeams($str, $initialPos) 
{
	$targetStr 		= substr($str, $initialPos);
	$targetSearch 	= '<a href="';
	$targetStrf 	= '>';

	$init = 0;
	$response = array();
	for ($i=1; $i <= 4; $i++) {

		$init  = strpos($targetStr, $targetSearch, $init);
		$final = strpos($targetStr, $targetStrf, $init);


		$teamName = substr($targetStr, $init + 16, ($final - $init));
		$teamName = explode("-", $teamName);

		$newTeamName = '';
		for ($j=0; $j < (count($teamName) -1); $j++) { 
			$newTeamName .= ucfirst($teamName[$j]) . ' ';
		}

		if ($i == 1 || $i == 2) {
			$key = 'match1';
		} else {
			$key = 'match2';
		}

		$response[$key][] = $newTeamName;

		$init  = $final;
	}

	return $response;
}






