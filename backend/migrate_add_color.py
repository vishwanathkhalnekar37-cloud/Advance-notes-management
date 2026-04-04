"""Migration script to add color column to notes table"""
import sys
sys.path.insert(0, '/app')

from sqlalchemy import create_engine, Column, String, inspect, text
from app.config import DATABASE_URL

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Get inspector to check if column exists
with engine.connect() as connection:
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('notes')]
    
    # Check if color column already exists
    if 'color' not in columns:
        print("Adding 'color' column to notes table...")
        try:
            # Add color column with default value
            with connection.begin():
                connection.execute(text("""
                    ALTER TABLE notes ADD COLUMN color VARCHAR(50) DEFAULT '#3b82f6'
                """))
            print("✅ Successfully added 'color' column!")
        except Exception as e:
            print(f"❌ Error adding column: {e}")
            # Try alternative syntax for different databases
            try:
                with connection.begin():
                    connection.execute(text("""
                        ALTER TABLE notes ADD color VARCHAR(50) DEFAULT '#3b82f6'
                    """))
                print("✅ Successfully added 'color' column (alternative syntax)!")
            except Exception as e2:
                print(f"❌ Alternative syntax also failed: {e2}")
    else:
        print("✅ 'color' column already exists in notes table")

print("\nVerifying columns in notes table:")
inspector = inspect(engine)
columns = [c['name'] for c in inspector.get_columns('notes')]
print(f"Columns: {columns}")
