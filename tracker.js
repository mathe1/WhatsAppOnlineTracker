﻿// https://github.com/mathe1/WhatsAppOnlineTracker
// Android-WA 2.20.189 - web 2.2027.10
// Edit the Classnames when script don't work
// OnlineLabelClass is there in the headline under the contact's name
// ContactNameClass is right from the contact's profile picture in the headline

var OnlineLabelClass = "_3-cMa"; //until 10.06.2020 "O90ur"; 
var ContactNameClass = "_33QME"; //until 10.06.2020 "_5SiUq";
var ToolsClass = "_3nq_A"; //div for right side at 3dots
var SeenClassContainer = "_13opk"; //highlighted contact.. has seen the message
var SeenClass = "_2RFeE"; //checks are blue
var phonestatusClass = "_2vbYK"; // shows the sign and yellow "disconnected" hint 

//you may also use your own webspace for central logging
//Set to false, if not wished
var xhrURL="http://localhost?";
var autolog_local = true;

var xhrURLw="https://your-webspace.xyz?";
var autolog_web = true;

//set any authorisation when use an online webserver, so avoid false data
//this "hash" write also inside the index.php, else no logging 
var hash="711vJy&";

var autolog_Lchecked=false;
var autolog_Wchecked=false;

var isOnline = 0;
var logged = 0;
var phonealert = -1;

var last_time;
var last_time_backup;
var offtime = new Date();
var offtimelabel="Init";

var last_seen_last = '';
var last_seen_act = '';

var last_contact ='.';
var act_contact ='';

var msg_seen = 0;

//get the extension ID for Audios
var extsrc=chrome.extension.getURL('/tracker.js');
extsrc=extsrc.split('/');
extsrc=extsrc[2];

function SetStatus(x) {
 var v=document.getElementsByClassName(ToolsClass)[0];
 if (v != undefined) {
  var a=document.getElementById('WAOT');
  if (a) a.innerHTML = x;
  else {
   var b=document.createElement("div");
   b.id="WAOT";
   b.innerHTML=x;
   var s=v.firstElementChild;
   s.insertBefore(b,s.childNodes[0]);
  }
 }
}

function _play(status) {
 //works only inside an extension 
 let url = 'chrome-extension://'+extsrc+'/audios/'+status+'.mp3'; 
 new Audio(url).play();
}

function consolelog(msg) {
 console.log(msg);
 if (autolog_local) {
 //This needs a running local http-server with PHP on your PC
 //It calls a php-script to write the log-file on local HDD. 
  var xhr = new XMLHttpRequest(); 
  xhr.onerror = function(){
   console.log('⚠️Local Autolog Error!');
   _play('alert');
  }  
  xhr.onreadystatechange = function() {
    if (!autolog_Lchecked && xhr.readyState == xhr.DONE) {
     autolog_Lchecked=true;
     if (xhr.status == 200) console.log("✔️Local Autolog active"); 
     else {
      console.log("❌ Local Autolog not available");
      autolog_local=false; //no log-server online
     }    
    }
  }
  xhr.open("GET", xhrURL+hash+encodeURI(msg));
  if (xhr.readyState==xhr.OPENED) xhr.send();
 }
  
 if (autolog_web) {
 //This needs an own webspace
 //It calls a php-script to write the log-file on your websapce. 
  var xhro = new XMLHttpRequest(); 
  xhro.onerror = function(){
   console.log('⚠️Online Autolog Error!');
   _play('alert');
  }  
  xhro.onreadystatechange = function() {
    if (!autolog_Wchecked && xhro.readyState == xhro.DONE) {
     autolog_Wchecked=true;
     if (xhro.status == 200) console.log("✔️Online Autolog active"); 
     else {
      console.log("❌ Online Autolog not available");   
      autolog_web=false; //no log-server online
     } 
    }
  }
  xhro.open("GET", xhrURLw+hash+encodeURI(msg));
  if (xhro.readyState==xhro.OPENED) xhro.send();
 }
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
  if (SECONDS==0 && MINUTES==0) SECONDS=1; //but there was anything.. 
    FinalTime += SECONDS + ' Seconds.';
  return FinalTime;
}

setInterval(function() {
  var date = new Date();
  var time = ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2) + ':' + ('0'+date.getSeconds()).slice(-2);
  
  //check phone status maybe disconnected and log that 
  var phonestatus=document.getElementsByClassName(phonestatusClass)[0]; 
  if (phonestatus) 
   if (phonestatus.firstElementChild.dataset.icon=='alert-phone' || phonestatus.firstElementChild.dataset.icon=='alert-computer') 
   {
    if (phonealert < 1) {
     _play('alert'); 
     if (phonealert < 0) { 
       last_time_backup = last_time;
       consolelog(time+' ⚠️ phone disconnected'); 
       offtime = new Date();
       offtimelabel = ('0'+offtime.getHours()).slice(-2) + ':' + ('0'+offtime.getMinutes()).slice(-2) + ':' + ('0'+offtime.getSeconds()).slice(-2);
       last_time = offtime;
     }
     phonealert = 10;
    } else phonealert--; 
    SetStatus('⚠️ Disconnected '+offtimelabel+get_time_diff(2));
    return
   }
  if (phonealert>0) { consolelog(time+' ⚠️ alert finished'+get_time_diff(1)); phonealert = -1; offtime = last_time_backup; }
  
  var msgcheck=document.getElementsByClassName(SeenClassContainer);
  if (msgcheck.length>0) {
    if (msgcheck[0].getElementsByClassName(SeenClass).length>0) {
     if (msg_seen==0) _play("note");
     msg_seen=1;
    } 
    else msg_seen=0;
  } 
      
  try {
   var ctc = document.getElementsByClassName(ContactNameClass);
   var act_contact = ctc[0].firstElementChild.firstElementChild.firstElementChild.title;
  } catch(err) {var act_contact = 'started!';} 

  //Read Status: nothing or 'online' (also when 'writing...')
  var last_seen = document.getElementsByClassName(OnlineLabelClass);
  if (last_seen.length > 0) {
    var s=last_seen[0].innerText; 
    last_seen_act='';
    if (s == 'online') last_seen_act='online';
    if (s.indexOf('...')>0) last_seen_act='online'; //old
    if (s.indexOf('…')>0) {
     last_seen_act='online';   //new
     if (s.indexOf('udio')<1) _play("writing"); //no Audio recording..., but writing...
    }
  } else last_seen_act=''; 

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
    }
  }    
  //now check if online
  //check status changed
  if (isOnline == 0 && last_seen_act=='online') { //Status online	or writing...	
		    last_time = new Date(date);
        var tdif=get_time_diff(0); 
        if (logged == 1) {      
		     if (last_contact == act_contact) { //contact returns
          consolelog(time + ' ' + act_contact + tdif);
         }
        }
        else {
         consolelog(time + ' ' + act_contact + ' is back / online');
        } 
        SetStatus('Coming online'+tdif);
        _play('online');
       logged=1;
		   isOnline = 1;
    }  
  else 
   if (isOnline>0) SetStatus('Online '+get_time_diff(3)); 
   else SetStatus('Offline '+offtimelabel+get_time_diff(2));
  
  if ( last_seen_act == '' && isOnline > 0) { 
    //no Label, but was Online => Status offline		
    offtime = new Date();
    offtimelabel = ('0'+offtime.getHours()).slice(-2) + ':' + ('0'+offtime.getMinutes()).slice(-2) + ':' + ('0'+offtime.getSeconds()).slice(-2);
		isOnline = 0;
    last_seen_last = last_seen_act;
    var dif = get_time_diff(1);
    //if (dif !=0) {
			consolelog(time + ' offline' + dif);
			consolelog('------------------');
      SetStatus('Left'+dif);
      _play('offline');
    //}
	} 
   
    last_contact=act_contact;
    last_seen_last=last_seen_act;
    
}, 1000);

//some inits
//Show WA-web version
var t=document.scripts[document.scripts.length-1].text;
    t=t.slice(t.indexOf("crashlogs")-40,t.indexOf("crashlogs"));
    t=t.slice(t.indexOf("=")+2,t.indexOf('",',t));
consolelog("WhatsApp-web Version: "+t);
