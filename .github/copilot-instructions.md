# Luzartwork - AI Coding Agent Instructions

## Project Overview
This is a **one-page artist portfolio** with JWT-authenticated admin dashboard. The portfolio displays all content on a single scrollable page with sections: Hero, About (Presentation), Gallery, and Contact. The admin interface is separate and protected.

**Architecture**: Single-page portfolio (public) + protected admin CRUD interface. The app is a monorepo with Angular 19 frontend and Node.js/Express backend, deployed on Hostinger with **MongoDB Atlas** cloud database.

**Color Scheme**: Green (#10b981) and Blue (#3b82f6) gradients throughout the design.

## Critical Technical Stack

### Frontend (Angular 19)
- **Standalone components** (no NgModules) - all components use `standalone: true`
- **Zoneless change detection** (`provideZonelessChangeDetection()`) - no Zone.js
- **Signals API** for state management - use `signal()`, `computed()`, not RxJS subjects
- **Functional route guards** - `CanActivateFn`, not class-based guards
- **Functional HTTP interceptors** - `HttpInterceptorFn`, not class-based
- **Smooth scroll navigation** - Fixed navbar with anchor links to page sections

### Backend (Express + MongoDB Atlas)
- JWT authentication with 24h token expiration
- Multer for file uploads (5MB limit, images only)
- Mongoose models with validation
- Manual route protection via `auth` middleware
- **MongoDB Atlas** cloud database (no local MongoDB)

## Project Structure Conventions

```
frontend/src/app/
  ├── components/
  │   ├── gallery/           # Main one-page portfolio (Hero + all sections)
  │   ├── presentation/      # Artist bio and timeline section
  │   ├── contact/           # Contact form and info section
  │   ├── login/             # Admin login page
  │   ├── admin-dashboard/   # Admin CRUD interface
  │   └── navbar/            # Fixed navigation with smooth scroll
  ├── services/              # Injectable services with inject() pattern
  ├── models/                # TypeScript interfaces
  ├── guards/                # Functional guards (authGuard)
  └── interceptors/          # Functional interceptors (authInterceptor)

backend/
  ├── models/                # Mongoose schemas (User, Artwork)
  ├── routes/                # Express routers with validation
  ├── middleware/            # auth.js (JWT verification)
  └── uploads/               # User-uploaded images (git-ignored)
```

## Page Structure

### Public Page (/) - One-Page Portfolio
1. **Hero Section** (`#accueil`) - Full-height intro with title and CTA
2. **Presentation Section** (`#presentation`) - Artist bio, photo, and timeline
3. **Gallery Section** (`#galerie`) - Grid of artworks with modal details
4. **Contact Section** (`#contact`) - Contact form and social links

### Admin Pages
- **/login** - Authentication page
- **/admin** - Protected dashboard for CRUD operations

## Essential Patterns

### 1. Angular Signal-Based Components
All components use signals for reactivity:
```typescript
artworks = signal<Artwork[]>([]);
loading = signal<boolean>(false);
// Update: this.artworks.set(newData);
// Read: this.artworks() or in templates {{ artworks() }}
```

### 2. Dependency Injection Pattern
Use `inject()` function, not constructor injection:
```typescript
private authService = inject(AuthService);
private router = inject(Router);
```

### 3. JWT Authentication Flow
- Token stored in `localStorage` with key `'auth_token'`
- `AuthService.isAuthenticated()` decodes JWT and checks expiry
- `authInterceptor` automatically adds `Authorization: Bearer <token>` header
- Backend `auth` middleware validates JWT on protected routes

### 4. File Upload Pattern
Admin dashboard uses `FormData` for multipart uploads:
```typescript
const formData = new FormData();
formData.append('title', artwork.title);
formData.append('image', this.selectedFile()!);
this.artworkService.createArtwork(formData).subscribe(...)
```

Backend multer config in `backend/routes/artworks.js`:
- Files saved to `uploads/` with unique names
- Returns URL as `/uploads/artwork-{timestamp}-{random}.{ext}`

### 6. Smooth Scroll Navigation
Navbar uses fixed positioning with smooth scroll to sections:
```typescript
scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
```
Global CSS: `html { scroll-behavior: smooth; scroll-padding-top: 70px; }`

### 7. Color Palette
Primary gradient: `linear-gradient(135deg, #10b981 0%, #3b82f6 100%)`
- Green: #10b981 (hover: #059669)
- Blue: #3b82f6 (hover: #2563eb)
- Applied consistently across all components
Images can be:
- Uploaded files: `/uploads/artwork-xxx.jpg` (relative path from backend)
- External URLs: `https://...` (absolute URLs)

Frontend constructs full URL: `${environment.apiUrl}${imageUrl}` for relative paths.

## Development Workflows

### Setup MongoDB Atlas (REQUIRED)
1. Create free account at https://www.mongodb.com/cloud/atlas/
2. Create a cluster (M0 free tier)
3. Create database user in "Database Access"
4. Whitelist IP (0.0.0.0/0) in "Network Access"
5. Get connection string from "Connect" → "Connect your application"
6. Update `backend/.env` with connection string

### Start Development Environment
```bash
npm run dev  # Starts both frontend:4200 and backend:3000 concurrently
```

Individual commands:
```bash
npm run dev:frontend  # Angular on :4200
npm run dev:backend   # Express on :3000
```

### Create First Admin User
**IMPORTANT**: Must run after backend is connected to MongoDB:
```bash
cd backend
npm run create-admin  # Interactive CLI prompts
```
This is the ONLY way to create admin users (no registration UI).

### Build for Production
```bash
cd frontend
ng build --configuration=production
# Output: frontend/dist/frontend/browser/
```

## API Endpoints Reference

### Public Routes
- `GET /api/artworks` - List all artworks (sorted by order, then createdAt)
- `GET /api/artworks/:id` - Single artwork detail
- `GET /api/health` - Health check

### Protected Routes (require JWT)
- `POST /api/artworks` - Create artwork (multipart/form-data)
- `PUT /api/artworks/:id` - Update artwork (multipart/form-data)
- `DELETE /api/artworks/:id` - Delete artwork

### Auth Routes
- `POST /api/auth/login` - Login (returns `{ token, user }`)
- `POST /api/auth/register` - Create admin (should be protected in production)

## Environment Configuration

### Development
Backend `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
JWT_SECRET=dev_secret_change_in_production
FRONTEND_URL=http://localhost:4200
```

Frontend `environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production
Update `frontend/src/environments/environment.prod.ts` with deployed API URL:
```typescript
apiUrl: 'https://yourdomain.com/api'
```

## Deployment (GitHub Actions + Hostinger FTP)

Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Builds Angular production bundle
- Deploys frontend to `/public_html/` via FTP
- Deploys backend to `/api/` via FTP (excludes node_modules)

**Required GitHub Secrets**:
- `FTP_SERVER` - Hostinger FTP address
- `FTP_USERNAME` - FTP username
- `FTP_PASSWORD` - FTP password

**Server Setup**: 
- Backend runs as Node.js app on Hostinger (configured in hosting panel)
- MongoDB Atlas used for database (Hostinger doesn't provide MongoDB)
- Update `MONGODB_URI` in backend `.env` with Atlas connection string

## Common Pitfalls

1. **Don't use NgModules** - This project is fully standalone
2. **Don't use Zone.js patterns** - No `ChangeDetectorRef.detectChanges()`
3. **MongoDB Atlas is required** - No local MongoDB setup, use cloud database
4. **Token expiry is client-side only** - `AuthService.isAuthenticated()` checks expiry, backend also validates
5. **Image paths are relative** - Backend serves `/uploads` as static, frontend must construct full URLs
6. **CORS must match** - `FRONTEND_URL` in backend `.env` must match Angular dev server
7. **No user registration UI** - Only CLI `create-admin.js` script
8. **Smooth scroll requires section IDs** - All sections must have proper `id` attributes

## Testing Key Flows

### Test API Connection
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"OK","message":"API fonctionne correctement"}
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3000/api/artworks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Data Model Reference

### Artwork Schema
```javascript
{
  title: String (required),
  description: String,
  imageUrl: String (required),
  category: enum ['peinture', 'sculpture', 'dessin', 'photographie', 'digital', 'autre'],
  year: Number,
  dimensions: String,
  technique: String,
  price: Number,
  isAvailable: Boolean (default: true),
  order: Number (default: 0), // For manual sorting
  createdAt: Date
}
```

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (bcrypt hashed),
  role: String (default: 'admin')
}
```

## When Modifying Code

- **Adding API endpoints**: Update `backend/routes/`, add validation, protect with `auth` middleware if needed
- **Adding frontend features**: Create standalone components, use signals for state, inject services
- **Changing models**: Update BOTH `backend/models/` (Mongoose) AND `frontend/src/app/models/` (TypeScript interfaces)
- **Styling**: SCSS files are component-scoped, global styles in `frontend/src/styles.scss`
- **Deployment changes**: Modify `.github/workflows/deploy.yml` and `DEPLOYMENT.md`

## Quick Reference Commands

```bash
npm run install:all        # Install all dependencies
npm run dev                # Start both frontend + backend
cd backend && npm run create-admin  # Create admin user
ng build --configuration=production # Production build
```

See `COMMANDS.md` for comprehensive command reference.
