
# PokeWorld 🐾

## Fullstack Pokémon App
- **Frontend** : React 18 + PokeAPI + i18n (9 langues)
- **Backend** : Node.js/Express + Prisma ORM
- **Database** : Supabase PostgreSQL

## Features
- Pokédex complet (générations 1-9)
- Mini-jeux (quiz, pendu, type guess)
- Filtres légendaires/types/couleurs
- Navbar responsive + pokesprites
- Multi-langues (FR/EN/ZH/...)

## Local Setup
```bash
# Clone
git clone https://github.com/ha-sombre/pokeworld.git
cd pokeworld

# Backend
cd backend
cp .env.example .env  # Add DATABASE_URL
npm install
npx prisma generate
npm start  # http://localhost:5000

# Frontend
cd ../frontend
npm install
npm start  # http://localhost:3000
```

## Production
- Frontend: https://pokeworld.vercel.app
- Backend: https://pokeworld-backend.railway.app
- DB: Supabase

## Deploy
```bash
# Backend Railway: DATABASE_URL env var
# Frontend Vercel: REACT_APP_API_URL env var
```

**Live Demo** : [pokeworld.vercel.app](https://pokeworld.vercel.app)
