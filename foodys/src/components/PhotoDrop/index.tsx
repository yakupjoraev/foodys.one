import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DEFAULT_FILES: { id: string; url: string }[] = [];

export function PhotoDrop() {
  const [files, setFiles] =
    useState<{ id: string; url: string }[]>(DEFAULT_FILES);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 12,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        const previews = acceptedFiles.map((file) => ({
          id: file.name,
          url: URL.createObjectURL(file),
          file: file,
        }));
        setFiles(previews);
      }
    },
  });

  useEffect(() => {
    if (files.length === 0) {
      return;
    }
    return () => {
      files.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleDeleteFile = (id: string) => {
    const index = files.findIndex((preview) => preview.id === id);
    if (index === -1) {
      return;
    }

    const nextPreviews = [...files.slice(0, index), ...files.slice(index + 1)];
    setFiles(nextPreviews);
  };

  return (
    <div className="drag-drop">
      <div className="drag-drop__top" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="drag-drop__label">
          <img src="/img/modal/grag-drop.svg" alt="" />
          <p className="drag-drop__label-text">
            Drag&amp;drop your photos here
          </p>
        </div>
      </div>
      <div className="drag-drop__files">
        {files.map((file) => {
          return (
            <div className="drag-drop__file" key={file.id}>
              <img className="drag-drop__file-pic" src={file.url} alt="" />
              <button
                type="button"
                className="drag-drop__file-delete"
                onClick={() => handleDeleteFile(file.id)}
              >
                <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="7.5" fill="#F0F0F0" />
                  <path
                    d="M10 5L7.5 7.5L5 5"
                    stroke="#A8ADB8"
                    strokeWidth={2}
                  />
                  <path
                    d="M5 10L7.5 7.5L10 10"
                    stroke="#A8ADB8"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
      <div className="input__border" />
      <div className="modal-content__btns modal-content__btns--third">
        <button
          type="button"
          className="modal-content__btn modal-content__btn-outline"
        >
          Cancel
        </button>
        <button type="button" className="modal-content__btn">
          Save
        </button>
        <button
          type="button"
          className="modal-content__btn modal-content__btn-preview"
        >
          <img src="/img/icons/eye.svg" alt="preview img" />
          Preview
        </button>
      </div>
    </div>
  );
}
