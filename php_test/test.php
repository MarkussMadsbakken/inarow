<?php

date_default_timezone_set("America/New_York");
header("Cache-Control: no-store");
header("Content-Type: text/event-stream");
ini_set("max_execution_time", 0); // gjør at php_skriptet kjører uendelig

$counter = rand(1, 10);

while (true) {
    // Every second, send a "ping" event. 

    echo "event: ping\n";
    $curDate = date(DATE_ISO8601);
    echo 'data: {"time": "' . $curDate . '"}';
    echo "\n\n";

    // Send a simple message at random intervals.

    $counter--;

    if (!$counter) {
        echo 'data: This is a message at time ' . $curDate . "\n\n";
        $counter = rand(1, 10);
    }

    ob_end_flush();
    flush();

    // Break the loop if the client aborted the connection (closed the page)

    if(connection_aborted()) {error_log("stopping loop"); break;}

    error_log("test");

    sleep(1);
}

?>