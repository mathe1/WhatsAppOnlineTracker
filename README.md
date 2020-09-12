# WhatsAppOnlineTracker
This extension looking for the "online" label of a single selected contact and logs the times to the console of the DevTools in your browser.
This is a rebuilt from my works on [WhatsAllApp](https://github.com/mathe1/WhatsAllApp-Mod) and [WhatsappTracker](https://github.com/mathe1/WhatsappTracker).

- It plays an audio signal when the contact comes online and when left. 
- It also plays an audio signal when the contact has seen your message (if blue checks are enabled, v1.1)
- And now (v1.1) you can hear it when the contact writes his message.
- plays an audio signal when phone or computer is disconnected and log that period (v1.2, bugfix in v1.6)
- v1.6: logging 3 more events: sent your message, receive a friend's message (also sent from popup while shown as "offline"), time when your sent message marked as "seen".
- Autolog the console.logs to local daily file (v1.3) - this requires a local http-server with running PHP (read details in index.php at folder "localhost"). Updated for use with/on a webserver (v1.3.1).
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
10:18:54 now monitoring Nobody
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
19:05:38 > You sent a Message OUT
19:07:18 ** Your message was marked as seen after 1 Minutes, 40 Seconds.
19:07:22 Girl - back after 240 Minutes, 1 Second.
19:07:24 < Message IN while friend online
19:07:31 < Message IN while friend online
```

You may use this [graphical Log-Analyser Tool](https://mathesoft.eu/software/whatsapponlinetracker-analyser/) to show the timeline of the logfile.

### Working on / known issues:
- wish: would nice to autoclick my favorite contact at startup..
- wish: manage switching contacts 
- invenstigation, maybe fixed in 1.7: there is something wrong at logging the IN/OUT messages: incoming messages are not logged in some case...
- problem without solution until now: "seen" flag will set only when you look at your contact on your smartphone. Then it synchronize with browser and there the seen-flag sets. In reality the message may have seen much earlier before!

