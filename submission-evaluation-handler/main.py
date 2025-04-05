# main.py
import asyncio
import httpx
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, HTTPException
from service.kafka_consumer import KafkaConsumer
from circuitbreaker import circuit
from event import JudgeSubmissionEvent
from service.kafka_util import _kafka_producer
from leaderboard.api import router as leaderboard_router

app = FastAPI()
app.debug = 1

# Add the leaderboard router to FastAPI
app.include_router(leaderboard_router)

@circuit(failure_threshold=3, recovery_timeout=10)
async def getAllTestCasesByProblemId(problemId: int):
    try:
        response = await eureka_client.do_service_async("testcase", f"/api/v1/testcase/problem/{problemId}")
        print(response)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error from testcase service: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Service unreachable: {str(e)}")


class SubmissionHandler(KafkaConsumer):
    async def handle_message(self, message):
        # Implement your message handling logic here
        print(f"Handling message from {message.value}")
        try:
            event = JudgeSubmissionEvent(**message.value)
            print(f"{event.id} - {event.problem} - {event.sourceCode}")
        except Exception as e: 
            print(f"Invalid message format: {e}")


@app.on_event("startup")
async def startup_event():
    # Initialize eureka client first
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/",
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