import React, { useRef } from 'react';
import { toast } from "react-toastify";
import { classnames } from "../general";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileUpload = ({ language, onFileUpload, isLoggedIn }) => {
  const fileInputRef = useRef(null);

  const getFileExtension = (lang) => {
    switch (lang) {
      case "CPP": return ".cpp";
      case "C": return ".c";
      case "JAVA": return ".java";
      case "JS": return ".js";
      case "PY3": return ".py";
      case "GO": return ".go";
      case "PHP": return ".php";
      default: return ".txt";
    }
  };

  const getAcceptedTypes = (lang) => {
    switch (lang) {
      case "CPP": return ".cpp,.h,.hpp";
      case "C": return ".c,.h";
      case "JAVA": return ".java";
      case "JS": return ".js,.ts,.jsx,.tsx";
      case "PY3": return ".py";
      case "GO": return ".go";
      case "PHP": return ".php";
      default: return ".txt";
    }
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to upload files", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 1MB)
  if (file.size > 1024 * 1024) {
    toast.error("File too large. Maximum size is 1MB.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }
    
    const fileExt = `.${file.name.split('.').pop().toLowerCase()}`;
    const acceptedTypes = getAcceptedTypes(language).split(',');
    
    if (!acceptedTypes.includes(fileExt)) {
      toast.error(`Invalid file type. Please upload ${getAcceptedTypes(language)} for ${language}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        onFileUpload(fileContent);
        toast.success(`File "${file.name}" uploaded successfully!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`Failed to read file: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file", {
        position: "top-right",
        autoClose: 3000,
      });
    };
    
    reader.readAsText(file);
    // Reset file input to allow uploading the same file again
    e.target.value = null;
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={getAcceptedTypes(language)}
        style={{ display: 'none' }}
        data-testid="file-upload-input"
      />
      <button
        onClick={handleClick}
        disabled={!isLoggedIn}
        className={classnames(
          "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 flex items-center",
          !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
        )}
        title={isLoggedIn ? `Upload ${language} code file` : "Log in to upload files"}
      >
        <UploadFileIcon style={{ marginRight: '4px' }} fontSize="small" />
        Upload
      </button>
    </>
  );
};

export default FileUpload;