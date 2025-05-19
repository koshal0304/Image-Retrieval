# Deploying to Vercel

This guide will help you deploy the Image Retrieval System to Vercel.

## Prerequisites

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Make sure you have:
- A Vercel account
- Git installed
- Node.js installed
- Python 3.8+ installed

## Deployment Steps

### 1. Prepare Your Environment

1. Install dependencies:
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install
npm run build
cd ..
```

2. Create a `.env` file with necessary environment variables:
```bash
FLASK_ENV=production
PYTHONPATH=.
```

### 2. Deploy to Vercel

1. Login to Vercel:
```bash
vercel login
```

2. Deploy the application:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### 3. Environment Variables

Set the following environment variables in your Vercel project settings:

- `FLASK_ENV`: production
- `PYTHONPATH`: .
- Any other environment-specific variables

### 4. Project Structure

Ensure your project structure follows this pattern:
```
/
├── app.py
├── vercel.json
├── requirements.txt
├── frontend/
│   ├── package.json
│   └── build/
└── static/
    └── uploads/
```

### 5. Important Notes

1. **File Storage**: Vercel has a read-only filesystem. For file storage, you'll need to use:
   - External storage service (e.g., AWS S3)
   - Database storage
   - Cloud storage solution

2. **Memory Limitations**: Vercel has memory limitations:
   - Serverless functions: 1024MB RAM
   - Maximum execution time: 10 seconds

3. **Database**: Use an external database service:
   - MongoDB Atlas
   - PostgreSQL
   - MySQL

### 6. Troubleshooting

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in requirements.txt
   - Ensure Python version compatibility

2. **Runtime Errors**:
   - Check function logs in Vercel dashboard
   - Verify environment variables
   - Check file permissions

3. **API Issues**:
   - Verify API routes in vercel.json
   - Check CORS settings
   - Verify endpoint configurations

### 7. Monitoring

1. Use Vercel Analytics to monitor:
   - Performance
   - Error rates
   - API usage
   - Build status

2. Set up alerts for:
   - Build failures
   - Runtime errors
   - Performance issues

### 8. Maintenance

1. Regular updates:
   - Keep dependencies updated
   - Monitor security advisories
   - Update environment variables as needed

2. Backup strategy:
   - Regular database backups
   - Configuration backups
   - Environment variable backups

## Support

For issues or questions:
1. Check Vercel documentation
2. Review application logs
3. Contact Vercel support
4. Check GitHub issues 