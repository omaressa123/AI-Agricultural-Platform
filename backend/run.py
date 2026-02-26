"""
Runner script for AI Agricultural Platform Backend
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Get configuration from environment
    env = os.environ.get('FLASK_ENV', 'development')
    
    # Set host and port
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    debug = env == 'development'
    
    print(f"🌾 AI Agricultural Platform Backend")
    print(f"📍 Environment: {env}")
    print(f"🌐 Server: http://{host}:{port}")
    print(f"📚 API Documentation: http://{host}:{port}/")
    print(f"🚀 Starting server...")
    
    app.run(host=host, port=port, debug=debug)
