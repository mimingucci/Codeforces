import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

const InputIde = ({ customInput, setCustomInput, theme }) => {
  const editorRef = useRef(null);
  function handleChange() {
    // console.log(editorRef.current?.getValue());
    setCustomInput(editorRef.current?.getValue());
  }

  function handleMount(editor) {
    editorRef.current = editor;
    editorRef.current.onDidChangeModelContent(handleChange);
  }
  return (
    <>
      <Editor onMount={handleMount} theme={theme} />
    </>
  );
};

export default InputIde;
