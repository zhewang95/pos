var p=document.getElementById('effect');
chrome.storage.sync.get({"effect":false},function(result){
   if(result.effect){
       p.innerHTML='<img src="../images/popup.png">';
   }
});