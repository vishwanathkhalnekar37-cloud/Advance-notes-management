#!/usr/bin/env python
"""Wrapper script to run uvicorn with correct working directory"""
import os
import sys

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Run uvicorn
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
