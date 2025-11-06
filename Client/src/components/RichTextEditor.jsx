import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={input.description}
        onChange={handleChange}
      />
    </div>
  );
};

export default RichTextEditor;
