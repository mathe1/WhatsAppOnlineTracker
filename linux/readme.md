# WhatsApp *multi-device (beta)* support

To make the app in the browser window show the online label, it is necessary that the browser is not only the active window.
It is also necessary to show activity as a user. If there is no activity, the online label disappears even while the contact is still online or even writing.

To keep the label active, it is now necessary to at least click around in the interface with the mouse.
The app notices this and updates the online label.

In monitoring, however, we leave this to the computer.

## *xdotool* for automatic clicks
In my case, I have a Raspi for that. It runs the Chromium browser together with the Tracker extension.

After a few attempts, I discovered Xdotool, which is easy to use even for non-experts (I don't know much about Linux).

First get the Tool:

  `sudo apt-get install xdotool`

Then check the [documentation](https://linuxcommandlibrary.com/man/xdotool.html) or take my shell script, copy it to the home-folder.
For the correct mouse coordinates at your environment use this tool too. Move your mouse arrow the the place where you want to click and type to terminal:

  `xdotool getmouselocation`

The tool displays now the x/y values of this point. Write these values in the script to the mousemove-command.

After edit to your own purpose, open a terminal window and run the script

  `bash ./waclick.sh`

The script ends when you click into another window.

## Remarks
If you use this, you will alltime show "online" for your contacts.
New messages from the contact you monitoring will not notify at your smartphone, because you have seen even in the desktop app. Late answering could give your contact bad feelings...

I also found a new issue:
After a while the desktop app does not actulize the online lable anymore - you have to reload the page.
