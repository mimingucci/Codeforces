import React, { useEffect, useState, useRef } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import { classnames } from "../general";
import { languageOptions } from "../languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../defineTheme";
import useKeyPress from "../useKeyPress";
import OutputWindow from "./OutputWindow";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import HandleCookies from "../../../utils/HandleCookies";
import SubmissionApi from "../../../getApi/SubmissionApi";

var cppSource =
  '\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << "hello, world" << std::endl;\n\
    return 0;\n\
}\n\
';
let tcip = "";
let tcop = "";
const Landing = ({ sampleinput = "", sampleoutput = "", problem = "" }) => {
  const [code, setCode] = useState(cppSource);
  const [verdict, setVerdict] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  tcip = sampleinput.trim();
  tcop = sampleoutput.trim();
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleSubmit = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      showErrorToast("Please login to submit your code");
      return;
    }
    
    try {
      // Submit code to backend and get submission ID
      const submission = await SubmissionApi.submit({
        language: "CPP",
        sourceCode: code,
        problem: "1913822452007993344",
        token: accessToken,
      });
      
      if (!submission || submission.code != "200") {
        showErrorToast("Failed to create submission");
        return;
      }
      
      // Establish WebSocket connection to track judging progress
      const submissionId = submission.data.id.toString();
      const wsProtocol = 'ws:';
      const wsHost = "localhost:8080";

      const ws = new WebSocket(`${wsProtocol}//${wsHost}/api/ws/submissions/${submissionId}`);
      
      // Set up websocket event handlers
      ws.onopen = () => {
        showSuccessToast("Connected to judge service");
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch(data.type) {
          case "test_case_update":
            // Update progress UI
            setVerdict({
              message: `Running on testcase ${data.test_number}`
            });
            break;
            
          case "test_case_completion":
            ws.close();
            setVerdict({
              status: data?.status, 
              execution_time_ms: data?.execution_time_ms,
              memory_used_bytes: data?.memory_used_bytes
            });
            break;
        }
      };
      
      ws.onerror = (error) => {
        showErrorToast("WebSocket error occurred");
      };
      
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
      
    } catch (err) {
      showErrorToast(err.message || "Error submitting code");
    }
  };

  function handleThemeChange(th) {
    const theme = th;

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-4 py-2">
          <button
            onClick={handleSubmit}
            className={classnames(
              `border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 flex-shrink-0 bg-green-500`
            )}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col h-[500px]">
          <OutputWindow
            verdict={verdict?.status}
            message={verdict?.message}
            time_limit={verdict?.execution_time_ms}
            memoty_limit={verdict?.memory_used_bytes}
            title={"Verdict"}
          />
        </div>
      </div>
    </>
  );
};
export default Landing;
