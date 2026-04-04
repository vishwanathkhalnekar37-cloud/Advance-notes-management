"""Utility for detecting and formatting code in notes"""
import json
import re
from typing import Tuple, Optional


def detect_code_type(content: str) -> Tuple[bool, Optional[str]]:
    """
    Detect if content is code and which language
    Returns: (is_code, language)
    """
    content = content.strip()
    
    # JSON detection
    if is_json(content):
        return True, "json"
    
    # Python detection
    if is_python(content):
        return True, "python"
    
    # JavaScript/TypeScript detection
    if is_javascript(content):
        return True, "javascript"
    
    # Other code patterns
    if has_code_patterns(content):
        return True, None
    
    return False, None


def is_json(content: str) -> bool:
    """Check if content is valid JSON"""
    try:
        json.loads(content)
        return True
    except (json.JSONDecodeError, ValueError):
        return False


def is_python(content: str) -> bool:
    """Check if content looks like Python code"""
    python_patterns = [
        r'^import\s+',
        r'^from\s+\w+\s+import',
        r'^\s*def\s+\w+\(',
        r'^\s*class\s+\w+',
        r'^\s*if\s+__name__\s*==',
    ]
    return any(re.match(pattern, content, re.MULTILINE) for pattern in python_patterns)


def is_javascript(content: str) -> bool:
    """Check if content looks like JavaScript/TypeScript"""
    js_patterns = [
        r'^import\s+',
        r'^export\s+',
        r'^\s*function\s+\w+\(',
        r'^\s*const\s+\w+\s*=',
        r'^\s*let\s+\w+\s*=',
        r'=>\s*{',  # Arrow functions
    ]
    return any(re.search(pattern, content, re.MULTILINE) for pattern in js_patterns)


def has_code_patterns(content: str) -> bool:
    """Check for general code patterns"""
    code_patterns = [
        r'\{.*\}',  # Braces
        r'\[.*\]',  # Brackets
        r'<\w+[^>]*>',  # HTML tags
        r';\s*$',  # Semicolons
    ]
    return any(re.search(pattern, content) for pattern in code_patterns)


def format_json(content: str) -> str:
    """Format JSON with proper indentation"""
    try:
        parsed = json.loads(content)
        return json.dumps(parsed, indent=2)
    except (json.JSONDecodeError, ValueError):
        return content


def auto_format_content(content: str, content_type: str) -> str:
    """Auto-format content based on type"""
    if content_type == "json":
        return format_json(content)
    return content
