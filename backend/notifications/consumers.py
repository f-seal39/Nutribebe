import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.group_name = f"notifications_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('type') == 'mark_as_read':
            await self.mark_notification_read(data.get('notif_id'))

    async def notification_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'titre': event['titre'],
            'contenu': event['contenu'],
        }))

    @database_sync_to_async
    def mark_notification_read(self, notif_id):
        try:
            notif = Notification.objects.get(id=notif_id, utilisateur=self.user)
            notif.lu = True
            notif.save()
        except Notification.DoesNotExist:
            pass
