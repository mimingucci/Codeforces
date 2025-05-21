class CodeSuggestionService {
  constructor(apiUrl = "http://localhost:8000") {
    this.apiUrl = apiUrl;
    this.monaco = null;
    this.editor = null;
    this.model = null;
    this.language = null;
    this.suggestionWidget = null;
    this.currentSuggestion = null;
    this.disposables = [];
    this.lastRequestId = 0;
  }

  initialize(editor, monaco, language) {
    if (this.disposables.length) {
      this.dispose();
    }

    this.monaco = monaco;
    this.editor = editor;
    this.language = language;
    this.model = editor.getModel();

    // Register Tab key to accept suggestion
    this.disposables.push(
      editor.addCommand(
        monaco.KeyMod.Shift | monaco.KeyCode.Tab,
        () => {
          if (this.currentSuggestion) {
            this.acceptSuggestion();
            return true; // Prevent default Tab behavior
          }
          return false; // Allow default Tab behavior
        },
        // Condition: only if we have an active suggestion
        () => !!this.currentSuggestion
      )
    );

    // Listen for content changes only to clear existing suggestions
    this.disposables.push(
      editor.onDidChangeModelContent(() => {
        if (this.currentSuggestion) {
          this.clearSuggestion();
        }
      })
    );

    // Listen for cursor position changes to clear suggestions
    this.disposables.push(
      editor.onDidChangeCursorPosition(() => {
        if (this.currentSuggestion) {
          this.clearSuggestion();
        }
      })
    );
  }

  // The fetch function now takes the code directly instead of reading from editor
  async fetchSuggestions(code, force = false) {
    const currentRequestId = ++this.lastRequestId;

    if (!code || code.trim().length === 0) {
      return;
    }

    const position = this.editor.getPosition();
    if (!position) return;

    try {
      // Remove any existing loading indicator
      this.removeLoadingIndicator();

      // Add loading indicator as a DOM element
      this.addLoadingIndicator(position);

      // Get code from start to current cursor position
      const codeUntilCursor = this.getCodeUntilCursor(position);

      const response = await fetch(`${this.apiUrl}/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeUntilCursor,
          max_length: 50,
          temperature: 0.5,
          language: this.language || "cpp",
        }),
      });

      // If another request has been made, ignore this one
      if (currentRequestId !== this.lastRequestId) {
        this.removeLoadingIndicator();
        return;
      }

      if (!response.ok) {
        console.error("Failed to get suggestion:", await response.text());
        this.removeLoadingIndicator();
        return;
      }

      const data = await response.json();
      // Remove loading indicator
      this.removeLoadingIndicator();

      const newParts = this.findNewCodeParts(code, data.suggestion);
      if (newParts) {
        this.showSuggestion(data.suggestion);
        this.showSuggestionNotification();
      }
    } catch (error) {
      console.error("Error getting code suggestion:", error);
      // Remove loading indicator
      this.removeLoadingIndicator();
    } 
  }

  addLoadingIndicator(position) {
    // Get coordinates for position
    const coords = this.editor.getScrolledVisiblePosition(position);
    
    // Create the loading element
    const loadingElement = document.createElement('div');
    loadingElement.id = 'suggestion-loading-indicator';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>'; // Use a spinner instead of dot
    loadingElement.style.position = 'absolute';
    loadingElement.style.left = (coords.left + 10) + 'px';
    loadingElement.style.top = coords.top + 'px';
    loadingElement.style.zIndex = '10000';
    
    // Add to editor's container
    const editorContainer = this.editor._domElement;
    editorContainer.appendChild(loadingElement);
  }

  removeLoadingIndicator() {
    const indicator = document.getElementById('suggestion-loading-indicator');
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  getCodeUntilCursor(position) {
    if (!this.model) return '';
    
    // Get all lines up to the current position
    const lines = [];
    for (let i = 1; i <= position.lineNumber; i++) {
      const lineContent = this.model.getLineContent(i);
      if (i === position.lineNumber) {
        // For the current line, only take content up to the cursor
        lines.push(lineContent.substring(0, position.column - 1));
      } else {
        lines.push(lineContent);
      }
    }
    
    return lines.join('\n');
  }

  findNewCodeParts(currentCode, suggestion) {
    const currentLines = currentCode.split('\n');
    const suggestionLines = suggestion.split('\n');
    const newParts = [];

    let i = 0, j = 0;
    while (i < currentLines.length && j < suggestionLines.length) {
      if (currentLines[i].trim() === suggestionLines[j].trim()) {
        i++;
        j++;
      } else {
        // Found a difference, collect the new part
        const startLine = j;
        while (j < suggestionLines.length && 
               currentLines[i]?.trim() !== suggestionLines[j].trim()) {
          j++;
        }
        newParts.push({
          startLine: startLine,
          endLine: j - 1,
          content: suggestionLines.slice(startLine, j).join('\n')
        });
      }
    }

    // Add any remaining lines from suggestion as new parts
    if (j < suggestionLines.length) {
      newParts.push({
        startLine: j,
        endLine: suggestionLines.length - 1,
        content: suggestionLines.slice(j).join('\n')
      });
    }

    return newParts;
  }

  showSuggestionNotification() {
    // Add a temporary, more visible notification
    const position = this.editor.getPosition();
    const notificationDecoration = this.editor.createDecorationsCollection([
      {
        range: new this.monaco.Range(
          position.lineNumber,
          1,
          position.lineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          className: "suggestion-line-highlight",
          glyphMarginClassName: "suggestion-glyph",
          overviewRuler: {
            color: "#007acc",
            position: this.monaco.editor.OverviewRulerLane.Right,
          },
        },
      },
    ]);

    // Remove notification after 1.5 seconds
    setTimeout(() => {
      notificationDecoration.clear();
    }, 1500);
  }

  showSuggestion(suggestion) {
    if (!this.editor || !this.monaco) return;

    const position = this.editor.getPosition();
    if (!position) return;

    // Clear any existing suggestion
    this.clearSuggestion();

    // Store the current suggestion
    this.currentSuggestion = {
      text: suggestion,
      position: { ...position }, // Clone position
    };

    // Add ghost text decoration to show suggestion - make it more visible
    const decorations = this.editor.createDecorationsCollection([
      {
        range: new this.monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          after: {
            content: suggestion,
            inlineClassName: "monaco-ghost-text",
            // Add these properties for better visibility
            fontWeight: "normal",
            fontStyle: "italic",
            marginLeft: "0px",
          },
          showIfCollapsed: true, // Show even if the range is collapsed
          isWholeLine: false, // Don't extend to whole line
          className: "", // No extra CSS class
        },
      },
    ]);

    this.suggestionWidget = decorations;

    // Log to verify suggestion is received and shown
    console.log("Showing suggestion:", suggestion);
  }

  clearSuggestion() {
    if (this.suggestionWidget) {
      this.suggestionWidget.clear();
      this.suggestionWidget = null;
    }
    this.currentSuggestion = null;
  }

  acceptSuggestion() {
    if (!this.currentSuggestion || !this.editor) return;

    const { text, position } = this.currentSuggestion;

    // Clear the suggestion first
    this.clearSuggestion();

    // Insert the suggestion text at the current position
    this.editor.executeEdits("suggestion", [
      {
        range: new this.monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: text,
        forceMoveMarkers: true,
      },
    ]);

    // Move cursor to end of inserted text
    this.editor.setPosition({
      lineNumber: position.lineNumber,
      column: position.column + text.length,
    });
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.clearSuggestion();
    if (this.loadingDecoration) {
      this.loadingDecoration.clear();
      this.loadingDecoration = null;
    }
  }

  updateLanguage(language) {
    this.language = language;
  }
}

export default CodeSuggestionService;
