# main.py
import asyncio
import os
import json
import socket
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, Depends, Request, Header, Body
from service.kafka_consumer import KafkaConsumer
from event import JudgeSubmissionEvent, JudgeVirtualSubmissionEvent
from service.kafka_util import _kafka_producer, publish_event
from judge import Judge, Language, Rule, Verdict
from datetime import datetime, timezone
from service.service_client import ServiceClient
# Add CORS middleware (if needed)
from fastapi.middleware.cors import CORSMiddleware
from jwt_util import JwtUtil
from typing import Optional
from pydantic import BaseModel
from judge import Language

# Define a model for the submission request
class SubmissionRequest(BaseModel):
    sourceCode: str
    input: str
    language: str  # Will be converted to Language enum

app = FastAPI()
app.debug = 1

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for WebSocket
    allow_methods=["*"],
    allow_headers=["*"],
)

jwt_util = JwtUtil(
    public_key_path=os.getenv('JWT_PUBLIC_KEY', '/home/mimingucci/Work/Java/Codeforces/public-key.pem'),
    private_key_path=os.getenv('JWT_PRIVATE_KEY', '/home/mimingucci/Work/Java/Codeforces/private-key.pem')
)

# Convert Unix timestamp (seconds since epoch) to datetime
def convert_timestamp(timestamp):
    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat()


class SubmissionHandler(KafkaConsumer):
    async def handle_message(self, message):
        # Implement your message handling logic here
        try:
            if message.topic == "submission.judge":
                event = JudgeSubmissionEvent(**message.value)
            elif message.topic == "virtual.submission.judge":
                event = JudgeVirtualSubmissionEvent(**message.value)
            else:
                print(f"Unknown topic: {message.topic}")
                return
            
            # Fetch test cases from test case service
            test_cases_response = await ServiceClient.get(
                service_name="testcase", 
                endpoint=f"api/v1/testcase/problem/{event.problem}",
                headers={"X-Judger-Secret": "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"}
            )
            
            # Extract inputs and outputs from test cases
            inputs = []
            outputs = []
            if isinstance(test_cases_response, str):
                test_cases_response = json.loads(test_cases_response)
            for test_case in test_cases_response.get("data", []):
                inputs.append(test_case.get("input", ""))
                outputs.append(test_case.get("output", "")) 

            judger = Judge(id=event.id, src=event.sourceCode, inputs=inputs, outputs=outputs, time_limit=event.timeLimit, memory_limit=event.memoryLimit, language=event.language, rule=event.rule)
            rep = await judger.run_batch()
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
                judge_result = {
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
                await publish_event("submission.update", judge_result)
                if message.topic == "submission.judge":
                    if event.startTime <= event.sent_on and event.sent_on <= event.endTime:
                        await publish_event("submission.result", judge_result)
                else:
                    virtualmessage = {
                        "id": event.id, 
                        "verdict": verdict.name,
                        "author": event.author,
                        "contest": event.contest,
                        "virtualContest": event.virtualContest,
                        "problem": event.problem,
                        "execution_time_ms": max_time_limit,
                        "memory_used_bytes": max_memory_limit,
                        "score": (event.score * ac) // max(len(rep), 1),
                        "sent_on": convert_timestamp(event.sent_on),
                        "judged_on": datetime.now(timezone.utc).isoformat(),
                        "startTime": convert_timestamp(event.startTime),
                        "endTime": convert_timestamp(event.endTime),
                        "actualStartTime": convert_timestamp(event.actualStartTime),
                        "actualEndTime": convert_timestamp(event.actualEndTime),
                        "eventType": "SUBMISSION"
                    }
                    await publish_event("virtual.submission.result", virtualmessage)
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
                judge_result = {
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
                await publish_event("submission.update", judge_result)

                if message.topic == "submission.judge":
                    if event.startTime <= event.sent_on and event.sent_on <= event.endTime:
                        await publish_event("submission.result", judge_result)
                else:
                    virtualmessage = {
                        "id": event.id, 
                        "verdict": verdict.name,
                        "author": event.author,
                        "contest": event.contest,
                        "virtualContest": event.virtualContest,
                        "problem": event.problem,
                        "execution_time_ms": max_time_limit,
                        "memory_used_bytes": max_memory_limit,
                        "score": event.score if verdict == Verdict.ACCEPT else 0,
                        "sent_on": convert_timestamp(event.sent_on),
                        "judged_on": datetime.now(timezone.utc).isoformat(),
                        "startTime": convert_timestamp(event.startTime),
                        "endTime": convert_timestamp(event.endTime),
                        "actualStartTime": convert_timestamp(event.actualStartTime),
                        "actualEndTime": convert_timestamp(event.actualEndTime),
                        "eventType": "SUBMISSION"
                    }
                    await publish_event("virtual.submission.result", virtualmessage)

        except Exception as e: 
            print(f"Invalid message format: {e}")

@app.on_event("startup")
async def startup_event():
    # Get container's hostname - this is the service name in docker-compose
    hostname = socket.gethostname()
    
    # Get the container IP address for registration
    try:
        ip = socket.gethostbyname(hostname)
    except:
        # Fallback to service name if IP resolution fails
        ip = hostname
        
    print(f"Registering service with IP/hostname: {ip}")

    # Get configuration from environment variables
    eureka_server = os.getenv("EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE", "http://localhost:8761/eureka")
    instance_port = int(os.getenv("SERVER_PORT", "8088"))
    
    # Initialize eureka client first
    await eureka_client.init_async(
        eureka_server=eureka_server,
        app_name="submission-evaluation-handler",   
        instance_port=instance_port,
        instance_ip=ip
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

@app.post("/api/v1/submission-evaluation-handler/execute")
async def execute_code(
    request: Request,
    submission_request: SubmissionRequest,
    authorization: Optional[str] = Header(None)
):
    # Check JWT token
    if not authorization or not authorization.startswith("Bearer "):
        return {
            "status": "error",
            "message": "Missing or invalid authorization token",
            "code": 401
        }
    
    token = authorization.replace("Bearer ", "")
    
    # Validate JWT token
    try:
        claims = jwt_util.validate_token(token)
    except Exception as e:
        return {
            "status": "error",
            "message": f"Invalid token: {str(e)}",
            "code": 401
        }
    
    # Convert language string to enum
    try:
        language_enum = Language[submission_request.language.upper()]
    except KeyError:
        return {
            "status": "error",
            "message": f"Unsupported language: {submission_request.language}. Supported languages are: {', '.join([lang.name for lang in Language])}",
            "code": 400
        }
    
    # Set default time and memory limits
    time_limit = 2000  # 2 seconds
    memory_limit = 512 * 1024 * 1024  # 512 MB
    
    try:
        # Execute code
        response = await ServiceClient.post(
            json_data={
                "code": submission_request.sourceCode,
                "input": submission_request.input,
                "output": "",  # No expected output for direct execution
                "time_limit": time_limit,
                "memory_limit": memory_limit,
                "language": language_enum.value
            },
            service_name="judger",
            endpoint="judge",
            headers={
                "X-Judge-Server-Token": "6c3d42616001c43de92e516b0175ccff4c62c83c9ea02e8f022e2ee7e299c53b",
                "Content-Type": "application/json"
            }
        )
        
        # Convert string response to dictionary if needed
        if isinstance(response, str):
            response = json.loads(response)
        
        # Create response with execution details
        result = {
            "status": "success",
            "output": response.get("output", ""),
            "execution_time_ms": response.get("real_time_ms", 0),
            "memory_used_bytes": response.get("memory_bytes", 0),
            "exit_code": response.get("exit_code", 0),
            "code": 200
        }

        if response.get("status") == "Wrong Answer":
            result["output"] = response.get("actual", "")
        
        # Handle error states
        if response.get("status") != "Accepted" and response.get("status") != "Wrong Answer":
            result["status"] = "error"
            result["message"] = response.get("status", "Execution failed")
            if "Time Limit Exceeded" in response.get("status", ""):
                result["code"] = 408  # Request Timeout
            elif "Memory Limit Exceeded" in response.get("status", ""):
                result["code"] = 507  # Insufficient Storage
            elif "Runtime Error" in response.get("status", ""):
                result["code"] = 500  # Internal Server Error
            elif "Compilation Error" in response.get("status", ""):
                result["code"] = 422  # Unprocessable Entity
                result["message"] = response.get("compile_output", "Compilation failed")
            else:
                result["code"] = 500
        
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Execution failed: {str(e)}",
            "code": 500
        }


# uvicorn main:app --host 0.0.0.0 --port 8088 or fastapi dev main.py
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8088)
    app.run()