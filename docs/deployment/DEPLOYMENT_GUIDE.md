# 🚀 Pawsome Frontend - Deployment & Setup Guide

## Overview
This guide provides comprehensive instructions for setting up, developing, and deploying the Pawsome Frontend application across different environments.

---

## 📋 Prerequisites

### System Requirements

#### Development Environment
- **Node.js**: 18.0.0 or higher (LTS recommended)
- **npm**: 9.0.0 or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **WebGL Support**: Required for 3D features

#### Hardware Recommendations
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space for dependencies
- **GPU**: Dedicated graphics card recommended for 3D development
- **CPU**: Multi-core processor (4+ cores recommended)

#### Optional Tools
- **Visual Studio Code**: Recommended IDE with extensions
- **React Developer Tools**: Browser extension for debugging
- **Redux DevTools**: If using Redux (future implementation)

---

## 🛠️ Installation Guide

### 1. Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-org/Pawesome-frontend.git

# Navigate to project directory
cd Pawesome-frontend

# Check current branch
git branch
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0

# Check for vulnerabilities
npm audit
```

### 3. Environment Configuration
```bash
# Create environment file (if needed)
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

#### Environment Variables
```bash
# .env.local
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_CDN_BASE_URL=https://cdn.pawsome.com
```

### 4. Start Development Server
```bash
# Start the development server
npm start

# Server will start on http://localhost:3000
# Browser should open automatically
```

---

## 💻 Development Setup

### IDE Configuration

#### Visual Studio Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "javascript": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    "class\\s*=\\s*[\"']([^\"']*)[\"']",
    "className\\s*=\\s*[\"']([^\"']*)[\"']"
  ]
}
```

### Git Configuration

#### Git Hooks Setup
```bash
# Install husky for git hooks
npm install --save-dev husky

# Setup pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run build"
```

#### Commit Message Convention
```bash
# Conventional commit format
<type>(<scope>): <description>

# Examples:
feat(homepage): add 3D pet interactions
fix(cart): resolve quantity update bug
docs(readme): update installation instructions
style(header): improve mobile navigation
refactor(api): optimize product data fetching
```

---

## 🧪 Testing Setup

### Test Environment Configuration
```bash
# Install testing dependencies (already included)
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in CI mode
npm test -- --ci --coverage --watchAll=false
```

### Test Structure
```
src/
├── __tests__/           # Global tests
├── components/
│   ├── __tests__/       # Component tests
│   └── Component.test.tsx
├── utils/
│   ├── __tests__/       # Utility tests
│   └── helper.test.ts
└── setupTests.js        # Test configuration
```

### Sample Test Configuration
```typescript
// src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-test-id' });

// Mock Three.js for tests
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-test-id="canvas">{children}</div>,
}));

// Mock GSAP
jest.mock('gsap', () => ({
  timeline: () => ({
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
  }),
}));
```

---

## 🏗️ Build Process

### Development Build
```bash
# Standard development build
npm start

# Build with specific environment
NODE_ENV=development npm start

# Enable source maps
GENERATE_SOURCEMAP=true npm start
```

### Production Build
```bash
# Create production build
npm run build

# Analyze bundle size
npm run build && npx bundle-analyzer build/static/js/*.js

# Build with specific optimization
NODE_ENV=production npm run build

# Build with profiling
npm run build -- --profile
```

### Build Optimization
```bash
# Check bundle size
npm run build
ls -la build/static/js/

# Analyze dependencies
npx webpack-bundle-analyzer build/static/js/*.js

# Check for unused dependencies
npx depcheck
```

---

## 🌐 Deployment Options

### 1. Netlify Deployment

#### Automatic Deployment
```toml
# netlify.toml (already configured)
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=build

# Deploy to preview
netlify deploy --dir=build
```

#### Environment Variables in Netlify
1. Go to Site Settings → Environment Variables
2. Add the following variables:
```
REACT_APP_API_BASE_URL=https://api.pawsome.com
REACT_APP_ENVIRONMENT=production
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

### 2. Vercel Deployment

#### Automatic Deployment
```json
// vercel.json (already configured)
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### 3. AWS S3 + CloudFront

#### S3 Bucket Setup
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://pawsome-frontend

# Enable static website hosting
aws s3 website s3://pawsome-frontend \
  --index-document index.html \
  --error-document index.html
```

#### Deployment Script
```bash
#!/bin/bash
# deploy-aws.sh

# Build the project
npm run build

# Sync to S3
aws s3 sync build/ s3://pawsome-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### 4. Docker Deployment

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

#### Docker Commands
```bash
# Build Docker image
docker build -t pawsome-frontend .

# Run locally
docker run -p 3000:80 pawsome-frontend

# Push to registry
docker tag pawsome-frontend your-registry/pawsome-frontend:latest
docker push your-registry/pawsome-frontend:latest
```

---

## 🔧 CI/CD Pipeline

### GitHub Actions

#### Workflow Configuration
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --ci --coverage --watchAll=false
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        env:
          REACT_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          REACT_APP_GOOGLE_ANALYTICS_ID: ${{ secrets.GA_ID }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build/
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test -- --ci --coverage
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
  only:
    - main
```

---

## 🔍 Monitoring & Analytics

### Performance Monitoring

#### Setup Web Vitals
```typescript
// src/reportWebVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
```

#### Error Tracking with Sentry
```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
  integrations: [
    new BrowserTracing({
      // Set tracing origins
      tracingOrigins: ['localhost', process.env.REACT_APP_API_BASE_URL],
    }),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});

export default Sentry;
```

### Google Analytics Setup
```typescript
// src/utils/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+

# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 2. 3D Performance Issues
```typescript
// Reduce particle count for lower-end devices
const getParticleCount = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) return 10; // Fallback for no WebGL
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (renderer.includes('Intel')) return 25; // Integrated graphics
    if (renderer.includes('Mobile')) return 15; // Mobile devices
  }
  
  return 50; // Default for dedicated GPUs
};
```

#### 3. Routing Issues
```typescript
// Add to public/.htaccess for Apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### 4. Memory Leaks
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshBasicMaterial();
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Image Optimization
```bash
# Install imagemin for image optimization
npm install --save-dev imagemin imagemin-webp imagemin-pngquant

# Create optimization script
echo 'const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const imageminPngquant = require("imagemin-pngquant");

(async () => {
  await imagemin(["public/images/*.{jpg,png}"], {
    destination: "public/images/optimized",
    plugins: [
      imageminWebp({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
})();' > optimize-images.js

node optimize-images.js
```

---

## 📊 Performance Targets

### Lighthouse Scores
- **Performance**: 95+ 
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Targets
- **Main JS Bundle**: < 400KB gzipped
- **CSS Bundle**: < 50KB gzipped
- **Total Initial Load**: < 500KB gzipped

---

## 🔐 Security Checklist

### Pre-deployment Security
- [ ] Remove all console.log statements
- [ ] Ensure no sensitive data in environment variables
- [ ] Validate all user inputs
- [ ] Enable HTTPS in production
- [ ] Set proper CSP headers
- [ ] Remove development dependencies from production build
- [ ] Audit dependencies for vulnerabilities: `npm audit`

### Production Security Headers
```nginx
# Add to nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## 📚 Additional Resources

### Documentation Links
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [React Router Docs](https://reactrouter.com/docs)

### Development Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Community Resources
- [React Community](https://reactjs.org/community/support.html)
- [Tailwind CSS Discord](https://discord.gg/7NF8GNe)
- [Three.js Discourse](https://discourse.threejs.org/)

---

*Last Updated: June 18, 2025*  
*Deployment Guide Version: 1.0.0*  
*Tested Environments: Node 18.x, npm 9.x*  
*Status: Production Ready* ✅