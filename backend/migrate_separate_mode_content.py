#!/usr/bin/env python
"""Migration script to add separate content fields for each mode"""
from sqlalchemy import text, inspect
from app.database import engine

def migrate():
    """Migrate to add separate content_text, content_code, content_json columns"""
    with engine.connect() as connection:
        # Check if columns already exist
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        
        # Add content_text column
        if 'content_text' not in columns:
            print("Adding content_text column...")
            try:
                connection.execute(text("ALTER TABLE notes ADD COLUMN content_text LONGTEXT"))
                connection.commit()
                print("✓ content_text column added")
            except Exception as e:
                print(f"✗ Error adding content_text: {e}")
                return False
        else:
            print("✓ content_text column already exists")
        
        # Add content_code column
        if 'content_code' not in columns:
            print("Adding content_code column...")
            try:
                connection.execute(text("ALTER TABLE notes ADD COLUMN content_code LONGTEXT"))
                connection.commit()
                print("✓ content_code column added")
            except Exception as e:
                print(f"✗ Error adding content_code: {e}")
                return False
        else:
            print("✓ content_code column already exists")
        
        # Add content_json column
        if 'content_json' not in columns:
            print("Adding content_json column...")
            try:
                connection.execute(text("ALTER TABLE notes ADD COLUMN content_json LONGTEXT"))
                connection.commit()
                print("✓ content_json column added")
            except Exception as e:
                print(f"✗ Error adding content_json: {e}")
                return False
        else:
            print("✓ content_json column already exists")
        
        # Migrate existing data from 'content' to mode-specific columns based on content_type
        print("\nMigrating existing note data...")
        try:
            # For each note, copy content to the appropriate mode-specific column
            connection.execute(text("""
                UPDATE notes 
                SET content_text = COALESCE(content, '') 
                WHERE content_type = 'text' OR content_type IS NULL
            """))
            connection.execute(text("""
                UPDATE notes 
                SET content_code = COALESCE(content, '') 
                WHERE content_type = 'code'
            """))
            connection.execute(text("""
                UPDATE notes 
                SET content_json = COALESCE(content, '') 
                WHERE content_type = 'json'
            """))
            # Ensure all other columns are non-null
            connection.execute(text("""
                UPDATE notes 
                SET content_text = COALESCE(content_text, '')
            """))
            connection.execute(text("""
                UPDATE notes 
                SET content_code = COALESCE(content_code, '')
            """))
            connection.execute(text("""
                UPDATE notes 
                SET content_json = COALESCE(content_json, '')
            """))
            connection.commit()
            print("✓ Data migration completed")
        except Exception as e:
            print(f"✗ Error migrating data: {e}")
            return False
        
        # Verify the changes
        print("\nVerifying migration...")
        inspector = inspect(engine)
        columns = {c['name']: c for c in inspector.get_columns('notes')}
        
        if 'content_text' in columns and 'content_code' in columns and 'content_json' in columns:
            print("✓ All new columns verified")
            print("\n✓ Migration completed successfully!")
            return True
        else:
            print("✗ Some columns are missing!")
            return False

if __name__ == "__main__":
    success = migrate()
    exit(0 if success else 1)
