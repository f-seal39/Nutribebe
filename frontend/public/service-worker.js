// Service Worker for push notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event.data);
  
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.contenu || 'Nouvelle notification',
    icon: '/logo.png',
    badge: '/logo-small.png',
    tag: data.type || 'notification',
    requireInteraction: data.priorite === 'haute',
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' }
    ],
    data: {
      url: data.url || '/',
      type: data.type,
      id: data.id,
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.titre || 'NutriBébéCam', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed');
});
