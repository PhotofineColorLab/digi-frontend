# Photofine Album Creator

A beautiful web application for creating and sharing digital photo albums with page-turning animations.

## Features

- Create digital albums with multiple images
- Select a cover image for your album
- Add descriptions to your albums
- Share albums with shareable links
- Cross-browser compatibility with MongoDB backend
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Other**: React Router, UUID

## Project Structure

- `src/` - Frontend React application
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `services/` - API services
  - `types/` - TypeScript type definitions
  - `config/` - Configuration files
- `server/` - Backend Express server (with its own package.json)
  - `controllers/` - Request handlers
  - `models/` - MongoDB models
  - `routes/` - API routes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd photofine-album-creator
   ```

2. Install dependencies for both frontend and backend
   ```
   npm run install:all
   ```

   This will install dependencies for both the frontend and backend projects.

3. Set up environment variables:

   **For the frontend**, update your Cloudinary configuration in `src/config/cloudinary.ts`:
   ```typescript
   export const cloudinaryConfig = {
     cloudName: 'your-cloud-name',
     uploadPreset: 'your-upload-preset',
     apiKey: 'your-api-key'
   };
   ```

   **For the backend**, create a `.env` file in the `server` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/photofine
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

To run both the frontend and backend servers concurrently:

```
npm run dev
```

This will start:
- Backend server at http://localhost:5000
- Frontend development server at http://localhost:3000

### Running Frontend and Backend Separately

To run the frontend only:
```
npm run dev:frontend
```

To run the backend only:
```
npm run dev:backend
```

For production mode backend:
```
npm run start:backend
```

### Building for Production

To build the frontend for production:
```
npm run build
```

This creates optimized production build in the `dist` directory. 

When the backend is run in production mode, it will automatically serve the static files from the `dist` directory.

## Backend API

The backend provides a RESTful API for managing albums. See the [server README](./server/README.md) for detailed API documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 