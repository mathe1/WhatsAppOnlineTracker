<?php
$hash="711vJy&";
$u=parse_url($_SERVER["REQUEST_URI"], PHP_URL_QUERY);
if (!empty($u) and strpos($u,$hash)!==false) {
 $f = fopen("track".date('ymd').".txt","a");
 fwrite($f,"> ".html_entity_decode(urldecode(str_replace($hash, "", $u)),ENT_NOQUOTES|ENT_HTML5,"UTF-8")."\n");
 fclose($f);
} 
echo ";-)\n\n";
?>
