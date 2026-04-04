import React, { useEffect, useRef } from 'react';
import '../styles/ColoredEditor.css';

const ColoredEditor = ({ initialContent = '', onChange, placeholder = 'Start typing...', currentColor = '#ffffff' }) => {
  const editorRef = useRef(null);
  const lastLengthRef = useRef(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
      editorRef.current.innerHTML = initialContent;
      lastLengthRef.current = editorRef.current.textContent.length;
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [initialContent]);

  const wrapNewText = () => {
    const currentLength = editorRef.current.textContent.length;
    const addedLength = currentLength - lastLengthRef.current;
    
    if (addedLength > 0) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      // Get the text node that was just modified
      let textNode = range.endContainer;
      let offset = range.endOffset;
      
      // If we're at the end of a text node, the text was just added
      if (textNode.nodeType === Node.TEXT_NODE && offset > 0) {
        const text = textNode.textContent;
        const newText = text.substring(text.length - addedLength);
        const oldText = text.substring(0, text.length - addedLength);
        
        // Create a span for the new text with the current color
        const span = document.createElement('span');
        span.style.color = currentColor;
        span.textContent = newText;
        
        // Update the original text node
        if (oldText) {
          textNode.textContent = oldText;
          textNode.parentNode.insertBefore(span, textNode.nextSibling);
        } else {
          textNode.parentNode.replaceChild(span, textNode);
        }
        
        // Move cursor to end of span
        range.setStart(span, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      lastLengthRef.current = currentLength;
    }
  };

  const handleInput = (e) => {
    wrapNewText();
    const html = e.currentTarget.innerHTML;
    onChange && onChange(html);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const space = document.createTextNode('  ');
      range.insertNode(space);
      range.setStartAfter(space);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput({ currentTarget: editorRef.current });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const text = (e.clipboardData || window.clipboardData).getData('text');
    
    // Create span with current color for pasted text
    const span = document.createElement('span');
    span.style.color = currentColor;
    span.textContent = text;
    
    range.insertNode(span);
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    
    lastLengthRef.current = editorRef.current.textContent.length;
    handleInput({ currentTarget: editorRef.current });
  };

  return (
    <div className="colored-editor-container">
      <div
        ref={editorRef}
        className="colored-editor"
        contentEditable="true"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{
          caretColor: currentColor,
        }}
      />
      
      <div className="editor-stats">
        <span>{editorRef.current?.textContent?.length || 0} characters</span>
        <span>{editorRef.current?.textContent?.split(/\s+/).filter(w => w).length || 0} words</span>
      </div>
    </div>
  );
};

export default ColoredEditor;
