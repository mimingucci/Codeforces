import React from "react";

const Overlay = ({ setShow, onDelete }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
      }}
      onClick={() => {
        setShow(false);
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <p>Are you sure for deleting blog?</p>
        <div className="flex justify-center text-white gap-5">
          <button
            onClick={() => setShow(false)}
            className="bg-green-600 p-2 rounded-md hover:bg-green-800"
          >
            Cancer
          </button>
          <button
            onClick={() => onDelete()}
            className="bg-red-600 p-2 rounded-md hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
