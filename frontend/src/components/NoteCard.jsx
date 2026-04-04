import React from 'react';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onClick, onDelete, onShare }) => {
  const truncateContent = (text, length = 100) => {
    if (!text) return 'No content';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const getContentForDisplay = () => {
    // Get content based on content_type
    if (note.content_type === 'text') {
      return note.content_text;
    } else if (note.content_type === 'code') {
      return note.content_code;
    } else if (note.content_type === 'json') {
      return note.content_json;
    }
    // Fallback to legacy content field
    return note.content;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isLocked = note.is_locked;
  const noteColor = note.color || '#3b82f6';

  return (
    <div 
      className="note-card" 
      onClick={onClick} 
      style={{ 
        cursor: 'pointer',
        borderLeftColor: noteColor,
        borderLeftWidth: '4px'
      }}
    >
      <div className="note-header">
        <h3 className="note-title">{isLocked ? '🔒 Locked Note' : note.title}</h3>
        <div className="note-badges">
          {note.is_locked && <span className="badge lock-badge">🔒</span>}
          {note.is_shared && <span className="badge share-badge">🔗</span>}
        </div>
      </div>
      
      {isLocked ? (
        <p className="note-preview note-locked-preview">Enter password to view this note</p>
      ) : (
        <p className="note-preview">{truncateContent(getContentForDisplay())}</p>
      )}
      
      <div className="note-meta">
        <span className="note-type">{note.content_type}</span>
        <span className="note-date">{formatDate(note.updated_at)}</span>
      </div>
      
      {!isLocked && note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
          {note.tags.length > 2 && <span className="tag">+{note.tags.length - 2}</span>}
        </div>
      )}
      
      {!isLocked && (
        <div className="note-actions">
          <button
            className="action-btn share-btn"
            onClick={(e) => {
              e.stopPropagation();
              onShare && onShare(note.id);
            }}
          >
            Share
          </button>
          <button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(note.id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
