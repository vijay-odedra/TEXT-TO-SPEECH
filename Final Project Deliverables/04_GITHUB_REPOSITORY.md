# GitHub Repository Setup & Version Control Guide
### Source Code Management & Submission Details

---

## 1. Repository Structure & Configuration

The project follows a standard multi-package full-stack structure managed by a root `package.json`:

- **Client Directory**: `/client` (Vite + React 19 Frontend)
- **Server Directory**: `/server` (Express.js REST API Backend)
- **Deliverables Directory**: `/Final Project Deliverables` (Academic submission assets)

---

## 2. `.gitignore` Configuration
A production `.gitignore` is established at the root of the repository to prevent committing environment secrets and bulky build artifacts:

```gitignore
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment Variables & Secrets
.env
server/.env
client/.env.local
client/.env.*.local

# Production Builds
client/dist/
dist/

# OS and IDE files
.DS_Store
Thumbs.db
.vscode/
.idea/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## 3. Git Commands for Submission

### Initializing and Committing Locally:
```bash
# Check status of changed files
git status

# Stage all files
git add .

# Commit with academic project message
git commit -m "feat: complete Vocalix full-stack text-to-speech studio and deliverables"
```

### Linking to a GitHub Remote Repository:
```bash
# Create repository on GitHub (e.g., Vocalix-Text-To-Speech)
# Link remote origin:
git remote add origin https://github.com/YOUR_USERNAME/Vocalix-Text-To-Speech.git

# Set main branch and push
git branch -M main
git push -u origin main
```

---

## 4. Academic Repository Details Template

When submitting to your professor or evaluator, populate the following template:

- **Repository Name**: `Vocalix-Text-To-Speech`
- **Repository Visibility**: `Public`
- **Main Branch**: `main`
- **Technologies Used**: `React.js`, `Vite`, `Node.js`, `Express.js`, `Web Speech API`, `CSS3`
- **Clone URL**: `https://github.com/YOUR_USERNAME/Vocalix-Text-To-Speech.git`
- **License**: MIT License
