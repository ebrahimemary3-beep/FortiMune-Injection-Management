/* FortiMune V6.2 — push only. No cached staff/customer data. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{}}catch(_e){}
 event.waitUntil(self.registration.showNotification(data.title||'FortiMune',{
  body:data.body||'لديك تنبيه جديد. افتح التطبيق للمراجعة.',
  tag:data.collapseKey73||(data.requestId?('fortimune:'+data.userId+':'+data.requestId):data.id||'fortimune-notice'),dir:'rtl',lang:'ar',
  data:{requestId:data.requestId||'',userId:data.userId||''},
  icon:new URL('./push-icon.png',self.registration.scope).href,
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();const requestId=String(event.notification.data?.requestId||'');
 const target=new URL('./',self.registration.scope);if(requestId)target.searchParams.set('request',requestId);const userId=String(event.notification.data?.userId||'');if(userId)target.searchParams.set('recipient',userId);
 event.waitUntil((async()=>{
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  const client=clients.find(c=>c.url.startsWith(self.registration.scope));
  if(client){client.postMessage({type:'FORTIMUNE_OPEN_REQUEST',requestId,userId});await client.focus()}
  else await self.clients.openWindow(target.href);
 })());
});
