
LMS Deployable Package
======================

This package includes a backend (Spring Boot) and frontend (React) ready for deployment.
The README below shows how to deploy using Render (backend) + Netlify (frontend) and
how to create a free managed MySQL using Railway.

---
Project layout
- backend/   -> Spring Boot app (Java 17 + Maven)
- frontend/  -> React app

Local run summary
- Backend: mvn spring-boot:run (after setting DB credentials in application.properties or env vars)
- Frontend: cd frontend && npm install && npm start

---
RAILWAY - Free MySQL setup (quick guide)
1. Go to https://railway.app and sign up (GitHub/Email).
2. Create a new project -> Add Plugin -> MySQL.
3. Railway will provision a MySQL database and show connection details. Copy the connection URL in the form:
   mysql://<user>:<password>@<host>:<port>/<database>
4. In Render (or locally) convert to JDBC URL:
   jdbc:mysql://<host>:<port>/<database>?useSSL=false&allowPublicKeyRetrieval=true
5. When deploying backend, set environment variables:
   SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/<database>?useSSL=false&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=<user>
   SPRING_DATASOURCE_PASSWORD=<password>
6. Optionally, open Railway DB (connect via MySQL Workbench) to inspect tables.

---
Deploy backend to Render (recommended)
1. Push backend/ to a GitHub repo.
2. On Render, create a new Web Service from GitHub repo.
   - Environment: Java 17
   - Build Command: ./mvnw -B package -DskipTests || mvn -B package -DskipTests
   - Start Command: java -jar target/*.jar
3. In Environment > Environment Variables, add:
   - SPRING_DATASOURCE_URL (value from Railway / your DB)
   - SPRING_DATASOURCE_USERNAME
   - SPRING_DATASOURCE_PASSWORD
4. Deploy. Render will provide a URL like https://your-backend.onrender.com
5. Test: GET https://your-backend.onrender.com/api/auth/init

---
Deploy frontend to Netlify
1. Push frontend/ to GitHub repo.
2. On Netlify, New site from Git -> select repo.
   - Build command: npm run build
   - Publish directory: build
3. Add environment variable in Netlify site settings:
   - REACT_APP_API_URL=https://your-backend.onrender.com
4. Deploy. Netlify will provide a URL for your frontend.

---
Connecting frontend to backend
- In frontend code, API calls use process.env.REACT_APP_API_URL. Netlify injects that at build time.
- Example fetch: fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`)

---
Security & production notes
- This demo stores plaintext passwords (for prototype). Use BCrypt + Spring Security for production.
- Use HTTPS for production endpoints.
- Add CORS restrictions as needed.

---
Test users (after calling /api/auth/init)
- admin / admin123  -> ADMIN
- teacher / teach123 -> TEACHER
- student / stud123 -> STUDENT

---
Happy deploying! If you want, I can:
- Push these folders to GitHub for you (you provide a repo name or allow access)
- Create step-by-step Render and Netlify screenshots
- Add Dockerfile + docker-compose for a containerized deployment
# LMS_Project
