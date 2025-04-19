# main.py
import asyncio
import os
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, HTTPException
from service.kafka_consumer import KafkaConsumer
from event import JudgeSubmissionEvent
from service.kafka_util import _kafka_producer, publish_event
from judge import Judge, Language, Rule, Verdict
from datetime import datetime, timezone
from service.service_client import ServiceClient

app = FastAPI()
app.debug = 1

# Convert Unix timestamp (seconds since epoch) to datetime
def convert_timestamp(timestamp):
    return datetime.fromtimestamp(timestamp).isoformat()


class SubmissionHandler(KafkaConsumer):
    async def handle_message(self, message):
        # Implement your message handling logic here
        try:
            event = JudgeSubmissionEvent(**message.value)
            print(convert_timestamp(event.startTime) + " - " + convert_timestamp(event.endTime))
            return
            # Fetch test cases from test case service
            test_cases_response = await ServiceClient.get(
                service_name="testcase", 
                endpoint=f"/api/v1/testcase/problem/{event.problem}"
            )
            
            # Extract inputs and outputs from test cases
            inputs = []
            outputs = []
            for test_case in test_cases_response.get("data", []):
                inputs.append(test_case.get("input", ""))
                outputs.append(test_case.get("output", ""))

            judger = Judge(src=event.sourceCode, inputs=inputs, outputs=outputs, time_limit=event.timeLimit, memory_limit=event.memoryLimit, language=event.language, rule=Rule.DEFAULT)
            rep = await judger.run()
            if event.rule == Rule.ICPC:
                ac = 0
                max_time_limit, max_memory_limit, verdict = 0, 0, Verdict.ACCEPT
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
                await publish_event("submission.result", {
                    "id": event.id, 
                    "verdict": verdict,
                    "author": event.author,
                    "contest": event.contest,
                    "problem": event.problem,
                    "execution_time_ms": max_time_limit,
                    "memory_used_bytes": max_memory_limit,
                    "score": (event.score * ac) // max(len(rep), 1),
                    "judged_on": datetime.now(timezone.utc).isoformat()
                })
            else:
                max_time_limit, max_memory_limit, verdict = 0, 0, Verdict.ACCEPT
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
                await publish_event("submission.result", {
                    "id": event.id, 
                    "verdict": verdict,
                    "author": event.author,
                    "contest": event.contest,
                    "problem": event.problem,
                    "execution_time_ms": max_time_limit,
                    "memory_used_bytes": max_memory_limit,
                    "score": event.score if verdict == Verdict.ACCEPT else 0,
                    "judged_on": datetime.now(timezone.utc).isoformat()
                })
        except Exception as e: 
            print(f"Invalid message format: {e}")


@app.on_event("startup")
async def startup_event():
    # Get configuration from environment variables
    eureka_server = os.getenv("EUREKA_SERVER_URL", "http://localhost:8761/eureka")
    # Initialize eureka client first
    await eureka_client.init_async(
        eureka_server=eureka_server,
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