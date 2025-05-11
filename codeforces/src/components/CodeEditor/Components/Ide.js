import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../general";
import { languageOptions } from "../languageOptions";
import "@vaadin/split-layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmissionApi from "../../../getApi/SubmissionApi";
import HandleCookies from "../../../utils/HandleCookies";

import { defineTheme } from "../defineTheme";
import useKeyPress from "../useKeyPress";
import OutputWindow from "./OutputWindow";
import Input from "./Input";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import InputIde from "./InputIde";
import OutputIde from "./OutputIde";
import { Alert, Button, Typography, Box } from "@mui/material";

var cppSource =
  '\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << "hello, world" << std::endl;\n\
    return 0;\n\
}\n\
';

const Ide = () => {
  const [code, setCode] = useState(cppSource);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // Check authentication status on component mount
  useEffect(() => {
    const token = HandleCookies.getCookie("token");
    setIsLoggedIn(!!token);
  }, []);

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress && isLoggedIn) {
      handleCompile();
    }
  }, [ctrlPress, enterPress, isLoggedIn]);

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

  const handleCompile = async () => {
    if (!isLoggedIn) {
      showErrorToast("Please log in to execute code");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Get the selected language value from languageOptions
      const languageId = language.value.toLowerCase();

      const accessToken = HandleCookies.getCookie("token");

      const response = await SubmissionApi.execute({
        accessToken,
        language: languageId,
        sourceCode: code,
        input: customInput,
      });

      setOutputDetails(response);

      if (response.status === "success") {
        showSuccessToast("Code executed successfully!");
      } else {
        showErrorToast(response.message || "Execution failed");
      }
    } catch (err) {
      console.error("Error executing code:", err);
      setError(err.response?.data?.message || "Something went wrong");
      showErrorToast(err.response?.data?.message || "Failed to execute code");
    } finally {
      setProcessing(false);
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
    toast.success(msg || `Executed Successfully!`, {
      position: "top-right",
      autoClose: 2000,
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
      autoClose: timer ? timer : 3000,
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

      {!isLoggedIn && (
        <Alert
          severity="info"
          sx={{ mb: 2, mx: 4, mt: 2 }}
          action={
            <Button color="inherit" size="small" href="/login">
              LOGIN
            </Button>
          }
        >
          You need to be logged in to execute code
        </Alert>
      )}

      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-4 py-2">
          <button
            onClick={handleCompile}
            disabled={!code || processing || !isLoggedIn}
            className={classnames(
              "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
              !code || processing || !isLoggedIn
                ? "opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            {processing ? "Processing..." : "Compile and Execute"}
          </button>
        </div>
      </div>

      {error && (
        <Box sx={{ px: 4, py: 1 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <div className="px-4 py-4 flex flex-col h-full">
        {/* Top section - Code editor and Input */}
        <vaadin-split-layout>
          <div className="flex flex-col w-[70%] h-full justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={theme.value}
            />
          </div>

          <div className="flex flex-col w-[30%] h-[500px]">
            <InputIde
              customInput={customInput}
              setCustomInput={setCustomInput}
              theme={theme.value}
            />
          </div>
        </vaadin-split-layout>

        {/* Bottom section - Output (full width) */}
        <div style={{ marginTop: "16px" }}>
          <OutputIde
            outputDetails={outputDetails}
            theme={theme.value}
            isProcessing={processing}
          />
        </div>
      </div>
    </>
  );
};

export default Ide;
