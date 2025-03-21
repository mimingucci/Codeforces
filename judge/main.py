from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def helloWorld():
    return "Hello, i'm mimingucci"