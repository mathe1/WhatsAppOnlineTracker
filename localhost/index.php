<?php
// For autolog (additional to console.log) to a local file at your HDD, you need these things:
// 1. http-server with running PHP (like apache/XAMPP or JanaServer - I did it with JanaServer)
// 2. set the "http://localhost" to the folder with this index.php
// That's all.
// Now Autolog is availabel and stores a daily logfile e.g. "track200626.txt"
// I created a viewer tool for this data format -> WAtimeLine
$f = fopen("track".date('ymd').".txt","a");
$u=parse_url($_SERVER["REQUEST_URI"], PHP_URL_QUERY); //I tried with $_POST, but was empty all time
fwrite($f,"> ".html_entity_decode(urldecode($u),ENT_NOQUOTES|ENT_HTML5,"UTF-8")."\n");
fclose($f);
echo "https://github.com/mathe1/WhatsAppOnlineTracker ;-)";
?>
