import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { formatFileSize } from '../utils/formatters';

const FileUpload = ({ onTextExtracted, onError, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const processFile = (file) => {
    if (!file) return;

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'txt') {
      onError?.(
        `Unsupported file type ".${extension}". Only plain text (.txt) files are currently supported.`
      );
      return;
    }

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      onError?.('File is too large. Please select a text file smaller than 1 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const textContent = event.target.result;
        if (!textContent || textContent.trim().length === 0) {
          onError?.('The selected file is empty. Please select a file containing text.');
          return;
        }

        setCurrentFile({
          name: file.name,
          size: file.size
        });

        onTextExtracted(textContent);
      } catch (err) {
        console.error('File read error:', err);
        onError?.('Failed to read file content. Please check the file formatting.');
      }
    };

    reader.onerror = () => {
      onError?.('Error reading text file from disk.');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setCurrentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card file-upload-card">
      <div className="card-header">
        <div className="card-title-group">
          <Upload size={18} className="card-title-icon" />
          <h3 className="card-title">Upload Text Document</h3>
        </div>
        <span className="badge-tag">TXT supported</span>
      </div>

      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        <div className="dropzone-content">
          <Upload size={32} className="dropzone-icon" />
          <p className="dropzone-primary-text">
            <strong>Click to upload</strong> or drag and drop a .txt file
          </p>
          <p className="dropzone-hint">Plain text files up to 1 MB</p>
        </div>
      </div>

      {currentFile && (
        <div className="uploaded-file-banner">
          <div className="file-info-group">
            <FileText size={18} className="text-primary" />
            <span className="file-name">{currentFile.name}</span>
            <span className="file-size">({formatFileSize(currentFile.size)})</span>
          </div>
          <button
            type="button"
            className="btn-remove-file"
            onClick={clearFile}
            title="Clear uploaded file"
            aria-label="Remove uploaded file"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
