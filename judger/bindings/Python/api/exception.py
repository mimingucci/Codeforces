class JudgeServerException(Exception):
    def __init__(self, message):
        super().__init__()
        self.message = message


class CompileError(JudgeServerException):
    pass


class TokenVerificationFailed(JudgeServerException):
    pass


class JudgeServiceError(JudgeServerException):
    pass
