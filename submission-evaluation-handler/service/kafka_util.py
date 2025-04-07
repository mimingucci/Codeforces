import asyncio
from service.kafka_producer import KafkaProducer
from typing import Dict, Any, Optional

# Singleton instance of the Kafka producer
_kafka_producer = None

async def get_kafka_producer() -> KafkaProducer:
    """
    Get or create a Kafka producer instance
    
    Returns:
        A connected KafkaProducer instance
    """
    global _kafka_producer
    
    if _kafka_producer is None:
        _kafka_producer = KafkaProducer()
        await _kafka_producer.connect()
        
    return _kafka_producer

async def publish_event(topic: str, event_data: Dict[str, Any], key: Optional[str] = None):
    """
    Publish an event to a Kafka topic
    
    Args:
        topic: The Kafka topic to publish to
        event_data: The event data (will be serialized to JSON)
        key: Optional message key
    """
    producer = await get_kafka_producer()
    return await producer.send_message(topic, event_data, key)