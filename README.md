# TinyHop — Links, Elevated.

TinyHop is a professional, high-performance URL shortener and link management platform. It offers an elegant user interface for creating, managing, and analyzing short links, complete with features like custom aliases, password protection, bulk link shortening, and detailed click analytics.

## 🎥 Project Demonstration
---
- **Watch the Walkthrough:** [![Loom Video](https://img.shields.io/badge/LOOM-VIDEO-635BFF?style=for-the-badge&logo=loom&logoColor=white&labelColor=555555)](https://www.loom.com/share/7c82266bdf1f4f8db279f63b03d1c19a)

## Architecture & AI Planning Document

TinyHop is built using a modern, scalable architecture. The application is divided into a decoupled client and server to ensure performance, security, and maintainability.

### Architecture Diagram

```mermaid
graph TD
    Client[React + Vite Frontend\nDeployed on Vercel]
    Server[Node.js + Express Backend\nDeployed on Render]
    DB[(PostgreSQL Database\nHosted on Neon via Prisma)]
    
    User((User)) -->|HTTPS Requests| Client
    Client -->|REST API Calls| Server
    Server -->|Prisma ORM Queries| DB
```

### AI Planning Summary
During the initial planning and development phases, AI played a crucial role in:
1. **Design Systems**: Architecting a cohesive, premium UI using `lucide-react` for iconography and custom SVG micro-animations, eliminating generic styling in favor of modern aesthetics.
2. **Component Structure**: Splitting the frontend into modular pages (Dashboard, Analytics, BulkShorten) and separating the API logic into modular controllers in the Node.js backend.
3. **Database Schema**: Designing relational structures for `User`, `Url`, and `ClickAnalytics` models via Prisma to allow robust aggregations and secure relational linking.
4. **CORS & Deployment Fixes**: Programmatically diagnosing and resolving cross-origin resource sharing (CORS) rules between Vercel and Render deployments.

## Setup Instructions

To run TinyHop locally, follow these steps:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A PostgreSQL database URL (e.g., via Neon, Supabase, or local)

### 1. Clone the repository
```bash
git clone https://github.com/sanjaim25/tinyhop_url.git
cd tinyhop_url
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory and add your connection strings:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:5173"
```
- Push the database schema:
```bash
npx prisma db push
```
- Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
- Create a `.env` file in the `client` directory:
```env
VITE_API_URL="http://localhost:5000"
```
- Start the frontend server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Assumptions Made

- **Database**: Assumed the use of a cloud PostgreSQL provider (Neon) capable of handling pooled connections, hence the use of Prisma ORM.
- **Environment**: Assumed a split hosting environment—Vercel for static client assets and Render for the Node API.
- **Authentication**: JWT-based authentication is used for stateless, scalable session management.
- **Client Features**: Modern browsers with JavaScript enabled are required to utilize features like copy-to-clipboard, PDF generation, and drag-and-drop bulk CSV uploads.

## Future Updates

We are constantly working to improve TinyHop. Here are some of the features planned for future releases:
- **Advanced Analytics**: Geolocation tracking, device/browser statistics, and referrer tracking for deeper insights into link engagement.
- **Custom Domains**: Allow users to link their own domains (e.g., `link.yourbrand.com`) for fully white-labeled short URLs.
- **Link Expiration & Expiry Schedules**: Set automated schedules for links to activate and deactivate, ideal for time-sensitive campaigns.
- **API Access**: Provide a robust public API for developers to programmatically create and manage links from their own applications.
- **Team Workspaces**: Collaborate with team members, manage shared link collections, and assign role-based access.

---

This project is a part of a hackathon run by https://katomaran.com
