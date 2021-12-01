# WhatsAppInstaOnlineTracker
This extension looking for the "online" label of a single selected contact and logs the times to the console of the DevTools in your browser.
This is a rebuilt from my works on [WhatsAllApp](https://github.com/mathe1/WhatsAllApp-Mod) and [WhatsappTracker](https://github.com/mathe1/WhatsappTracker).

### WhatsApp Beta for multi-devices
Check out the [issue](https://github.com/mathe1/WhatsAppOnlineTracker/issues/7) and look my the solution in the [linux-folder](https://github.com/mathe1/WhatsAppOnlineTracker/tree/master/linux).

##### Hint: It sometimes need update the Classnames when there is an update of WhatsappApp. Please write a ticket, if anything doesn't work!

- It plays an audio signal when the contact comes online and when left. 
- It also plays an audio signal when the contact has seen your message (if blue checks are enabled, v1.1)
- And now (v1.1) you can hear it when the contact writes his message.
- plays an audio signal when phone or computer is disconnected and log that period (v1.2, bugfix in v1.6, differ in v1.10)
- v1.6: logging 3 more events: sent your message, receive a friend's message (also sent from popup while shown as "offline"), time when your sent message marked as "seen".
- Autolog the console.logs to local daily file (v1.3) - this requires a local http-server with running PHP (read details in index.php at folder "localhost"). Updated for use with/on a webserver (v1.3.1).
- v1.8: statistics for nerds ;-) length of message / how many emojis / photo, with text and emoji? / audio, how duration?
- v1.9: detect sticker; If you set a fav contacts, you may switch to other but looging only your fav!
- v1.11: log a keepAlive-ping, so you check that browser is working correct, if no ping after defined period, the browser could be crashed or anything is wrong with the PC...
- v1.12: NEW: monitoring Instagram-Online status too. NEW: log the recalled messages of your friend.
- v1.20: Updated the ClassNames; New function: logging when somebody posted a new status, and when you viewed it. Maybe interesting?
- v1.21: bugfix: when the favorite contact have no profil photo. Set variable "altfav" to the fav's name like shown in header title - else no monitoring! This is a backup solution, an alternative. You have to change the variable when edited the contact's name on your smartphone, too.
- It displays also in the right edge of the chat header some information:

While contact is online:
```
Online since 2 Minutes, 36 Secounds.
```
Or last seen time:
```
Offline 15:18:21 since 74 Minutes, 8 Secounds.
```
## How to use
- Download and extract to a local folder.
- Let your browser be in developer mode and "load unpacked extension"
- open your web.whatsapp.com and login
- select a contact

## How to view the logging
- open the Devtools for this website
- go to console tab and show the log, you may copypaste the lines or save to file.

## How to view the logging in most comfortable way
- use a raspberry pi (or similar mini computer where you can run a browser app) as stand-alone-logger.
- Here you use Chrome-Browser in the same way like descripted above.

In my case I use my raspi with Chrome, and the VNC server for remote support.

- Setup the tracker.js to your webspace (variable xhrURLw), define a hash (hash; it is like a password to log only your own data, filtering out any alien request - better you define a secret subdomain for that; and put there the index.php), a favorite contact (fav (=phone number), altfav (=nickname), enable weblogging (autolog_web=true), disable local logging (autolog_local=false; if you have no webserver running on localhost). Then save your prepared js-file.
- also setup the index.php to your hash and store the file (webspace or local).
- Start your browser and open the web.whatsapp.com, then login and click on favorite contact
- for listen the audio-events plug some speaker on your raspi's audio plug - or connect bluetooth speakers
- connect with VNC viewer (with smartphone app or the windows version) for support on the raspi.
E.g. you wish to disable the audioplaying. Then right click on the Tab, select this function from menu. Do that again to enable the audio.

Because logging to your webspace, you are able to show the logs with your smartphone.
The generated textfiles named trackYYMMDD.txt - e.g. **https: // secret. example .com / track210217.txt**
Change that in index.php if wished.

### Content of log-files

Example:
```
10:18:54 now monitoring startet!
10:19:23 now monitoring Girl
11:23:57 ⚠️ phone disconnected
11:24:28 ⚠️ alert finished after 30 Seconds.
14:34:55 Girl is back / online
14:35:18 offline after 23 Seconds.
------------------
14:43:45 Girl - back after 8 Minutes, 27 Seconds.
14:44:16 offline after 31 Seconds.
------------------
15:07:01 Girl - back after 22 Minutes, 45 Seconds.
15:07:12 📰 someone has posted a new status
15:07:21 offline after 20 Seconds.
------------------
17:03:41 📰 you have viewed the status
19:44:15 Girl - is back / online
19:44:55 > You sent a Message OUT while friend online tx(206/1)
19:45:03 ** Your message was marked as seen after 7 Seconds.
19:45:23 offline after 1 Minutes, 8 Seconds.
19:46:50 < Message IN from external ph(3/1)
```

If you use the ping logging function, there periodical notes like
```
alive @ 22:34:10
``` 
between the normal logging.
You may use a tool to check this data for special alert...

If you set the ping variable to 0, "alive" will not logged; each other value will enable the logging.
This is independent of the status checker, which is executed every second.
This is useful because the alert of disconnection (computer) often ends later than in reality. When "alive" is logged at web, the computer isn't disconnected, but Whatsapp informer didn't recognize yet.

### Nerdistics
This is an artificial word for "Nerd" and "Statistics" ;-)

When sent or receive a message, now it logging the length of text, how many emojis were used, ...
- tx(text length/count of emoji) - textmessage, e.g. tx(206/1)
- ph(text length/count of emoji) - textmessage with photo, e.g. ph(3/1)
- vm(duration) - voice message, duration min:sec red out from label, e.g. vm(1:23) 
- sticker
- xx(unknown) - other content, maybe video, ..

You may use this [graphical Log-Analyser Tool](https://mathesoft.eu/software/whatsapponlinetracker-analyser/) to show the timeline of the logfile (Updated 29.09.2020 to support v1.11).

### Instagram features
From v1.12 on you may logging the online activities of one favourite contact.
There is a problem here - the status label is not updated in real-time. Therefore we use a trick and reload the page regularly to update the label. This is all done automatically. 

Enable this Tracker by 2 values:
- i_fav is the string-variable for the friends nickname 
- i_ping is the duration value after it refresh the status label

If i_fav is empty or i_ping is 0, the logging is disabled.

There are two intervals set for handling the Instagram status:
- The main checker for the label. It looking every second for a change of the label. If it changes this will log.
- A service for refresh the label - after a period each count of seconds defined in i_ping, it start a trick to update the label.

After a while of periods it reload the page, because the label will not refrsh anymore by Instagram.
The count of periods is experimental an you define it in i_period (set to 20 now).

Example
```
18:07:34 *i* reload page
Instagram-Ping (*i* refresh) =180
18:07:43 *i* refresh 
18:07:47 *i* (friend)Vor 5 Std. aktiv
18:10:47 *i* refresh 
18:11:09 *i* (friend)Jetzt aktiv
18:13:47 *i* refresh 
```

##### Hint
If you log both pages on a single browser/PC, you may enable only one Ping. It was introduced to check the activity whether the PC was still online or the website had crashed.
As the website crashed, the interval execute ends. As the PC goes offline or shutdown, the logging ends, too. Logging the ping time you able to see, when it happened.

### Working on / known issues:
- wish: would nice to autoclick my favorite contact at startup.. (works fine for Instagram)
- wish: manage switching contacts (1st step done in v1.9)
- bug: if scrolling/jump in/to older messages, the detection logging these old messages, because the feed loading looks for the extension like new messages.
- suspect: Emojis are double counting sometimes -> this is because some Emoji have a gender char, so there are 2 char, but not visible for user. You can see that, when copy a message and paste in a textfield external from WhatsApp. Maybe I fix that next time.
- idea: logging the timestamp when fav contact change its profil photo and download it 
- problem: vm() logged without duration, maybe duration will display short time later after appear the player container
- problem without solution until now: messages and "seen" flag will set only when you look at your contact on your smartphone. Then it synchronize with browser and there the seen-flag sets. In reality the message may have seen much earlier before! It seems, the browser goes to a sleep mode after a while (Edge browser in my case).

