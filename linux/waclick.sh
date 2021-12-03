#!/bin/bash
WID=$(xdotool search WhatsApp | head -n1) ## find the browser window where whatsapp is running
xdotool windowactivate $WID ## bring the window to front
while [ $(xdotool getactivewindow) -eq $WID ]
do 
  xdotool mousemove 405 777 click 1 ## in the feed, but edit your own point
  sleep 20 ## secounds
  xdotool mousemove 683 832 click 1 ## input field, but edit your own point
  sleep 20
done
