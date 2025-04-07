# main.py
import asyncio
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, HTTPException
from service.kafka_consumer import KafkaConsumer
from event import JudgeSubmissionEvent
from service.kafka_util import _kafka_producer
from service.service_client import ServiceClient
from judge import Judge, Language

app = FastAPI()
app.debug = 1


class SubmissionHandler(KafkaConsumer):
    async def handle_message(self, message):
        # Implement your message handling logic here
        print(f"Handling message from {message.value}")
        try:
            event = JudgeSubmissionEvent(**message.value)
            judger = Judge(src=event.sourceCode, inputs=["1 2 3", "1 2"], outputs=["1", "2"], language=Language.CPP)
            rep = await judger.run()
            print(rep)
        except Exception as e: 
            print(f"Invalid message format: {e}")


@app.on_event("startup")
async def startup_event():
    # Initialize eureka client first
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="submission-evaluation-handler",
        instance_port=8000
    )
    
    # Then start your Kafka consumer
    consumer = SubmissionHandler()
    loop = asyncio.get_event_loop()
    loop.create_task(consumer.consume())


@app.on_event("shutdown")
async def shutdown_event():
    # Clean up Kafka producer if it exists
    if _kafka_producer:
        await _kafka_producer.disconnect()


# uvicorn main:app --host 0.0.0.0 --port 8088 or fastapi dev main.py
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8088)
    app.run()