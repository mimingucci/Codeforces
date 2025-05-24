import React from "react";
import Editor from "@monaco-editor/react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const OutputIde = ({ outputDetails, theme, isProcessing }) => {
  return (
    <div className="w-full h-full bg-white">
      <Box sx={{ p: 1.5, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Output
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          height: "calc(100% - 40px)",
          overflow: "auto",
          borderRadius: 0,
          position: "relative",
        }}
      >
        {isProcessing ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        ) : outputDetails ? (
          <Box sx={{ p: 2 }}>
            {outputDetails.status === "success" ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "success.main",
                  }}
                >
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    Executed Successfully
                  </Typography>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Output:
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: "#f5f5f5",
                    fontFamily: "monospace",
                    mb: 2,
                    whiteSpace: "pre-wrap",
                    minHeight: "100px",
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {outputDetails.output || "No output"}
                </Paper>

                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Execution Time:</strong>{" "}
                    {outputDetails.execution_time_ms} ms
                  </Typography>
                  <Typography variant="body2">
                    <strong>Memory Used:</strong>{" "}
                    {Math.round(outputDetails.memory_used_bytes / 1024)} KB
                  </Typography>
                  <Typography variant="body2">
                    <strong>Exit Code:</strong> {outputDetails.exit_code}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    color: "error.main",
                  }}
                >
                  <ErrorIcon sx={{ mr: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    {outputDetails.message || "Execution Failed"}
                  </Typography>
                </Box>

                {outputDetails.output && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Partial Output:
                    </Typography>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        backgroundColor: "#f5f5f5",
                        fontFamily: "monospace",
                        mb: 2,
                        whiteSpace: "pre-wrap",
                        minHeight: "100px",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {outputDetails.output}
                    </Paper>
                  </>
                )}

                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {outputDetails.execution_time_ms && (
                    <Typography variant="body2">
                      <strong>Time:</strong> {outputDetails.execution_time_ms}{" "}
                      ms
                    </Typography>
                  )}
                  {outputDetails.memory_used_bytes && (
                    <Typography variant="body2">
                      <strong>Memory:</strong>{" "}
                      {Math.round(outputDetails.memory_used_bytes / 1024)} KB
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              Code output will appear here
            </Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default OutputIde;
