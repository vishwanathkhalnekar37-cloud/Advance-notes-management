import React, { createContext, useState, useCallback, useEffect } from 'react';

const NotesContext = createContext();

const getApiBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = useCallback(async (skip = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes?skip=${skip}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      setNotes(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNotes = useCallback(async (query) => {
    if (!query.trim()) {
      fetchNotes(0, 20);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNoteById = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch note');
      
      const data = await response.json();
      setCurrentNote(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (title, content, tags = [], contentType = 'text', color = '#3b82f6', contentText = '', contentCode = '', contentJson = '') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Found' : 'NOT FOUND', token?.substring(0, 20) + '...');
      if (!token) {
        throw new Error('Not authenticated - please log in');
      }
      const response = await fetch(`${getApiBaseURL()}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          content, 
          content_text: contentText,
          content_code: contentCode,
          content_json: contentJson,
          tags, 
          content_type: contentType, 
          color 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create note: ${response.status}`);
      }
      
      const data = await response.json();
      setNotes([data, ...notes]);
      setCurrentNote(data);
      return data;
    } catch (err) {
      console.error('Create note error:', err);
      setError(err.message);
      alert('Error saving note: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [notes]);

  const updateNote = useCallback(async (noteId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Update token:', token ? 'Found' : 'NOT FOUND');
      if (!token) {
        throw new Error('Not authenticated - please log in');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to update note: ${response.status}`);
      }
      
      const data = await response.json();
      setNotes(notes.map(n => n.id === noteId ? data : n));
      if (currentNote?.id === noteId) {
        setCurrentNote(data);
      }
      return data;
    } catch (err) {
      console.error('Update note error:', err);
      setError(err.message);
      alert('Error updating note: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [notes, currentNote]);

  const deleteNote = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(notes.filter(n => n.id !== noteId));
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [notes, currentNote]);

  const lockNote = useCallback(async (noteId, pin) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lock_pin: pin })
      });
      
      if (!response.ok) throw new Error('Failed to lock note');
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const unlockNote = useCallback(async (noteId, pin) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lock_pin: pin })
      });
      
      if (!response.ok) throw new Error('Invalid PIN');
      
      // Fetch the unlocked note
      const noteResponse = await fetch(`${getApiBaseURL()}/notes/${noteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!noteResponse.ok) throw new Error('Failed to fetch unlocked note');
      
      const unlockedNote = await noteResponse.json();
      setCurrentNote(unlockedNote);
      setNotes(notes.map(n => n.id === noteId ? unlockedNote : n));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [notes]);

  const verifyLockedNotePin = useCallback(async (noteId, pin) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}/verify-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lock_pin: pin })
      });
      
      if (!response.ok) throw new Error('Invalid PIN');
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const shareNote = useCallback(async (noteId, isPublic = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${getApiBaseURL()}/notes/${noteId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_shared: true, is_public: isPublic })
      });
      
      if (!response.ok) throw new Error('Failed to share note');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const value = {
    notes,
    currentNote,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchNotes,
    searchNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    lockNote,
    unlockNote,
    verifyLockedNotePin,
    shareNote
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = React.useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
