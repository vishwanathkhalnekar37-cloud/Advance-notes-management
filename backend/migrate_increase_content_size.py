#!/usr/bin/env python
"""Migration script to increase content and title column size"""
from sqlalchemy import text, create_engine, inspect
from app.config import DATABASE_URL
from app.database import engine

def migrate():
    """Migrate content and title columns to LONGTEXT"""
    with engine.connect() as connection:
        # Check if columns exist and their current type
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        
        if 'content' not in columns:
            print("Content column not found!")
            return False
        
        print(f"Current content column type: {columns['content']['type']}")
        print(f"Current title column type: {columns['title']['type']}")
        
        # Alter content column to LONGTEXT
        print("\nAltering content column to LONGTEXT...")
        try:
            connection.execute(text("ALTER TABLE notes MODIFY COLUMN content LONGTEXT NOT NULL"))
            connection.commit()
            print("✓ Content column updated to LONGTEXT")
        except Exception as e:
            print(f"✗ Error updating content column: {e}")
            return False
        
        # Alter title column to LONGTEXT
        print("\nAltering title column to LONGTEXT...")
        try:
            connection.execute(text("ALTER TABLE notes MODIFY COLUMN title LONGTEXT NOT NULL"))
            connection.commit()
            print("✓ Title column updated to LONGTEXT")
        except Exception as e:
            print(f"✗ Error updating title column: {e}")
            return False
        
        # Verify the changes
        print("\nVerifying changes...")
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        print(f"New content column type: {columns['content']['type']}")
        print(f"New title column type: {columns['title']['type']}")
        
        print("\n✓ Migration completed successfully!")
        return True

if __name__ == "__main__":
    migrate()
