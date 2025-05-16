import React, { useEffect, useRef } from "react";

import Editor from "@monaco-editor/react";
import CodeSuggestionService from "../services/CodeSuggestionService";
import "../styles/ghostText.css"; // Import the CSS file for ghost text styles
import { snippets } from "./Snippets";
// Template Sources

const cSource =
  '\
// Powered by Judge0\n\
#include <stdio.h>\n\
\n\
int main(void) {\n\
    printf("Hello Judge0!\\n");\n\
    return 0;\n\
}\n\
';

const cppSource =
  '\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << "hello, world" << std::endl;\n\
    return 0;\n\
}\n\
';

const goSource =
  '\
package main\n\
\n\
import "fmt"\n\
\n\
func main() {\n\
    fmt.Println("hello, world")\n\
}\n\
';

const javaSource =
  '\
public class Main {\n\
    public static void main(String[] args) {\n\
        System.out.println("hello, world");\n\
    }\n\
}\n\
';

const javaScriptSource = 'console.log("hello, world");';

const phpSource =
  '\
<?php\n\
print("hello, world\\n");\n\
?>\n\
';

const pythonSource = 'print("hello, world")';

const CodeEditorWindow = ({ onChange, language, code, theme, isLoggedIn }) => {
  const editorRef = useRef(null);
  const suggestionServiceRef = useRef(null);
  const monacoRef = useRef(null);

  // Effect for language settings
  useEffect(() => {
    switch (language) {
      case "C":
        onChange("code", cSource);
        break;
      case "JAVA":
        onChange("code", javaSource);
        break;
      case "JS":
        onChange("code", javaScriptSource);
        break;
      case "PY3":
        onChange("code", pythonSource);
        break;
      case "PHP":
        onChange("code", phpSource);
        break;
      case "GO":
        onChange("code", goSource);
        break;
      default:
        onChange("code", cppSource);
    }
    if (suggestionServiceRef.current && language) {
      suggestionServiceRef.current.updateLanguage(language);
    }
    if (monacoRef.current && editorRef.current) {
      const currentLanguage = defaultLanguage(language);
      
      // Remove existing completion providers for the language
      // monacoRef.current.languages.CompletionItemProvider.register = function() {
      //   return { dispose: () => {} };
      // };

      // Register new snippets for the current language
      if (snippets[currentLanguage]) {
        monacoRef.current.languages.registerCompletionItemProvider(currentLanguage, {
          provideCompletionItems: () => {
            return {
              suggestions: snippets[currentLanguage].map(snippet => ({
                ...snippet,
                kind: monacoRef.current.languages.CompletionItemKind.Snippet
              }))
            };
          }
        });
      }
    }
  }, [language]);

  // Initialize suggestion service
  useEffect(() => {
    if (!suggestionServiceRef.current) {
      suggestionServiceRef.current = new CodeSuggestionService();
    }

    return () => {
      if (suggestionServiceRef.current) {
        suggestionServiceRef.current.dispose();
      }
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register snippets for the current language
    const currentLanguage = defaultLanguage(language);

    // Register snippets for the current language
    if (snippets[currentLanguage]) {
      monaco.languages.registerCompletionItemProvider(currentLanguage, {
        provideCompletionItems: () => {
          return {
            suggestions: snippets[currentLanguage].map(snippet => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Snippet // Use the enum instead of string
            }))
          };
        }
      });
    }

    // Initialize the suggestion service
    if (suggestionServiceRef.current) {
      suggestionServiceRef.current.initialize(editor, monaco, language);
    }

    // Add Ctrl+Space action to trigger suggestions
    editor.addAction({
      id: "show-suggestions",
      label: "Show Code Suggestions",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space],
      run: () => {
        if (suggestionServiceRef.current) {
          const currentCode = editor.getValue();
          suggestionServiceRef.current.fetchSuggestions(currentCode, true);
        }
      },
    });
  };

  const handleEditorChange = (value) => {
    onChange("code", value);
  };

  const defaultLanguage = (language) => {
    switch (language) {
      case "C":
        return "c";
      case "JAVA":
        return "java";
      case "JS":
        return "javascript";
      case "PY3":
        return "python";
      case "PHP":
        return "php";
      case "GO":
        return "go";
      default:
        return "cpp";
    }
  }

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-[500px] shadow-4xl">
      <Editor
        height="100%"
        width={`100%`}
        language={defaultLanguage(language)}
        value={code}
        theme={theme}
        defaultValue={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 16,
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 4,
          padding: { top: 10 },
          scrollBeyondLastLine: true,
          // fixedOverflowWidgets: true,
          // Disable Monaco's built-in suggestions for our custom ones
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          readOnly: !isLoggedIn,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
