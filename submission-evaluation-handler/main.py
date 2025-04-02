# main.py
import asyncio
import httpx
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, HTTPException
from service.kafka_consumer import KafkaConsumer
from circuitbreaker import circuit
from event import JudgeSubmissionEvent
from util import logger

# Initialize the Eureka client
# eureka_client.init(
#     eureka_server="http://localhost:8761/",
#     app_name="submission-evaluation-handler",
#     instance_port=8000  # Your FastAPI port
# )


app = FastAPI()
app.debug = 1


@circuit(failure_threshold=3, recovery_timeout=10)
async def getAllTestCasesByProblemId(problemId: int):
    try:
        service_instance = await eureka_client.get_service_url("testcase")
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{service_instance}/api/v1/testcase/problem/{problemId}")
            response.raise_for_status()  # Raise an error for non-2xx responses
        return response.json() 
    except httpx.HTTPStatusError as e:
        raise HTTPException(code=e.response.status_code, message=f"Error from testcase service: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(code=500, message=f"Service unreachable: {str(e)}")


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
    consumer = SubmissionHandler()
    loop = asyncio.get_event_loop()
    loop.create_task(consumer.consume())

# uvicorn main:app --host 0.0.0.0 --port 8088 or fastapi dev main.py
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8088)
    app.run()