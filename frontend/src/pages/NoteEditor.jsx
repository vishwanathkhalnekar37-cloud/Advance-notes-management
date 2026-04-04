import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { RichEditor, Modal, PasswordModal, Button } from '../components';
import ColoredEditor from '../components/ColoredEditor';
import CodeEditor from '../components/CodeEditor';
import ViewPanel from '../components/ViewPanel';
import '../styles/NoteEditor.css';

const NoteEditor = ({ noteId, onClose, isNew = false }) => {
  const { currentNote, getNoteById, createNote, updateNote, lockNote, verifyLockedNotePin, shareNote, loading } = useNotes();
  
  const titleRef = React.useRef(null);
  const [title, setTitle] = useState('');
  const titleLengthRef = React.useRef(0);
  const [content, setContent] = useState('');
  // Track content separately for each mode
  const [modeContents, setModeContents] = useState({
    text: '',
    code: '',
    json: ''
  });
  const previousModeRef = React.useRef('text');  // Track previous mode for proper saving
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [contentType, setContentType] = useState('text');
  const [color, setColor] = useState('#3b82f6');
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPin, setLockPin] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isNoteLockedOnServer, setIsNoteLockedOnServer] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hasVerifiedPassword, setHasVerifiedPassword] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [displayFormat, setDisplayFormat] = useState('text');

  const COLOR_OPTIONS = [
    '#ffffff', // white (default)
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];

  useEffect(() => {
    if (!isNew && noteId) {
      getNoteById(noteId);
    }
  }, [noteId, isNew]);

  useEffect(() => {
    if (currentNote && !isNew) {
      setIsNoteLockedOnServer(currentNote.is_locked);
      setHasVerifiedPassword(false);
      
      if (currentNote.is_locked) {
        setShowPasswordModal(true);
      } else {
        setShowPasswordModal(false);
        setTitle(currentNote.title);
        
        // Update previousModeRef FIRST so mode switching effects don't trigger
        previousModeRef.current = currentNote.content_type;
        
        // Load separate content for each mode
        setModeContents({
          text: currentNote.content_text || '',
          code: currentNote.content_code || '',
          json: currentNote.content_json || ''
        });
        
        // Set current content based on contentType
        const currentModeContent = currentNote.content_type === 'text' 
          ? currentNote.content_text 
          : currentNote.content_type === 'code'
          ? currentNote.content_code
          : currentNote.content_json;
        
        let contentToLoad = currentModeContent || '';
        if (contentToLoad && contentToLoad.includes('<')) {
          contentToLoad = extractPlainText(contentToLoad);
        }
        
        setContent(contentToLoad);
        setTags(currentNote.tags || []);
        setContentType(currentNote.content_type);
        setColor(currentNote.color || '#3b82f6');
      }
    }
  }, [currentNote]);

  // Load note content only after password is verified
  useEffect(() => {
    if (isNoteLockedOnServer && hasVerifiedPassword && currentNote) {
      setTitle(currentNote.title);
      setTags(currentNote.tags || []);
      setColor(currentNote.color || '#3b82f6');
      
      // Update previousModeRef FIRST to prevent mode switching effects from firing
      previousModeRef.current = currentNote.content_type;
      
      // Load separate content for each mode
      setModeContents({
        text: currentNote.content_text || '',
        code: currentNote.content_code || '',
        json: currentNote.content_json || ''
      });
      
      // Set current content based on contentType
      const currentModeContent = currentNote.content_type === 'text' 
        ? currentNote.content_text 
        : currentNote.content_type === 'code'
        ? currentNote.content_code
        : currentNote.content_json;
      
      let contentToLoad = currentModeContent || '';
      if (contentToLoad && contentToLoad.includes('<')) {
        contentToLoad = extractPlainText(contentToLoad);
      }
      
      setContent(contentToLoad);
      setContentType(currentNote.content_type);
    }
  }, [hasVerifiedPassword, isNoteLockedOnServer, currentNote]);

  // Save current content when switching modes
  useEffect(() => {
    if (previousModeRef.current !== contentType) {
      const previousMode = previousModeRef.current;
      // Save to the PREVIOUS mode
      setModeContents(prev => ({
        ...prev,
        [previousMode]: content
      }));
      previousModeRef.current = contentType;
    }
  }, [contentType]);

  // Load content from modeContents when mode changes
  useEffect(() => {
    const modeContent = modeContents[contentType];
    if (modeContent !== undefined) {
      setContent(modeContent);
    }
  }, [contentType, modeContents]);

  // Update title ref when title changes
  useEffect(() => {
    if (titleRef.current && titleRef.current.innerHTML !== title) {
      titleRef.current.innerHTML = title;
      titleLengthRef.current = titleRef.current.textContent.length;
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(titleRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [title]);

  const wrapNewTitleText = () => {
    if (!titleRef.current) return;
    
    const currentLength = titleRef.current.textContent.length;
    const addedLength = currentLength - titleLengthRef.current;
    
    if (addedLength > 0) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      let textNode = range.endContainer;
      
      if (textNode.nodeType === Node.TEXT_NODE && range.endOffset > 0) {
        const text = textNode.textContent;
        const newText = text.substring(text.length - addedLength);
        const oldText = text.substring(0, text.length - addedLength);
        
        const span = document.createElement('span');
        span.style.color = color;
        span.textContent = newText;
        
        if (oldText) {
          textNode.textContent = oldText;
          textNode.parentNode.insertBefore(span, textNode.nextSibling);
        } else {
          textNode.parentNode.replaceChild(span, textNode);
        }
        
        range.setStart(span, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      titleLengthRef.current = currentLength;
    }
  };

  const handleTitleInput = (e) => {
    const html = e.currentTarget.innerHTML;
    setTitle(html);
    wrapNewTitleText();
  };

  const handleTitleKeyDown = (e) => {
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
      handleTitleInput({ currentTarget: titleRef.current });
    }
  };

  const handleTitlePaste = (e) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const text = (e.clipboardData || window.clipboardData).getData('text');
    
    const span = document.createElement('span');
    span.style.color = color;
    span.textContent = text;
    
    range.insertNode(span);
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    
    titleLengthRef.current = titleRef.current.textContent.length;
    handleTitleInput({ currentTarget: titleRef.current });
  };

  const handleSave = async () => {
    // Ensure current content is saved to modeContents for this mode
    const finalModeContents = {
      ...modeContents,
      [contentType]: content  // Add the latest content from the editor
    };
    
    // Extract plain text from HTML for validation and saving
    const plainTextTitle = extractPlainTextFromTitle(title);
    let plainContent = finalModeContents[contentType] || '';
    
    // For Text mode, extract plain text from the HTML. For Code/JSON, keep as-is
    if (contentType === 'text') {
      plainContent = extractPlainText(plainContent);
    }

    if (!plainTextTitle.trim() || !plainContent.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      if (isNew) {
        // For new notes, send all three mode contents
        const result = await createNote(
          plainTextTitle, 
          plainContent, 
          tags, 
          contentType, 
          color,
          finalModeContents.text,
          finalModeContents.code,
          finalModeContents.json
        );
        if (!result) {
          alert('Failed to save note. Please try again.');
          return;
        }
      } else {
        // Send all three mode contents to preserve all data
        const result = await updateNote(currentNote.id, {
          title: plainTextTitle,
          content: plainContent,  // Current mode content (for backward compatibility)
          content_text: finalModeContents.text,  // Always send all three
          content_code: finalModeContents.code,
          content_json: finalModeContents.json,
          tags,
          content_type: contentType,
          color
        });
        if (!result) {
          alert('Failed to update note. Please try again.');
          return;
        }
      }
      
      onClose();
    } catch (error) {
      alert('Error saving note: ' + error.message);
      console.error('Save error:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Helper function to extract plain text from HTML
  const extractPlainText = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  // Helper function to extract plain text from title HTML
  const extractPlainTextFromTitle = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleLockNote = async () => {
    if (!lockPin) {
      alert('Please enter a PIN');
      return;
    }
    
    await lockNote(currentNote.id, lockPin);
    setShowLockModal(false);
    setLockPin('');
  };

  const handleShareNote = async () => {
    await shareNote(currentNote.id, isPublic);
    setShowShareModal(false);
  };

  const handlePasswordSubmit = async (password) => {
    const success = await verifyLockedNotePin(currentNote.id, password);
    if (success) {
      setHasVerifiedPassword(true);
      setShowPasswordModal(false);
      return true;
    }
    return false;
  };

  // Handle closing the editor
  const handleEditorClose = () => {
    onClose();
  };

  return (
    <div className="note-editor">
      {loading && !isNew && <div className="note-editor-loading">Loading note...</div>}
      
      {isNoteLockedOnServer && !hasVerifiedPassword ? (
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={onClose}
          onSubmit={handlePasswordSubmit}
          loading={loading}
        />
      ) : (
        <>
          {/* Tags Bar */}
          {tags.length > 0 && (
            <div className="tags-bar">
              {tags.map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                  <button 
                    className="tag-remove" 
                    onClick={() => handleRemoveTag(tag)}
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="editor-header">
            <div
              ref={titleRef}
              className="editor-title"
              contentEditable="true"
              onInput={handleTitleInput}
              onKeyDown={handleTitleKeyDown}
              onPaste={handleTitlePaste}
              data-placeholder="Note title..."
              suppressContentEditableWarning={true}
              style={{
                caretColor: color,
              }}
            />
            
            <div className="editor-actions">
              {/* Format Selector */}
              <div className="format-selector">
                <button 
                  className={`format-btn ${!isViewMode && contentType === 'text' ? 'active' : ''}`}
                  onClick={() => {
                    setIsViewMode(false);
                    setContentType('text');
                    setDisplayFormat('text');
                  }}
                  title="Edit as text"
                >
                  ✏️ Edit
                </button>
                <button 
                  className={`format-btn ${isViewMode && displayFormat === 'text' ? 'active' : ''}`}
                  onClick={() => {
                    setIsViewMode(true);
                    setDisplayFormat('text');
                  }}
                  title="View as text"
                >
                  📄 Text
                </button>
                <button 
                  className={`format-btn ${!isViewMode && contentType === 'code' ? 'active' : ''}`}
                  onClick={() => {
                    setContentType('code');
                    setIsViewMode(false);
                  }}
                  title="Code mode"
                >
                  📝 Code
                </button>
                <button 
                  className={`format-btn ${!isViewMode && contentType === 'json' ? 'active' : ''}`}
                  onClick={() => {
                    setContentType('json');
                    setIsViewMode(false);
                  }}
                  title="JSON mode"
                >
                  {} JSON
                </button>
              </div>

              {/* Color Picker - Only show in Text Edit Mode */}
              {!isViewMode && contentType === 'text' && (
                <div className="color-picker-group">
                  <label className="color-label">Color:</label>
                  <div className="color-options">
                    {COLOR_OPTIONS.map((colorOption) => (
                      <button
                        key={colorOption}
                        className={`color-option ${color === colorOption ? 'active' : ''}`}
                        style={{ backgroundColor: colorOption }}
                        onClick={() => setColor(colorOption)}
                        title={colorOption}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!isNew && (
                <>
                  <button 
                    className="action-btn"
                    onClick={() => setShowLockModal(true)}
                    title="Lock note"
                  >
                    🔒
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setShowShareModal(true)}
                    title="Share note"
                  >
                    🔗
                  </button>
                </>
              )}

              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          {/* Content Area - Edit or View Mode */}
          <div className="editor-content">
            {isViewMode ? (
              <ViewPanel content={content} format={displayFormat} />
            ) : (
              <>
                {/* Code/JSON Editor */}
                {contentType === 'code' ? (
                  <CodeEditor
                    content={content}
                    onChange={(val) => setContent(val)}
                    language="code"
                    placeholder="Type or paste code here"
                  />
                ) : contentType === 'json' ? (
                  <CodeEditor
                    content={content}
                    onChange={(val) => setContent(val)}
                    language="json"
                    placeholder="Type or paste JSON here"
                  />
                ) : (
                  <ColoredEditor
                    initialContent={content}
                    onChange={(val) => {
                      const text = extractPlainText(val);
                      setContent(text);
                    }}
                    placeholder="Type text here..."
                    currentColor={color}
                  />
                )}
              </>
            )}
          </div>

          <div className="editor-footer">
            <div className="tags-section">
              <input
                type="text"
                className="tag-input"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button className="add-tag-btn" onClick={handleAddTag}>Add Tag</button>
            </div>
          </div>
        </>
      )}

      {/* Lock Modal */}
      <Modal isOpen={showLockModal} onClose={() => setShowLockModal(false)} title="Lock Note">
        <div className="modal-form">
          <input
            type="password"
            className="form-input"
            placeholder="Enter a PIN to lock this note"
            value={lockPin}
            onChange={(e) => setLockPin(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleLockNote}>
            Lock Note
          </button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Note">
        <div className="modal-form">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Make this note public</span>
          </label>
          <button className="btn btn-primary" onClick={handleShareNote}>
            Generate Share Link
          </button>
          {currentNote?.share_token && (
            <div className="share-link">
              <p>Share link:</p>
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/shared/${currentNote.share_token}`}
              />
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/shared/${currentNote.share_token}`)}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NoteEditor;
