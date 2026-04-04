import React, { useEffect, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard, Loading, Toast } from '../components';
import '../styles/Dashboard.css';

const Dashboard = ({ onCreateNote, onEditNote, onViewAll }) => {
  const { notes, fetchNotes, loading, deleteNote, shareNote } = useNotes();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchNotes(0, 10);
  }, []);

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

  const recentNotes = notes.slice(0, 5);
  const totalNotes = notes.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your note overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Notes</h3>
            <p className="stat-number">{totalNotes}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <h3>Locked Notes</h3>
            <p className="stat-number">{notes.filter(n => n.is_locked).length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>Shared Notes</h3>
            <p className="stat-number">{notes.filter(n => n.is_shared).length}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h2>Recent Notes</h2>
          <button className="view-all-btn" onClick={onViewAll}>
            View All
          </button>
        </div>

        {recentNotes.length > 0 ? (
          <div className="notes-grid">
            {recentNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => onEditNote(note.id)}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
            <button className="create-btn" onClick={onCreateNote}>
              Create Note
            </button>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Dashboard;
