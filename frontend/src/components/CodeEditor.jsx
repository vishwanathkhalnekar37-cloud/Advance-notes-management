import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { xml } from '@codemirror/lang-xml';
import { githubDark } from '@uiw/codemirror-theme-github';
import '../styles/CodeEditor.css';

const CodeEditor = ({ content, onChange, language = 'javascript', placeholder = 'Paste your code here...' }) => {
  const [editorValue, setEditorValue] = useState(content || '');
  const [editorHeight, setEditorHeight] = useState(400);
  const containerRef = useRef(null);

  useEffect(() => {
    setEditorValue(content || '');
  }, [content]);

  // Calculate and set the editor height on mount and window resize
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const toolbar = container.querySelector('.code-editor-toolbar');
        const toolbarHeight = toolbar ? toolbar.offsetHeight : 0;
        const containerHeight = container.offsetHeight;
        const availableHeight = containerHeight - toolbarHeight - 40; // 40px padding/margin
        setEditorHeight(Math.max(availableHeight, 300));
      }
    };

    // Calculate after a small delay to ensure DOM is ready
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  const handleChange = (newValue) => {
    setEditorValue(newValue);
    onChange(newValue);
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'json':
        return json();
      case 'html':
        return html();
      case 'python':
        return python();
      case 'xml':
        return xml();
      case 'code':
      case 'javascript':
      default:
        return javascript();
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setEditorValue(formatted);
      onChange(formatted);
      alert('✅ JSON formatted successfully!');
    } catch (e) {
      alert('❌ Invalid JSON: ' + e.message);
    }
  };

  return (
    <div className="code-editor-container" ref={containerRef}>
      {language === 'json' && (
        <div className="code-editor-toolbar">
          <button className="format-btn" onClick={formatJSON}>
            ✨ Format JSON
          </button>
        </div>
      )}

      <div className="codemirror-wrapper" style={{ height: `${editorHeight}px` }}>
        <CodeMirror
          value={editorValue}
          height="100%"
          width="100%"
          theme={githubDark}
          extensions={[getLanguageExtension()]}
          onChange={handleChange}
          className="code-mirror-editor"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
