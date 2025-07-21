# Election Voting Platform

A secure, user-friendly, full-stack voting platform where voters can register, log in, and cast their vote once per election, and admins can manage elections, candidates, and view results.

## 🚀 Features
- Voter registration & login (with role-based access)
- Admin dashboard for managing elections and candidates
- One vote per user per election (prevents double voting)
- Live results with animated charts and progress bars
- JWT authentication, bcrypt password hashing
- Responsive, modern UI with dark mode and animations
- Downloadable CSV reports for admins

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, Axios, React Icons, Confetti
- **Backend:** Node.js, Express, JWT, bcrypt, Mongoose
- **Database:** MongoDB (Atlas recommended)
- **Deployment:** Netlify (frontend), Render/Railway/Heroku (backend)

## 📦 Project Structure
```
election-voting/
  backend/      # Node.js/Express API
  frontend/     # React + Tailwind client
```

## 🏁 Local Setup
1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/election-voting.git
   cd election-voting
   ```
2. **Backend:**
   ```bash
   cd backend
   npm install
   # Add .env with MONGO_URI, PORT, JWT_SECRET
   npm start
   ```
3. **Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. **Visit:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api/health

## 🌐 Deployment
- **Frontend:** Deploy `frontend/build` to Netlify
- **Backend:** Deploy `backend` to Render, Railway, or Heroku
- **Update API URLs** in frontend to point to your deployed backend

## 📄 License
MIT

---

**Made with ❤️ for secure, transparent digital voting!** 