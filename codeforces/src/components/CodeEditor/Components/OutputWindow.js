import React from "react";

const OutputWindow = ({
  verdict = null,
  message = null,
  time_limit = null, 
  memoty_limit = null,
  title = null,
}) => {
  const getOutput = () => {
    // If there's no verdict, just show the message (if exists)
    if (!verdict) {
      return message ? (
        <pre className="px-2 py-1 font-normal text-xs text-left text-white">
          {message}
        </pre>
      ) : null;
    }

    // Determine color based on verdict
    const verdictColor = verdict === "ACCEPT" ? "text-green-500" : "text-red-500";
    
    // Build output lines only for fields that exist
    const outputLines = [];
    
    // Always show verdict if it exists
    outputLines.push(`Verdict: ${verdict}`);
    
    // Add time if available
    if (time_limit) {
      outputLines.push(`Time: ${time_limit} ms`);
    }

    // Add memory if available
    if (memoty_limit) {
      outputLines.push(`Memory: ${memoty_limit} bytes`);
    }

    return (
      <pre className={`px-2 py-1 font-normal text-xs ${verdictColor} text-left`}>
        {outputLines.join('\n')}
      </pre>
    );
  };
  return (
    <>
      <h1 className="mt-3 text-left font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        {title || 'Output'}
      </h1>
      <div className="w-full border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-[#1e293b] mt-2 h-full overflow-hidden">
        {(verdict || message) ? getOutput() : null}
      </div>
    </>
  );
};

export default OutputWindow;
