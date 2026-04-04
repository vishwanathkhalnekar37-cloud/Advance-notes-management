#!/usr/bin/env python
"""Migration script to make content column nullable"""
from sqlalchemy import text, inspect
from app.database import engine

def migrate():
    """Make content column nullable"""
    with engine.connect() as connection:
        # Check current column definition
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        
        if 'content' not in columns:
            print("Content column not found!")
            return False
        
        print(f"Current content column nullable: {columns['content']['nullable']}")
        
        # Alter content column to allow NULL
        print("\nAltering content column to be nullable...")
        try:
            connection.execute(text("ALTER TABLE notes MODIFY COLUMN content LONGTEXT NULL"))
            connection.commit()
            print("✓ Content column updated to nullable")
        except Exception as e:
            print(f"✗ Error updating content column: {e}")
            return False
        
        # Verify the changes
        print("\nVerifying changes...")
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        print(f"New content column nullable: {columns['content']['nullable']}")
        
        print("\n✓ Migration completed successfully!")
        return True

if __name__ == "__main__":
    success = migrate()
    exit(0 if success else 1)
