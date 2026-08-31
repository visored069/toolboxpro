# Run: ToolBox Pro (Static HTML)

## How to reproduce
No build step needed — this is a pure static HTML site.
All files are served directly from the project root.

## How to run the server
Node.js static server (no dependencies, clean URL support):
  node .freebuff/server.js

Or use Python:
  python -m http.server 8000 --bind 127.0.0.1

The site is accessible at http://127.0.0.1:8000/
Clean URLs supported: /about, /contact, /privacy, etc.

## Additional pages
- 3D Visual Demo: http://127.0.0.1:8000/3d-demo.html (standalone, showcases premium effects)
