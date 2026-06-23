# Saksham Nanda — Portfolio (MERN Stack) — Complete Build

Premium interactive personal portfolio for **Saksham Nanda**, Full Stack MERN Developer.

## Stack
- **Frontend**: React (Vite), Framer Motion, CSS Variables / Glassmorphism
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Nodemailer

## Project Structure
```
portfolio/
├── client/          React frontend (Vite)
│   ├── src/
│   │   ├── components/   Navbar, Footer, ReelModal, RevealText, icons
│   │   ├── sections/     Hero, About, Skills, Projects, Experience, Contact
│   │   ├── data/         skills.js, projects.js, experience.js (real resume data)
│   │   ├── hooks/        useActiveSection, useScrollPosition
│   │   └── styles/       tokens.css (design system), global.css
│   └── public/
│       ├── images/       profile.jpg
│       └── resume.docx   (downloadable)
└── server/          Express API
    └── src/
        ├── models/       Message, Project, Skill, Experience
        ├── controllers/  contact, project, skill, experience
        ├── routes/       all REST routes
        └── middleware/   error handler, validators
```

## Sections Built
- **Navbar** — Floating glassmorphic, magnetic hover, scroll-shrink, active scroll-spy, mobile hamburger
- **Hero** — Parallax photo, word-reveal typing animation, cinematic reel modal, CTA buttons, resume download
- **About** — Animated timeline (2022–2025 journey), stat counters (CGPA 9.35, 3+ projects…), skill badges
- **Skills** — Scroll-triggered SVG roadmap path + 16 animated skill cards with proficiency bars by category
- **Projects** — 3D tilt cards for ResolveX, TeamBuddy, TravelTales with dynamic lighting, GitHub links
- **Experience** — Animated vertical timeline (Sensation Software internship + BCA), Publications, Certifications, Achievements
- **Contact** — Animated form with real-time validation, wired to POST /api/contact, success animation
- **Footer** — Real GitHub + LinkedIn links, quick nav

## Running Locally

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI (local or Atlas) + SMTP credentials
npm run dev            # runs on :5000
```

### Frontend
```bash
cd client
npm install
# .env.local already set to http://localhost:5000/api
npm run dev            # runs on :5173
```

## Media Assets
- **Profile photo**: `client/public/images/profile.jpg` ✅ (your photo, already included)
- **Intro reel**: add `client/public/videos/reel.mp4` — Play Reel button is wired to it
- **Resume**: `client/public/resume.docx` ✅ (already included)

## Deployment
- **Frontend**: Netlify / Vercel — `npm run build` → deploy `dist/`
- **Backend**: Railway / Render — set env vars from `.env.example`
- **DB**: MongoDB Atlas (free tier works perfectly)

## Real Data from Resume
All portfolio content is populated directly from Saksham's resume:
- Real projects with GitHub links
- Real experience at Sensation Software Solutions
- Real skills (16 technologies across 5 categories)  
- Real contact info and social profiles
- Real achievements (CGPA 9.35, ICMR–IET paper, JAM winner, BPD winner)
