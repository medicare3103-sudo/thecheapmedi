import React, { useRef, useEffect, useState } from 'react';

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState(null);

  // Sync value from parent props to editor HTML content
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
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  // Save current text selection before opening modal
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }
  };

  const openLinkModal = () => {
    saveSelection();
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const confirmLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }
    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    editorRef.current?.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      const anchorHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${finalUrl}</a>`;
      document.execCommand('insertHTML', false, anchorHtml);
    } else {
      document.execCommand('createLink', false, finalUrl);
      const anchor = sel?.anchorNode?.parentElement;
      if (anchor && anchor.tagName === 'A') {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    }
    handleInput();
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const toolbarButtons = [
    { icon: 'bi-type-bold', cmd: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: 'bi-type-italic', cmd: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: 'bi-type-underline', cmd: 'underline', title: 'Underline (Ctrl+U)' },
  ];

  return (
    <div className="rte-wrapper">
      {/* Editor Card */}
      <div className="rich-text-editor border rounded-4 overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="rich-text-editor-toolbar d-flex align-items-center gap-1 px-3 py-2 border-bottom">
          {/* Formatting buttons */}
          {toolbarButtons.map(btn => (
            <button
              key={btn.cmd}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand(btn.cmd); }}
              className="rte-btn"
              title={btn.title}
            >
              <i className={`bi ${btn.icon}`}></i>
            </button>
          ))}

          <div className="rte-divider"></div>

          {/* Link buttons */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); openLinkModal(); }}
            className="rte-btn"
            title="Insert Link"
          >
            <i className="bi bi-link-45deg fs-5"></i>
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('unlink'); }}
            className="rte-btn"
            title="Remove Link"
          >
            <i className="bi bi-link"></i>
          </button>

          <div className="rte-divider"></div>

          {/* List */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
            className="rte-btn"
            title="Bullet List"
          >
            <i className="bi bi-list-ul"></i>
          </button>

          {/* Spacer + char count */}
          <div className="ms-auto">
            <span className="rte-char-count">
              {editorRef.current?.innerText?.length || 0} chars
            </span>
          </div>
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="rich-text-editor-content p-4"
          style={{
            minHeight: '180px',
            outline: 'none',
            fontSize: '0.95rem',
            lineHeight: '1.75',
            color: '#1e293b'
          }}
          placeholder={placeholder || 'Start writing the product description...'}
        />
      </div>

      {/* Custom Link URL Modal */}
      {showLinkModal && (
        <div className="rte-link-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="rte-link-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rte-link-modal-header">
              <div className="d-flex align-items-center gap-2">
                <div className="rte-link-icon-wrap">
                  <i className="bi bi-link-45deg"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Insert Link</h6>
                  <small style={{ color: '#64748b' }}>Paste or type a URL below</small>
                </div>
              </div>
              <button className="rte-close-btn" onClick={() => setShowLinkModal(false)} type="button">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="rte-link-modal-body">
              <div className="rte-url-input-wrap">
                <span className="rte-url-prefix">
                  <i className="bi bi-globe2"></i>
                </span>
                <input
                  type="url"
                  className="rte-url-input"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmLink(); } if (e.key === 'Escape') setShowLinkModal(false); }}
                  autoFocus
                />
              </div>
            </div>

            <div className="rte-link-modal-footer">
              <button type="button" className="rte-cancel-btn" onClick={() => setShowLinkModal(false)}>
                Cancel
              </button>
              <button type="button" className="rte-confirm-btn" onClick={confirmLink} disabled={!linkUrl.trim()}>
                <i className="bi bi-link-45deg me-1"></i> Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
