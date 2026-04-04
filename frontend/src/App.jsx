import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNotes } from './context/NotesContext';
import { Navbar } from './components';
import { Landing, Login, Signup, Dashboard, NotesList, NoteEditor } from './pages';
import './styles/globals.css';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [editingNoteId, setEditingNoteId] = useState(null);

  if (!isAuthenticated) {
    if (currentPage === 'landing') {
      return (
        <Landing
          onLoginClick={() => setCurrentPage('login')}
          onSignupClick={() => setCurrentPage('signup')}
        />
      );
    }

    const page = currentPage === 'signup' ? 'signup' : 'login';
    return page === 'signup' ? (
      <Signup onSuccess={() => setCurrentPage('dashboard')} onBackToLogin={() => setCurrentPage('landing')} />
    ) : (
      <Login 
        onSuccess={() => setCurrentPage('dashboard')} 
        onSignup={() => setCurrentPage('signup')}
        onBackToLanding={() => setCurrentPage('landing')}
      />
    );
  }

  return (
    <div className="app-layout">
      <Navbar activeTab={currentPage} setActiveTab={setCurrentPage} />
      
      <main className="app-main">
        <div className="app-content">
          {currentPage === 'dashboard' && (
            <Dashboard
              onCreateNote={() => setCurrentPage('create')}
              onEditNote={(id) => {
                setEditingNoteId(id);
                setCurrentPage('editor');
              }}
              onViewAll={() => setCurrentPage('notes')}
            />
          )}
          
          {currentPage === 'notes' && (
            <NotesList
              onCreateNote={() => setCurrentPage('create')}
              onEditNote={(id) => {
                setEditingNoteId(id);
                setCurrentPage('editor');
              }}
            />
          )}
          
          {currentPage === 'create' && (
            <NoteEditor
              isNew={true}
              onClose={() => setCurrentPage('notes')}
            />
          )}
          
          {currentPage === 'editor' && editingNoteId && (
            <NoteEditor
              noteId={editingNoteId}
              isNew={false}
              onClose={() => {
                setCurrentPage('notes');
                setEditingNoteId(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
