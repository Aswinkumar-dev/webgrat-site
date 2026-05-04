<h1 align="center">
  <img src="frontend/public/Logo.png" alt="Webgrat Logo" height="60" /><br/>
  Webgrat — AI-Powered Digital Marketing Agency
</h1>

<p align="center">
  <strong>Full-stack website for Webgrat, combining a React SPA frontend with a Spring Boot REST API backend.</strong><br/>
  SEO-optimised · Mobile-first · Admin CMS · JWT-secured
</p>

<p align="center">
  <a href="https://webgrat.com" target="_blank">🌐 Live Site</a> &nbsp;·&nbsp;
  <a href="#-getting-started">🚀 Getting Started</a> &nbsp;·&nbsp;
  <a href="#-project-structure">📁 Structure</a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Backend API](#-backend-api)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 🧠 Overview

Webgrat is an AI-powered digital marketing agency website built as a **monorepo** containing:

- A **React + Vite SPA** for the public-facing site and admin panel
- A **Spring Boot REST API** backend for blog management, contact form emails, and admin authentication
- **Supabase** as the authentication provider (JWT-based)
- **PostgreSQL** (via Supabase) as the primary database
- **Resend** for transactional email delivery

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [React Router v6](https://reactrouter.com) | Client-side routing (SPA) |
| [React Helmet Async](https://github.com/staylor/react-helmet-async) | SEO meta tags & structured data |
| CSS Modules | Scoped component styling |
| Vanilla CSS | Global design system & tokens |
| [Google Fonts](https://fonts.google.com) | Montserrat (headings) + Poppins (body) |
| Meta Pixel | Facebook/Instagram ad tracking |

### Backend

| Technology | Purpose |
|---|---|
| [Spring Boot 3.5](https://spring.io/projects/spring-boot) | REST API framework |
| [Spring Security](https://spring.io/projects/spring-security) | Auth & route protection |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | ORM / database access |
| [Thymeleaf](https://www.thymeleaf.org) | Server-rendered blog templates |
| [PostgreSQL](https://www.postgresql.org) | Relational database |
| [Supabase](https://supabase.com) | Auth provider (JWKS JWT verification) |
| [Nimbus JOSE + JWT](https://connect2id.com/products/nimbus-jose-jwt) | JWKS-based JWT filter |
| [JJWT 0.11.5](https://github.com/jwtk/jjwt) | JWT utilities |
| [Lombok](https://projectlombok.org) | Boilerplate reduction |
| [Resend Java SDK](https://resend.com) | Transactional email |
| Java 17 | Runtime |
| Maven | Build & dependency management |

---

## 📁 Project Structure

```
Webgrat/
├── frontend/                        # React + Vite SPA
│   ├── public/
│   │   ├── Logo.png                 # Brand favicon & OG image
│   │   ├── manifest.json            # PWA manifest
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── assets/                  # Images, icons, thumbnails
│       ├── components/
│       │   ├── auth/                # ProtectedRoute
│       │   ├── layout/              # Navbar, Footer, Layout
│       │   ├── ui/                  # Badge, Button, FAQAccordion, BlogCard, ScrollReveal, ...
│       │   ├── home/                # Home-specific sections
│       │   ├── services/            # Services-specific components
│       │   └── admin/               # Admin panel components
│       ├── context/                 # AuthContext (Supabase session)
│       ├── data/                    # Static data (case studies, FAQs, etc.)
│       ├── lib/                     # Supabase client, API helpers
│       ├── pages/                   # One file per route
│       ├── seo/                     # SEOHead component
│       └── styles/                  # Global CSS variables & resets
│
└── backend/
    └── webgrat-agency-project/      # Spring Boot application
        └── src/main/java/com/webgrat/agency/project/
            ├── config/              # CORS, Security config
            ├── controller/          # REST controllers
            ├── dto/                 # Request / Response DTOs
            ├── model/               # JPA entities
            ├── repository/          # Spring Data repositories
            ├── service/             # Business logic
            ├── Security/            # JWT filter, Supabase JWKS
            ├── Exception/           # Global exception handler
            └── web/                 # Thymeleaf blog views
```

---

## 📄 Pages & Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, services overview, trusted-by logos, CTA |
| `/services` | Services | Full service listings (SEO, PPC, AI Automation, etc.) |
| `/about` | About | Team, mission, story |
| `/blog` | Blog | Filterable blog listing (fetched from API) |
| `/blog/:slug` | BlogPost | Individual blog article |
| `/case-studies` | Case Studies | Portfolio of client results, filterable by industry |
| `/case-studies/:slug` | Case Study Detail | Full case study page |
| `/faq` | FAQ | Categorised FAQ with schema.org markup |
| `/contact` | Contact | Multi-field contact form (sends via Resend) |
| `/thank-you` | Thank You | Post-form submission confirmation |
| `/privacy-policy` | Privacy Policy | Legal policy page |
| `/terms-and-conditions` | Terms | Legal terms page |

### Admin Routes (JWT-protected)

| Route | Page | Description |
|---|---|---|
| `/admin/login` | Admin Login | Supabase-authenticated login |
| `/admin/blogs` | Blog List | View, filter, delete blog posts |
| `/admin/blog/new` | New Blog | Markdown editor to create posts |
| `/admin/blog/edit/:id` | Edit Blog | Update existing blog post |

---

## 🔌 Backend API

Base URL: `https://api.webgrat.com` (or `http://localhost:8080` locally)

### Blog Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/blogs/published` | ❌ Public | Fetch all published blog posts |
| `GET` | `/api/blogs` | ✅ JWT | Fetch all posts (admin) |
| `POST` | `/api/blogs` | ✅ JWT | Create a new post |
| `PUT` | `/api/blogs/{id}` | ✅ JWT | Update a post |
| `DELETE` | `/api/blogs/{id}` | ✅ JWT | Delete a post |
| `GET` | `/api/blogs/health` | ❌ Public | Health check |

### Contact Endpoint

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | ❌ Public | Submit contact form (triggers Resend email) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Java 17
- Maven 3.9+
- PostgreSQL (or a Supabase project)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`

### Backend

```bash
cd backend/webgrat-agency-project
./mvnw spring-boot:run
```

Runs at `http://localhost:8080`

---

### Frontend

Copy the example file and fill in your Supabase credentials:

```bash
cp frontend/.env.example frontend/.env
```

Then edit `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8080
```

### Backend

Copy the example file and fill in your database and API keys:

```bash
cp backend/application.properties.example \
   backend/webgrat-agency-project/src/main/resources/application.properties
```

Then edit `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://db.your-project.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-db-password

supabase.jwks-url=https://your-project.supabase.co/auth/v1/keys
allowed.origins=https://webgrat.com

resend.api-key=re_your_resend_api_key
resend.from=hello@webgrat.com
resend.to=your@email.com
```

---


## 🌍 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions including:

- Hosting the React SPA on Hostinger
- Deploying the Spring Boot JAR
- Supabase project setup
- Domain & CORS configuration
- `.htaccess` SPA routing setup

---

## 📄 License

This project is proprietary. All rights reserved © Webgrat.