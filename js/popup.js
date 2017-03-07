var p=document.getElementById('effect');
chrome.storage.sync.get({"effect":false},function(result){
   if(result.effect){
       var timing=tracker.startTiming("Analystics performance","send event");
       p.innerHTML='<img src="../images/popup.png">';
       tracker.sendEvent('left','clicked');
       tracker.sendAppView('MainView');
       timing.end();
   }
});