import React, { useEffect, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard, Loading, Toast } from '../components';
import '../styles/NotesList.css';

const NotesList = ({ onEditNote, onCreateNote }) => {
  const { notes, fetchNotes, loading, deleteNote, shareNote } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchNotes(0, 50);
  }, []);

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    const success = await deleteNote(noteId);
    if (success) {
      setToast({ message: 'Note deleted successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ message: 'Failed to delete note', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleShare = async (noteId) => {
    const success = await shareNote(noteId, false);
    if (success) {
      setToast({ message: 'Note shared successfully! Share link generated.', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ message: 'Failed to share note', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="notes-list-page">
      <div className="notes-header">
        <h1>My Notes</h1>
        <button className="btn btn-primary" onClick={onCreateNote}>
          + New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No notes yet</h2>
          <p>Create your first note to get started</p>
          <button className="btn btn-primary" onClick={onCreateNote}>
            Create Note
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => onEditNote(note.id)}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No notes match your search</p>
            </div>
          )}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default NotesList;
