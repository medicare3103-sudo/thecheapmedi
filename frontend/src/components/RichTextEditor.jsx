import React, { useRef, useEffect, useState } from 'react';

const BLOCK_FORMATS = [
  { label: 'Paragraph',     tag: 'p',   style: {} },
  { label: 'Heading 1',     tag: 'h1',  style: { fontWeight: '700', fontSize: '1.8rem' } },
  { label: 'Heading 2',     tag: 'h2',  style: { fontWeight: '700', fontSize: '1.5rem' } },
  { label: 'Heading 3',     tag: 'h3',  style: { fontWeight: '700', fontSize: '1.25rem' } },
  { label: 'Heading 4',     tag: 'h4',  style: { fontWeight: '600', fontSize: '1.1rem' } },
  { label: 'Heading 5',     tag: 'h5',  style: { fontWeight: '600', fontSize: '0.95rem' } },
  { label: 'Heading 6',     tag: 'h6',  style: { fontWeight: '600', fontSize: '0.85rem' } },
  { label: 'Preformatted',  tag: 'pre', style: { fontFamily: 'monospace', fontSize: '0.88rem', background: '#f1f5f9', padding: '10px', borderRadius: '6px' } },
];

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [activeBlock, setActiveBlock] = useState('Paragraph');
  const blockMenuRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Close block menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (blockMenuRef.current && !blockMenuRef.current.contains(e.target)) {
        setShowBlockMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      detectActiveBlock();
    }
  };

  const detectActiveBlock = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node = sel.anchorNode;
    while (node && node !== editorRef.current) {
      const tag = node.nodeName?.toLowerCase();
      const found = BLOCK_FORMATS.find(f => f.tag === tag);
      if (found) { setActiveBlock(found.label); return; }
      node = node.parentNode;
    }
    setActiveBlock('Paragraph');
  };

  const execCommand = (command, val = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const applyBlock = (format) => {
    editorRef.current?.focus();
    if (format.tag === 'pre') {
      document.execCommand('formatBlock', false, 'pre');
    } else {
      document.execCommand('formatBlock', false, format.tag);
    }
    setActiveBlock(format.label);
    setShowBlockMenu(false);
    handleInput();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) setSavedSelection(sel.getRangeAt(0).cloneRange());
  };

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
    if (!linkUrl.trim()) { setShowLinkModal(false); return; }
    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
    editorRef.current?.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.isCollapsed) {
      document.execCommand('insertHTML', false, `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${finalUrl}</a>`);
    } else {
      document.execCommand('createLink', false, finalUrl);
      const anchor = sel?.anchorNode?.parentElement;
      if (anchor?.tagName === 'A') { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
    }
    handleInput();
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const charCount = editorRef.current?.innerText?.replace(/\n/g, '').length || 0;

  return (
    <div className="rte-wrapper">
      <div className="rich-text-editor border rounded-4 overflow-hidden bg-white">

        {/* ── Toolbar ── */}
        <div className="rich-text-editor-toolbar d-flex align-items-center flex-wrap gap-1 px-3 py-2 border-bottom">

          {/* Block Format Dropdown */}
          <div className="rte-block-dropdown" ref={blockMenuRef}>
            <button
              type="button"
              className="rte-block-trigger"
              onClick={() => setShowBlockMenu(v => !v)}
              title="Text Format"
            >
              <span className="rte-block-label">{activeBlock}</span>
              <i className={`bi bi-chevron-${showBlockMenu ? 'up' : 'down'} ms-1`} style={{ fontSize: '0.65rem' }}></i>
            </button>

            {showBlockMenu && (
              <div className="rte-block-menu">
                {BLOCK_FORMATS.map(fmt => (
                  <button
                    key={fmt.tag}
                    type="button"
                    className={`rte-block-item ${activeBlock === fmt.label ? 'active' : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); applyBlock(fmt); }}
                  >
                    <span style={fmt.style}>{fmt.label}</span>
                    {fmt.tag.startsWith('h') && (
                      <span className="rte-block-shortcut">
                        {`Shift+Alt+${fmt.tag[1] === 'p' ? '7' : fmt.tag[1]}`}
                      </span>
                    )}
                    {fmt.tag === 'p' && <span className="rte-block-shortcut">Shift+Alt+7</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rte-divider"></div>

          {/* Text Style */}
          <button type="button" className="rte-btn" title="Bold (Ctrl+B)" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}>
            <i className="bi bi-type-bold"></i>
          </button>
          <button type="button" className="rte-btn" title="Italic (Ctrl+I)" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}>
            <i className="bi bi-type-italic"></i>
          </button>
          <button type="button" className="rte-btn" title="Underline (Ctrl+U)" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}>
            <i className="bi bi-type-underline"></i>
          </button>
          <button type="button" className="rte-btn" title="Strikethrough" onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }}>
            <i className="bi bi-type-strikethrough"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Lists */}
          <button type="button" className="rte-btn" title="Bullet List" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}>
            <i className="bi bi-list-ul"></i>
          </button>
          <button type="button" className="rte-btn" title="Numbered List" onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}>
            <i className="bi bi-list-ol"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Blockquote */}
          <button
            type="button"
            className="rte-btn"
            title="Blockquote"
            onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'blockquote'); handleInput(); }}
          >
            <i className="bi bi-quote"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Alignment */}
          <button type="button" className="rte-btn" title="Align Left" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }}>
            <i className="bi bi-text-left"></i>
          </button>
          <button type="button" className="rte-btn" title="Align Center" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }}>
            <i className="bi bi-text-center"></i>
          </button>
          <button type="button" className="rte-btn" title="Align Right" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyRight'); }}>
            <i className="bi bi-text-right"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Link */}
          <button type="button" className="rte-btn" title="Insert Link" onMouseDown={(e) => { e.preventDefault(); openLinkModal(); }}>
            <i className="bi bi-link-45deg fs-5"></i>
          </button>
          <button type="button" className="rte-btn" title="Remove Link" onMouseDown={(e) => { e.preventDefault(); execCommand('unlink'); }}>
            <i className="bi bi-link"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Horizontal Rule */}
          <button type="button" className="rte-btn" title="Insert Horizontal Line" onMouseDown={(e) => { e.preventDefault(); execCommand('insertHorizontalRule'); }}>
            <i className="bi bi-dash-lg"></i>
          </button>

          {/* Clear Formatting */}
          <button type="button" className="rte-btn" title="Clear Formatting" onMouseDown={(e) => { e.preventDefault(); execCommand('removeFormat'); }}>
            <i className="bi bi-eraser"></i>
          </button>

          <div className="rte-divider"></div>

          {/* Undo / Redo */}
          <button type="button" className="rte-btn" title="Undo (Ctrl+Z)" onMouseDown={(e) => { e.preventDefault(); execCommand('undo'); }}>
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          <button type="button" className="rte-btn" title="Redo (Ctrl+Y)" onMouseDown={(e) => { e.preventDefault(); execCommand('redo'); }}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>

          {/* Char count */}
          <div className="ms-auto">
            <span className="rte-char-count">{charCount} chars</span>
          </div>
        </div>

        {/* ── Editable Area ── */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyUp={detectActiveBlock}
          onMouseUp={detectActiveBlock}
          className="rich-text-editor-content p-4"
          style={{
            minHeight: '200px',
            outline: 'none',
            fontSize: '0.95rem',
            lineHeight: '1.75',
            color: '#1e293b'
          }}
          placeholder={placeholder || 'Start writing the product description...'}
        />
      </div>

      {/* ── Custom Link Modal ── */}
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
                <span className="rte-url-prefix"><i className="bi bi-globe2"></i></span>
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
              <button type="button" className="rte-cancel-btn" onClick={() => setShowLinkModal(false)}>Cancel</button>
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
