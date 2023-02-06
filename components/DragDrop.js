import React from "react";
import { Image } from "antd";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const DragDrop = ({ fileData, setFileData }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef(null);
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileObject = e.dataTransfer.files[0];
      try {
        const result = await toBase64(fileObject);
        setFileData({
          name: fileObject.name,
          // id: uuidv4(),
          createdDate: new Date(),
          updatedDate: new Date(),
          type: fileObject.type,
          // url: result,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const fileObject = e.target.files[0];
      try {
        const result = await toBase64(fileObject);
        setFileData({
          name: fileObject.name,
          createdDate: new Date(),
          updatedDate: new Date(),
          type: fileObject.type,
          // url: result,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </>
  );
};

export default DragDrop;
