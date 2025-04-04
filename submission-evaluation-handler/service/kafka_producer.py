import json
from aiokafka import AIOKafkaProducer
from config import settings

class KafkaProducer:
    def __init__(self):
        self.producer = None
        self.is_connected = False

    async def connect(self):
        if not self.is_connected:
            self.producer = AIOKafkaProducer(
                bootstrap_servers=settings.kafka_bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            await self.producer.start()
            self.is_connected = True

    async def disconnect(self):
        if self.producer and self.is_connected:
            await self.producer.stop()
            self.is_connected = False

    async def send_message(self, topic: str, message, key=None):
        """
        Send a message to a Kafka topic
        
        Args:
            topic: The Kafka topic to publish to
            message: The message to publish (will be serialized to JSON)
            key: Optional message key
        
        Returns:
            The result of the send operation
        """
        if not self.is_connected:
            await self.connect()
            
        try:
            # Send message to topic
            result = await self.producer.send_and_wait(
                topic=topic,
                value=message,
                key=key.encode('utf-8') if key else None
            )
            return result
        except Exception as e:
            print(f"Error sending message to Kafka: {e}")
            raise