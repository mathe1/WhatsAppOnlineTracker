# WhatsAppInstaOnlineTracker
This extension looking for the "online" label of a single selected contact and logs the times to the console of the DevTools in your browser.
This is a rebuilt from my works on [WhatsAllApp](https://github.com/mathe1/WhatsAllApp-Mod) and [WhatsappTracker](https://github.com/mathe1/WhatsappTracker).

- It plays an audio signal when the contact comes online and when left. 
- It also plays an audio signal when the contact has seen your message (if blue checks are enabled, v1.1)
- And now (v1.1) you can hear it when the contact writes his message.
- plays an audio signal when phone or computer is disconnected and log that period (v1.2, bugfix in v1.6, differ in v1.10)
- v1.6: logging 3 more events: sent your message, receive a friend's message (also sent from popup while shown as "offline"), time when your sent message marked as "seen".
- Autolog the console.logs to local daily file (v1.3) - this requires a local http-server with running PHP (read details in index.php at folder "localhost"). Updated for use with/on a webserver (v1.3.1).
- v1.8: statistics for nerds ;-) length of message / how many emojis / photo, with text and emoji? / audio, how duration?
- v1.9: detect sticker; If you set a fav contacts, you may switch to other but looging only your fav!
- v1.11: log a keepAlive-ping, so you check that browser is working correct, if no ping after defined period, the browser could be crashed or anything is wrong with the PC...
- v1.12: NEW: monitoring Instagram-Online status too. NEW: log the recalled messages of your friend (only the last message; not checked but theoretically it should work ;-) ).
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
- open the Devtools for this website
- go to console tab

##### Hint: you may use the webserver logging...
This is useful to have access and to show alltimes the activities on your smartphone browser, simple download and view the text log.

##### Hint: It sometimes need update the Classnames when there is an update of WhatsappApp.

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
15:07:21 offline after 20 Seconds.
------------------
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

##### Hint
If you log both pages on a single browser/PC, you may enable only one Ping. It was introduced to check the activity whether the PC was still online or the website had crashed.
As the website crashed, the interval execute ends. As the PC goes offline or shutdown, the logging ends, too. Logging the ping time you able to see, when it happened.

### Working on / known issues:
- wish: would nice to autoclick my favorite contact at startup.. (works fine for Instagram)
- wish: manage switching contacts (1st step done in v1.9)
- bug: if scrolling/jump in/to older messages, the detection logging these old messages, because the feed loading looks for the extension like new messages.
- suspect: Emojis are double counting sometimes
- problem: vm() logged without duration, maybe duration will display short time later after appear the player container
- problem without solution until now: messages and "seen" flag will set only when you look at your contact on your smartphone. Then it synchronize with browser and there the seen-flag sets. In reality the message may have seen much earlier before! It seems, the browser goes to a sleep mode after a while (Edge browser in my case).

