### Technical Challenges Solved

1. **Circular Import Issues**: Resolved by lazy-loading agents inside the Orchestrator's `__init__` method
2. **MongoDB Index Conflicts**: Implemented robust index creation that handles conflicts by dropping and recreating indexes
3. **IPv6 vs IPv4 Resolution**: Fixed frontend proxy to use `127.0.0.1` instead of `localhost` on Windows
4. **SSE Connection Reliability**: Added polling fallback mechanism to ensure frontend always has latest data
5. **PDF Extraction**: Implemented LLM-based extraction with regex fallback for robust field extraction

## Troubleshooting

### Backend Issues

**Problem**: `ImportError: cannot import name 'HarveyAgent'`
- **Solution**: This is a circular import issue. Ensure agents are imported inside `Orchestrator.__init__`, not at module level.

**Problem**: `IndexKeySpecsConflict` errors
- **Solution**: The application automatically handles this by dropping and recreating indexes. If issues persist, manually drop indexes in MongoDB.

**Problem**: `Connection refused` errors
- **Solution**: 
  - Ensure MongoDB Atlas IP whitelist includes your IP address
  - Verify MongoDB URI has correct username and password
  - Check that MongoDB service is running (if using local MongoDB)

**Problem**: LLM API errors
- **Solution**:
  - Verify API key is correct in `.env` file
  - Check API rate limits (use smaller model if hitting limits)
  - Ensure internet connection is stable

### Frontend Issues

**Problem**: `ECONNREFUSED ::1:8000`
- **Solution**: The `vite.config.js` is configured to use `127.0.0.1` instead of `localhost`. Restart the Vite dev server after changes.

**Problem**: Agents not updating
- **Solution**: 
  - Check browser console for SSE connection errors
  - Verify backend is running on port 8000
  - Check network tab for failed API calls

**Problem**: PDF extraction not working
- **Solution**:
  - Ensure PDF file is not corrupted
  - Check backend logs for extraction errors
  - Verify PyPDF2 is installed: `pip install PyPDF2`

### MongoDB Issues

**Problem**: Cannot connect to MongoDB Atlas
- **Solution**:
  1. Verify connection string format: `mongodb+srv://username:password@cluster.mongodb.net/...`
  2. Check IP whitelist includes your current IP
  3. Verify database user has correct permissions
  4. Test connection using MongoDB Compass

**Problem**: Collections not created
- **Solution**: The application creates collections automatically on startup. Check backend logs for initialization messages.