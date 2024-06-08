import { useState, useRef, useEffect } from "react";
import HandleCookies from "../../utils/HandleCookies";
import UserApi from "../../getApi/UserApi";
export default function ImageUploader({ user, isHome = false }) {
  // FIles States
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  // FIle Picker Ref because we are not useing the standard File picker input
  const filePicekerRef = useRef(null);

  function previewFile(e) {
    // Reading New File (open file Picker Box)
    const reader = new FileReader();

    // Gettting Selected File (user can select multiple but we are choosing only one)
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
      setAvatar(selectedFile);
    }

    // As the File loaded then set the stage as per the file type
    reader.onload = (readerEvent) => {
      setImagePreview(readerEvent.target.result);
    };
  }

  function clearFiles() {
    setImagePreview(null);
    setAvatar(null);
  }

  function handleUploadAvatar() {
    UserApi.unsetImage(HandleCookies.getCookie("accessToken"))
      .then(() =>
        UserApi.uploadImage({
          file: avatar,
          accessToken: HandleCookies.getCookie("accessToken"),
        })
      )
      .then(() => window.location.replace("/profile/" + user?.username))
      .catch((err) => alert("Something went wrong!!!"));
  }

  return (
    <div>
      <div className="btn-container">
        <input
          ref={filePicekerRef}
          accept="image/*"
          onChange={previewFile}
          type="file"
          hidden
        />
        {isHome && (
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => filePicekerRef.current.click()}
          >
            Change
          </button>
        )}
        {imagePreview && (
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 mx-3 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={clearFiles}
          >
            Cancer
          </button>
        )}
        {imagePreview && (
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={handleUploadAvatar}
          >
            Upload
          </button>
        )}
      </div>

      <div className="preview">
        {imagePreview != null ? (
          <img src={imagePreview} alt="" />
        ) : (
          <img src={user?.avatar} />
        )}
      </div>
    </div>
  );
}
