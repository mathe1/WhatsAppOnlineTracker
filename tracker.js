// https://github.com/mathe1/WhatsAppOnlineTracker

// Edit the Classnames when script don't work
// OnlineLabelClass is there in the headline under the contact's name
// ContactNameClass is right from the contact's profile picture in the headline
var OnlineLabelClass = "_3-cMa"; //until 10.06.2020 "O90ur"; 
var ContactNameClass = "_33QME"; //until 10.06.2020 "_5SiUq";
var ToolsClass = "_3nq_A"; //div for right side at 3dots

var isOnline = 0;
var logged = 0;
var delay = 0; //between Label "writing..." and "online" and none

var last_time;
var offtime = new Date();
var offtimelabel="Init";

var last_seen_last = '';
var last_seen_act = '';

var last_contact ='.';
var act_contact ='';

//get the extension ID for Audios
var extsrc=chrome.extension.getURL('/tracker.js');
extsrc=extsrc.split('/');
extsrc=extsrc[2];

/*
// need to rethink
try {
 var sock = new WebSocket('ws://localhost:8080/','watrack');
 sock.onmessage = function(e) {console.log("Socket: "+e);}
} catch(err) {console.log("Sockets can't open.");}
*/

function SetStatus(x) {
 var v=document.getElementsByClassName(ToolsClass)[0];
 if (v != undefined) {
  var s=v.innerHTML;
  if (s.substr(0,1)!='<') s=s.substr(s.indexOf('<'));
  v.innerHTML = x+s;
 }
}

function _play(status) {
 //works only inside an extension 
 let url = 'chrome-extension://'+extsrc+'/audios/'+status+'.mp3'; 
 new Audio(url).play();
}

function consolelog(msg) {
 console.log(msg);
// maybe could log to file by a socketserver 
// if (sock.readyState==sock.OPEN) sock.send(msg); 
}

function get_time_diff(mode) {
    var currDate = new Date();
  if (mode>0) { 
    if (mode == 2) var dif = currDate.getTime() - offtime.getTime(); 
    else var dif = currDate.getTime() - last_time.getTime();
  }
	else { var dif = currDate.getTime() - offtime.getTime(); }
    var TimeInSeconds = Math.abs(dif/1000);

    var MINUTES = Math.floor(TimeInSeconds/60);
    var SECONDS = Math.floor(TimeInSeconds%60);
  if (mode>0) { 
   if (mode == 1) var FinalTime = ' after '; else var FinalTime = ' since ';
  }
	else { var FinalTime = ' - back after '; }

    if (MINUTES != 0) { FinalTime = FinalTime + MINUTES + ' Minutes, ';}
    FinalTime += SECONDS + ' Seconds.';
  if (SECONDS==0 && MINUTES==0) return '0'; else return FinalTime;
}

setInterval(function() {
  var date = new Date();
  var time = ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2) + ':' + ('0'+date.getSeconds()).slice(-2);

  try {
   var ctc = document.getElementsByClassName(ContactNameClass);
   var act_contact = ctc[0].firstElementChild.firstElementChild.firstElementChild.title;
  } catch(err) {var act_contact = 'Nobody';} 

  var last_seen = document.getElementsByClassName(OnlineLabelClass);
  if (last_seen.length > 0) last_seen_act = last_seen[0].title; else last_seen_act='';

	if (last_contact != act_contact) // contact changed or initial
  { var logs=' now monitoring '+act_contact;
    last_time = new Date(date);
    last_seen_last='';
    offtime = last_time;
    offtimelabel = ('0'+offtime.getHours()).slice(-2) + ':' + ('0'+offtime.getMinutes()).slice(-2) + ':' + ('0'+offtime.getSeconds()).slice(-2); 
    get_time_diff(0); 
    consolelog(time + logs);
    isOnline=0;
    last_seen_last=last_seen_act;
    logged=0;
    if (last_seen_act=='online') {
     consolelog(time + ' ' + act_contact + ' is online');
     logged=1;
     isOnline=1;
     delay = 2;
    }
  }    
  //now check if online
  //check status changed
  if (isOnline == 0 && last_seen_act=='online') { //Status online		
		    last_time = new Date(date);
        var tdif=get_time_diff(0); 
        if (tdif !='0' && logged == 1) {      
		     if (last_contact == act_contact) { //contact returns
          consolelog(time + ' ' + act_contact + tdif);
         }
        }
        else {
         consolelog(time + ' ' + act_contact + ' is back / online');
        } 
        _play('online');
       logged=1;
		   isOnline = 1;
       delay = 2;
    }  
  else 
   if (isOnline>0) SetStatus('Online '+get_time_diff(3)); 
   else SetStatus('Offline '+offtimelabel+get_time_diff(2));
  
  if ( last_seen_act.indexOf(':') <0 && last_seen_act.indexOf('...') <0 && last_seen_act.length !=6 && isOnline > 0) { //Status offline		
		if (delay == 2) {
      offtime = new Date();
      offtimelabel = ('0'+offtime.getHours()).slice(-2) + ':' + ('0'+offtime.getMinutes()).slice(-2) + ':' + ('0'+offtime.getSeconds()).slice(-2);
    } 

    delay--;
    if (delay < 1) {
			isOnline = 0;
      last_seen_last = last_seen_act;
      var dif = get_time_diff(1);
      if (dif !=0) {
  			consolelog(time + ' offline' + dif);
  			consolelog('------------------');
        _play('offline');
      }
    } 
	} else delay=2; 
   
    last_contact=act_contact;
    last_seen_last=last_seen_act;
    
}, 1000);