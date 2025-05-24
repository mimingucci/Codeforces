// src/components/TagsInput.js
import { useEffect, useState } from "react";

function TagsInput({ initTags = [], active = true, setTags }) {
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...initTags, value]);
    e.target.value = "";
  }

  function removeTag(index) {
    setTags(initTags.filter((el, i) => i !== index));
  }

  return (
    <div className="tags-input-container">
      {initTags.map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          {active && (
            <span className="close" onClick={() => removeTag(index)}>
              &times;
            </span>
          )}
        </div>
      ))}
      {active && (
        <input
          onKeyDown={handleKeyDown}
          type="text"
          className="tags-input"
          placeholder="Type somthing"
        />
      )}
    </div>
  );
}

export default TagsInput;
