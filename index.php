<?php

try {

	if (isset($_GET['goals'])) {
		$target = 'data/goals.json';
	} elseif (isset($_GET['next'])) {
		$target = 'data/fixture.json';
	} else {
		$target = 'data/table.json';
	}

	$handle = fopen($target, "r");
	$contents = fread($handle, filesize($target));
	$contents = str_replace("Puntos</", "Puntos", $contents);
	$contents = strip_tags($contents);

	echo $contents;

} catch (\Exception $e) {
	echo $e->getMessage();
}
