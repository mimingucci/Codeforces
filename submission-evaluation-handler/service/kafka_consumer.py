import json
from aiokafka import AIOKafkaConsumer
from config import settings

class KafkaConsumer:
    def __init__(self):
        self.consumer = AIOKafkaConsumer(
            *settings.kafka_topics,
            bootstrap_servers=settings.kafka_bootstrap_servers,
            group_id=settings.kafka_consumer_group_id,
            value_deserializer=lambda v: json.loads(v.decode('utf-8')),
            enable_auto_commit=False,
            auto_offset_reset='latest'
        )
        self.is_running = False

    async def consume(self):
        await self.consumer.start()
        self.is_running = True
        try:
            async for message in self.consumer:
                try:
                    print(f"Received message: {message.value}")
                    await self.handle_message(message)
                    await self.consumer.commit()
                except Exception as e:
                    print(f"Error processing message: {e}")
        finally:
            await self.consumer.stop()
            self.is_running = False

    async def handle_message(self, message):
        """Override this method in subclass"""
        raise NotImplementedError