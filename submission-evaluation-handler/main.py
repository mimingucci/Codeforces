# main.py
import asyncio
import os
import json
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from service.kafka_consumer import KafkaConsumer
from event import JudgeSubmissionEvent
from service.kafka_util import _kafka_producer, publish_event
from judge import Judge, Language, Rule, Verdict
from datetime import datetime, timezone
from service.service_client import ServiceClient
# Add CORS middleware (if needed)
from fastapi.middleware.cors import CORSMiddleware
from ws_handler import notifier, notify_completion


app = FastAPI()
app.debug = 1

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for WebSocket
    allow_methods=["*"],
    allow_headers=["*"],
)

# Convert Unix timestamp (seconds since epoch) to datetime
def convert_timestamp(timestamp):
    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat()


class SubmissionHandler(KafkaConsumer):
    async def handle_message(self, message):
        # Implement your message handling logic here
        try:
            event = JudgeSubmissionEvent(**message.value)
            # Fetch test cases from test case service
            # test_cases_response = await ServiceClient.get(
            #     service_name="testcase", 
            #     endpoint=f"api/v1/testcase/problem/{event.problem}",
            #     headers={"X-Judger-Secret": "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"}
            # )
            
            # # Extract inputs and outputs from test cases
            # inputs = []
            # outputs = []
            # if isinstance(test_cases_response, str):
            #     test_cases_response = json.loads(test_cases_response)
            # for test_case in test_cases_response.get("data", []):
            #     inputs.append(test_case.get("input", ""))
            #     outputs.append(test_case.get("output", "")) 
            inputs = []
            outputs = []
            for i in range(100):
                inputs.append("2")
                outputs.append("2")      

            judger = Judge(id=event.id, src=event.sourceCode, inputs=inputs, outputs=outputs, time_limit=event.timeLimit, memory_limit=536870912, language=event.language, rule=event.rule)
            rep = await judger.run()
            if event.rule == Rule.ICPC:
                ac = 0
                max_time_limit = 0
                max_memory_limit = 0
                verdict = Verdict.ACCEPT
                for tc in rep:
                    max_time_limit = max(max_time_limit, tc.get("real_time_ms", 0))
                    max_memory_limit = max(max_memory_limit, tc.get("memory_bytes", 0))
                    if str(tc["status"]) != "Accepted":
                        if verdict != Verdict.ACCEPT:
                            continue
                        if str(tc["status"]).startswith("Time Limit Exceeded"):
                            verdict = Verdict.TIME_LIMIT_EXCEED
                        elif str(tc["status"]).startswith("Memory Limit Exceeded"):
                            verdict = Verdict.MEMORY_LIMIT_EXCEED
                        elif str(tc["status"]).startswith("Runtime Error"):
                            verdict = Verdict.RUNTIME_ERROR
                        elif str(tc["status"]).startswith("Wrong Answer"):
                            verdict = Verdict.WRONG_ANSWER
                        else:
                            verdict = Verdict.COMPILE_ERROR
                    else:
                        ac += 1
                message = {
                    "id": event.id, 
                    "verdict": verdict.name,
                    "author": event.author,
                    "contest": event.contest,
                    "problem": event.problem,
                    "execution_time_ms": max_time_limit,
                    "memory_used_bytes": max_memory_limit,
                    "score": (event.score * ac) // max(len(rep), 1),
                    "sent_on": convert_timestamp(event.sent_on),
                    "judged_on": datetime.now(timezone.utc).isoformat(),
                    "startTime": convert_timestamp(event.startTime),
                    "endTime": convert_timestamp(event.endTime),
                    "eventType": "SUBMISSION"
                }
                print(message)
                await notify_completion(submission_id=str(event.id), status=verdict.name, execution_time_ms=max_time_limit, memory_used_bytes=max_memory_limit)
                # await publish_event("submission.update", message)
                # if event.startTime <= event.sent_on and event.sent_on <= event.endTime:
                    # await publish_event("submission.result", message)
            else:
                max_time_limit = 0
                max_memory_limit = 0
                verdict = Verdict.ACCEPT
                for tc in rep:
                    max_time_limit = max(max_time_limit, tc.get("real_time_ms", 0))
                    max_memory_limit = max(max_memory_limit, tc.get("memory_bytes", 0))
                    if str(tc["status"]) != "Accepted":
                        if str(tc["status"]).startswith("Time Limit Exceeded"):
                            verdict = Verdict.TIME_LIMIT_EXCEED
                        elif str(tc["status"]).startswith("Memory Limit Exceeded"):
                            verdict = Verdict.MEMORY_LIMIT_EXCEED
                        elif str(tc["status"]).startswith("Runtime Error"):
                            verdict = Verdict.RUNTIME_ERROR
                        elif str(tc["status"]).startswith("Wrong Answer"):
                            verdict = Verdict.WRONG_ANSWER
                        else:
                            verdict = Verdict.COMPILE_ERROR
                        break
                message = {
                    "id": event.id, 
                    "verdict": verdict.name,
                    "author": event.author,
                    "contest": event.contest,
                    "problem": event.problem,
                    "execution_time_ms": max_time_limit,
                    "memory_used_bytes": max_memory_limit,
                    "score": event.score if verdict == Verdict.ACCEPT else 0,
                    "sent_on": convert_timestamp(event.sent_on),
                    "judged_on": datetime.now(timezone.utc).isoformat(),
                    "startTime": convert_timestamp(event.startTime),
                    "endTime": convert_timestamp(event.endTime),
                    "eventType": "SUBMISSION"
                }
                print(message)
                await notify_completion(submission_id=str(event.id), status=verdict.name, execution_time_ms=max_time_limit, memory_used_bytes=max_memory_limit)
                # await publish_event("submission.update", message)

                # if event.startTime <= event.sent_on and event.sent_on <= event.endTime:
                    # await publish_event("submission.result", message)
        except Exception as e: 
            print(f"Invalid message format: {e}")
            

@app.websocket("/api/ws/submissions/{submission_id}")
async def subscribe_to_submission(websocket: WebSocket, submission_id: str):
    await websocket.accept()
    await notifier.subscribe(submission_id, websocket)
    try:
        while True:
            # This loop keeps the connection alive
            await websocket.receive_text()
    finally:
        await notifier.unsubscribe(submission_id, websocket)


@app.on_event("startup")
async def startup_event():
    # Get configuration from environment variables
    eureka_server = os.getenv("EUREKA_SERVER_URL", "http://localhost:8761/eureka")
    # Initialize eureka client first
    await eureka_client.init_async(
        eureka_server=eureka_server,
        app_name="submission-evaluation-handler",
        instance_port=8088
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