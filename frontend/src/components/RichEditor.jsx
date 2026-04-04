import React, { useState, useEffect } from 'react';
import '../styles/RichEditor.css';

const RichEditor = ({ initialContent = '', onChange, placeholder = 'Start typing...', textColor = '#ffffff' }) => {
  const [content, setContent] = useState(initialContent);
  const [Language, setLanguage] = useState('text');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    onChange && onChange(value);
  };

  const insertFormatting = (before, after = '') => {
    const textarea = document.getElementById('rich-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newContent);
    onChange && onChange(newContent);
  };

  return (
    <div className="rich-editor-container">
      <div className="editor-toolbar">
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('**', '**')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('*', '*')}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('```\n', '\n```')}
          title="Code Block"
        >
          &lt;&gt;
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('- ', '')}
          title="Bullet Point"
        >
          •
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('1. ', '')}
          title="Numbered List"
        >
          #
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertFormatting('> ', '')}
          title="Quote"
        >
          "
        </button>
      </div>

      <textarea
        id="rich-editor"
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck="true"
        style={{ color: textColor }}
      />

      <div className="editor-stats">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(w => w).length} words</span>
      </div>
    </div>
  );
};

export default RichEditor;
