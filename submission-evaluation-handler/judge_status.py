from enum import Enum

class Verdict(str, Enum):
    AC = 'ACCEPT', 
    WA = 'WRONG_ANSWER', 
    TLE = 'TIME_LIMIT_EXCEED', 
    MLE = 'MEMORY_LIMIT_EXCEED', 
    RE = 'RUNTIME_ERROR', 
    CE = 'COMPILE_ERROR'