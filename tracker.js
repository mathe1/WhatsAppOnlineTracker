// https://github.com/mathe1/WhatsAppOnlineTracker + Instagram
// Android-WA 2.20.201.21 - web 2.2041.6
// Edit the Classnames when script don't work

// ******* Your private settings

var fav     = ""; // without leading 0 or country number e.g. +49 (germany)
var i_fav   = ""; // your fav nickname to monitoring on instagram

//  you may also use your own webspace for central logging
//  Set to false, if not wished
var autolog_web   = true;
var autolog_local = false;
var xhrURL="http://localhost";
var xhrURLw ="https://your-webspace.xyz"; //for online logging
//  set any authorisation when use an online webserver, so avoid false data
//  this "hash" write also inside the index.php, else no logging 
var hash    ="711vJy"; //like a password

//if you need a non-acustic signal to the log, that your PC, Browser is working correct
//set ping to value > 0 (secounds for send that signal) // it simple counts up in pingc
//for WhatsApp 
var ping = 60; 
var pings="alive";
//for Instagram
var i_ping = 60; //each .. secounds
var i_pings="*i* refresh";

// ******* Change the other settings only if you know, what you doing

var OnlineLabelClass   = "_3-cMa"; //is there in the headline under the contact's name 
var ContactNameClass   = "_33QME"; //is right from the contact's profile picture in the headline
var ToolsClass         = "_3nq_A"; //div for right side at 3dots
var SeenClassContainer = "_1qPwk"; //better check last message than "_13opk"; //highlighted contact.. has seen the message
var SeenClass          = "_3xkAl"; //better check last message than "_2RFeE"; //checks are blue at contact ladder
var phonestatusClass   = "_2vbYK"; //shows the sign and yellow "disconnected" hint 
var forDesktopClass    = "_1evad"; //alert but only for desktop notification
var msgContainerClass  = "z_tTQ";
var textmessageClass   = "eRacY";
var voicemessageClass  = "OBQWJ";
var photomessageClass  = "xOg_4";
var stickerClass       = "_1F528";
var msgRecalledClass   = "_1uP6d"; //appears when a message recalled (deleted from feed)

//InstagramClasses
var i_contact  = "DPiy6";
var i_select   = "QOqBd";
var i_new      = "ZQScA";
var i_box      = "_3wFWr";
var i_continue = "cB_4K";

var pingc= 0;

var autolog_Lchecked=false;
var autolog_Wchecked=false;

var isOnline = 0;
var logged = 0;
var phonealert = -1;
var alertnoted = false; 

var msg_was = ""; //store last message-in content to restore if recalled

var last_time;
var last_time_backup;
var offtime = new Date();
var offtimelabel="Init";

var last_seen_last = '';
var last_seen_act = '';

var last_contact ='.';
var act_contact ='';

var msg_seen = 0;

//Track also Message-in/out
var msg_last_id='';
var msg_last_date=-1;
var wrotetime=0;

// if fav set, this phone number will click to focus automatically at startup or reconnect
var autoclicked = false;
var favname = ''; //will read out
var favswitch=-1; 

//get the extension ID for Audios
var extsrc=chrome.extension.getURL('/tracker.js');
extsrc=extsrc.split('/');
extsrc=extsrc[2];

function ClickContact(nr) {
//when start up the messenger select the fav contact automatically
//would be nice, but click event can't call direct...
 try {   
   var imgs=document.getElementsByTagName('img');
   let i=0;
   while (imgs[i].src.indexOf(nr+'%40c.us')<0) i++;
   //var node=imgs[i].parentElement.parentElement.nextElementSibling;
   var node=imgs[i].parentElement.parentElement.parentElement.parentElement;
   favname=imgs[i].parentElement.parentElement.nextSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild.title;
   console.log('Favname is "'+favname+'"; logging is locked to this name.');
   
   node.click(); // doesn't work -> false
   //should check here for worked..
   var chkresult='failed';
   console.log('Autoclick '+nr+' '+chkresult);
   if (chkresult=='done') {favswitch=0; autoclicked=true} else favswitch=2; 
   return; 
 } catch(e) {return;}
}

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

function timeformat(date) {
 return ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2) + ':' + ('0'+date.getSeconds()).slice(-2);
}

function get_time_diff(mode) {
  var currDate = new Date();
  if (mode>0) { 
    if (mode == 2) var dif = currDate.getTime() - offtime.getTime(); 
    else if (mode == 3 && wrotetime!=0 ) var dif = currDate.getTime() - wrotetime.getTime(); 
    else var dif = currDate.getTime() - last_time.getTime();
  }
  else { var dif = currDate.getTime() - offtime.getTime(); }
    var TimeInSeconds = Math.abs(dif/1000);

    var MINUTES = Math.floor(TimeInSeconds/60);
    var SECONDS = Math.floor(TimeInSeconds%60);
  if (mode>0) { 
   if (mode == 1 || mode == 3) var FinalTime = ' after '; else var FinalTime = ' since ';
  }
  else { var FinalTime = ' - back after '; }

    if (MINUTES != 0) { FinalTime = FinalTime + MINUTES + ' Minutes, ';}
  if (SECONDS==0 && MINUTES==0) SECONDS=1; //but there was anything.. 
    FinalTime += SECONDS + ' Seconds.';
  return FinalTime;
}

function consolelog(msg,silent,f_alive,alive_log) {
// silent=true: plays no audio
// f_alive: name of a separate loglife   nee. das muss in der index.php definiert werden...
// alive_log=true: append the separate logfile; =false: writes a single line of last alive moment

  var date = new Date();
  var time = timeformat(date);
 console.log(msg);
 if (autolog_local) {
 //This needs a running local http-server with PHP on your PC
 //It calls a php-script to write the log-file on local HDD. 
  var xhr = new XMLHttpRequest(); 
  xhr.onerror = function(){
   console.log(time+' ⚠️Local Autolog Error!');
   if (!silent) _play('alert');
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
  xhr.open("GET", xhrURL+"?"+hash+"&"+encodeURI(msg));
  if (xhr.readyState==xhr.OPENED) xhr.send();
 }
  
 if (autolog_web) {
 //This needs an own webspace
 //It calls a php-script to write the log-file on your websapce. 
  var xhro = new XMLHttpRequest(); 
  xhro.onerror = function(){
   console.log(time+' ⚠️Online Autolog Error!');
   if (!silent) _play('alert');
  }  
  xhro.onreadystatechange = function() {
    if (!autolog_Wchecked && xhro.readyState == xhro.DONE) {
     autolog_Wchecked=true;
     if (xhro.status == 200) console.log("✔️Online Autolog active"); 
     else {
      console.log("❌ Online Autolog not available");   
      //autolog_web=false; //no log-server online
     } 
    }
  }
  xhro.open("GET", xhrURLw+"?"+hash+"&"+encodeURI(msg));
  if (xhro.readyState==xhro.OPENED) xhro.send();
 }
}

function nerdistics(node,got) {
 var o="";
 var text=node.getElementsByClassName(textmessageClass)[0];
 var ph=node.getElementsByClassName(photomessageClass)[0];
 var vm=node.getElementsByClassName(voicemessageClass)[0];
 var st=node.getElementsByClassName(stickerClass)[0];
 if (text) {                               
   var c=text.innerText.length;
   if (got==true) msg_was = text.innerText; //store the message
   var i=text.getElementsByTagName("img").length;
   if (ph) o=" ph"; else o=" tx";
   o=o+"("+c+"/"+i+")"; //Textlength and Count of Emojis in this message
 } 
 else
 if (ph) o=" ph(0/0)"; //received a photo without text 
 else
 if (vm) o=" vm("+vm.innerText+")"; //voicemessage-length min:sec
 else 
 if (st) o=" sticker"; //Sticker
 else o=" xx(unknown)"; //maybe Video, GIF, ..?!
 return o;
}

function datetimeConv(s) {
  var h=s.slice(0,2); var m=s.slice(3,5);
  var d=s.slice(s.indexOf(" ")+1,s.indexOf(".")); s=s.slice(s.indexOf(".")+1)
  var M=('0'+s.slice(0,s.indexOf("."))).slice(-2);
  return s.slice(-4)+M+d+h+m+'00'-0; //as number
}

function getDateofMsg(cLid) {
  var cll=cLid.getElementsByClassName("copyable-text")[0];
  if (cll) return datetimeConv(cll.dataset.prePlainText.slice(1,cll.dataset.prePlainText.indexOf("]")));
  else return -1;// msg_last_date;
}

function datetime(date) {
 return (date.getFullYear() + ('0'+(date.getMonth()+1)).slice(-2) + ('0'+date.getDate()).slice(-2) + ('0'+date.getHours()).slice(-2) + ('0'+date.getMinutes()).slice(-2) + ('0'+date.getSeconds()).slice(-2))-0; //as number
}

function recalled(Node) {
 return (Node.getElementsByClassName(msgRecalledClass).length!=0)
}

function checkNewMsg(dtime) {
 var cL=document.getElementsByClassName(msgContainerClass)[0]; 
 if (!cL) return;

 //initial
 if (msg_last_id=='') {
   msg_last_id=cL.lastChild.dataset.id;
   return;
 }

 //running
 var newId=false;   
 if (msg_last_id!=cL.lastChild.dataset.id)
 {
   if (cL.lastChild.dataset.id.indexOf("false")!=-1) {
     if (dtime!=0) {
       if (recalled(cL.lastChild)) {
         consolelog(timeformat(dtime)+' XX Friend recalled last message - content: ['+msg_was+']',true);
         msg_was='';
       }
       else {
         if (isOnline) consolelog(timeformat(dtime)+' < Message IN while friend online'+nerdistics(cL.lastChild,true),true);
         else consolelog(timeformat(dtime)+' < Message IN from external'+nerdistics(cL.lastChild,true),true);
       } 
       newId=true;
     }  
   }
   if (cL.lastChild.dataset.id.indexOf("true")!=-1) {
     if (dtime!=0) {
       if (recalled(cL.lastChild)) {
         consolelog(timeformat(dtime)+' XX You recalled your last message!',true);
         msg_seen=1;
         // no need to store last message content - you know, what you wrote
       }
       else {
         if (isOnline) consolelog(timeformat(dtime)+' > You sent a Message OUT while friend online'+nerdistics(cL.lastChild,false),true);
         else consolelog(timeformat(dtime)+' > You sent a Message OUT'+nerdistics(cL.lastChild,false),true);
         msg_seen=0;
         wrotetime = dtime;
       }  
       newId=true;
     }  
   }
   if (newId) msg_last_id=cL.lastChild.dataset.id;
 }
 
  //seen?
  var v=document.getElementsByClassName(SeenClassContainer);
  if (v.length>0) {
    if (v[v.length-1].getElementsByClassName(SeenClass).length>0) {
     if (msg_seen==0) {
       msg_seen=1;
       if (wrotetime!=0) {
         _play("note");
         consolelog(timeformat(dtime)+' ** Your message was marked as seen'+get_time_diff(3));
       } 
     }  
    } 
    else msg_seen=0;     
  } 

}

function checkAlertStatus(time) {
  if (ping!=0) if (pingc==(ping-1)) { consolelog(pings+" @ "+time); pingc=0; } else pingc++;
  var phonestatus=document.getElementsByClassName(phonestatusClass)[0]; 
  var hinttype=document.getElementsByClassName(forDesktopClass)[0];
  if (phonestatus && !hinttype) {
   let alertStatus=phonestatus.firstElementChild.dataset.icon;
   if (alertStatus!='' && alertStatus!='alert-update' && alertStatus!='alert-battery') 
   {
    if (phonealert < 1) {
     if (alertStatus.indexOf('computer')!=-1) _play('alertc'); 
     else    
     if (alertStatus.indexOf('phone')!=-1)    _play('alert'); 
     if (phonealert < 0) { 
       last_time_backup = last_time;
       consolelog(time+' ⚠️ '+alertStatus+' disconnected',true); 
       offtime = new Date();
       offtimelabel = timeformat(offtime);
       last_time = offtime;
       alertnoted=true;
     }
     phonealert = 10; //alert sound each 10 sec.
    } else phonealert--; 
    SetStatus('⚠️ Disconnected '+offtimelabel+get_time_diff(2));
    return 1;
   } 
  } else
  if (alertnoted==true) { 
   consolelog(time+' ⚠️ alert finished'+get_time_diff(1)); 
   phonealert = -1;  //ready for next alert
   offtime = last_time_backup;
   alertnoted=false; 
  }  
  return 0;
}

var i_act="";
//for refresh status do:
//click new message, then fav contact, then continue button
//if contact is active: repeat that all 60 sec
//else wait for label change
var i_step = 0;
if (document.URL.indexOf("instagram")>0) setInterval(function() {
  var date = new Date();       //service for refresh status
  var time = timeformat(date);

 switch (i_step) {
  case 0:
    var n = document.getElementsByClassName(i_new);
    if (n.length>0) {
     n[0].click();
     i_step++;
    } 
    break;
  case 1:
    var n = document.getElementsByClassName(i_box)[0].getElementsByClassName("qyrsm");
    if (n.length>0) {
     for (let p=0; p<n.length;p++) {
      if (n[p].innerText==i_fav) {n[p].click(); i_step++; break;}
     } 
    } 
    break;
  case 2:
    var n = document.getElementsByClassName(i_continue);
    if (n.length>0) { 
     pingc++;
     if (pingc>20) { //reload the page because refresh works only some minutes
      consolelog(time+" *i* reload page"); 
      location.reload();
     } 
     else {
      if (i_ping>0) consolelog(time+" "+i_pings); 
      n[0].click(); 
      i_step++;
     } 
    }
    break;
  default:  
   i_step++;
   if (i_step>i_ping) i_step=0;
 } 

}, 1000);


if (document.URL.indexOf("instagram")>0) setInterval(function() {
  var date = new Date();        //monitoring status-label
  var time = timeformat(date);

  var i_sel = document.getElementsByClassName(i_select);
  //selected
  var f="";
  if (i_sel.length==1) f=i_sel[0].innerText.replace(/(\r\n|\n|\r)/gm, "");
  else {
    var c=document.getElementsByClassName(i_contact);
    //find fav
    for (let i=0;i<c.length;i++)
      if (c[i].innerText.indexOf(i_fav)==0) { 
       f=c[i].innerText.replace(/(\r\n|\n|\r)/gm, ""); 
       break;
      }
    //select for chat  
  }            
  if (f!=i_act) { i_act=f; consolelog(time+" *i* "+f); }
}, 1000);
else
setInterval(function() {        //WhatsAppTracker
  if (document.getElementById("startup")!=null) return;
  if (fav!='') if (!autoclicked && favswitch==-1) ClickContact(fav); //after wa-startup
  if (document.getElementsByClassName(msgContainerClass).length==0) return;
  var date = new Date();
  var time = timeformat(date);
  
  //check phone status maybe disconnected and log that 
  if (checkAlertStatus(time)!=0) return;
  
  try {
   var ctc = document.getElementsByClassName(ContactNameClass);
   act_contact = ctc[0].firstElementChild.firstElementChild.firstElementChild.title;
  } catch(err) {act_contact = 'started!'; } 

  if (fav!='') {
   if (favname=='') return;
   if (act_contact!=favname) {
    if (favswitch==0) { favswitch=1; consolelog(time+' Switched to another contact'); }
    SetStatus('🔒 Go back to "'+favname+'" for logging.');
    return;
   }
   if (favswitch>0) { if (favswitch==1) consolelog(time+' Switched back to fav contact'); favswitch=0;}
  } 
  
  if (last_contact!=act_contact) msg_last_id=''; 
  checkNewMsg(date);

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
    offtimelabel = timeformat(offtime); 
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
   if (isOnline>0) SetStatus('Online '+get_time_diff(99)); 
   else SetStatus('Offline '+offtimelabel+get_time_diff(2));

  if ( last_seen_act == '' && isOnline > 0) { 
    //no Label, but was Online => Status offline		
    offtime = new Date();
    offtimelabel = timeformat(offtime); 
    isOnline = 0;
    last_seen_last = last_seen_act;
    var dif = get_time_diff(1);
    consolelog(time + ' offline' + dif);
    consolelog('------------------');
    SetStatus('Left'+dif);
    _play('offline');
  } 

  last_contact=act_contact;
  last_seen_last=last_seen_act;

}, 1000);

//some inits
if (document.URL.indexOf("whatsapp")>0) { 
  msg_seen=1; //avoid false detection at 1st time open the contact
  //Show WA-web version
  var t=document.scripts[document.scripts.length-1].text;
    t=t.slice(t.indexOf("crashlogs")-40,t.indexOf("crashlogs"));
    t=t.slice(t.indexOf("=")+2,t.indexOf('",',t));
  consolelog("WhatsApp-web Version: "+t); 
  if (ping!=0) consolelog("Ping ("+pings+") ="+ping);
}
else 
{ consolelog("Instagram-Start");
  if (i_ping!=0) consolelog("Insta-Ping ("+pings+") ="+i_ping);
}  
