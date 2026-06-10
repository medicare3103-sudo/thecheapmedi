import React, { useRef, useEffect } from 'react';

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  // Sync value from parent props to editor HTML content (one-way initialization/updates)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Enter the URL (e.g. https://google.com):");
    if (url) {
      // Ensure url starts with http/https
      let finalUrl = url;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      
      const selection = window.getSelection();
      if (selection.isCollapsed) {
        // If nothing is selected, insert a clickable text of the URL
        const anchorHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        document.execCommand("insertHTML", false, anchorHtml);
      } else {
        document.execCommand("createLink", false, finalUrl);
        // Force newly created link to open in new tab
        const anchor = selection.anchorNode.parentElement;
        if (anchor && anchor.tagName === 'A') {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
      }
      handleInput();
    }
  };

  return (
    <div className="rich-text-editor border rounded-3 overflow-hidden bg-white shadow-xs">
      {/* Editor Action Toolbar */}
      <div className="rich-text-editor-toolbar bg-light p-2 border-bottom d-flex gap-2 align-items-center">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="btn btn-sm btn-outline-secondary px-2.5 py-1 d-flex align-items-center"
          title="Bold"
          style={{ border: '1px solid #cbd5e1' }}
        >
          <i className="bi bi-type-bold fs-6"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="btn btn-sm btn-outline-secondary px-2.5 py-1 d-flex align-items-center"
          title="Italic"
          style={{ border: '1px solid #cbd5e1' }}
        >
          <i className="bi bi-type-italic fs-6"></i>
        </button>
        <div className="vr bg-secondary opacity-25 mx-1" style={{ height: '20px' }}></div>
        <button
          type="button"
          onClick={addLink}
          className="btn btn-sm btn-outline-secondary px-2 py-1 d-flex align-items-center"
          title="Insert Link"
          style={{ border: '1px solid #cbd5e1' }}
        >
          <i className="bi bi-link-45deg fs-5"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('unlink')}
          className="btn btn-sm btn-outline-secondary px-2 py-1 d-flex align-items-center"
          title="Remove Link"
          style={{ border: '1px solid #cbd5e1' }}
        >
          <i className="bi bi-slash-circle fs-6"></i>
        </button>
      </div>
      
      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-text-editor-content p-3 bg-white"
        style={{ 
          minHeight: '200px', 
          outline: 'none', 
          textAlign: 'left',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}
        placeholder={placeholder || "Start typing details..."}
      />
    </div>
  );
}

export default RichTextEditor;
