import os
import pwd
import grp

JUDGER_WORKSPACE_BASE = "/submission"
LOG_BASE = "/log"

COMPILER_LOG_PATH = os.path.join(LOG_BASE, "compile.log")
JUDGER_LOG_PATH = os.path.join(LOG_BASE, "judger.log")
SERVER_LOG_PATH = os.path.join(LOG_BASE, "server.log")

RUN_USER_UID = pwd.getpwnam("runner").pw_uid
RUN_GROUP_GID = grp.getgrnam("runner").gr_gid

COMPILER_USER_UID = pwd.getpwnam("compiler").pw_uid
COMPILER_GROUP_GID = grp.getgrnam("compiler").gr_gid

TEST_CASE_DIR = "/test_case"