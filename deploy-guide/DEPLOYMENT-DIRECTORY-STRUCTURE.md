# FlingPing.co Deployment Directory Structure

This document outlines the directory structure and important files for the FlingPing.co application. Understanding this structure is crucial for proper deployment and maintenance.

## Root Directory Structure

```
/flingping-site
├── client/               # Frontend code
├── deploy-guide/         # Deployment documentation
├── public/               # Static assets
├── server/               # Backend code
├── shared/               # Shared code between frontend and backend
├── .env                  # Environment variables (not included in repository)
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Client Directory (Frontend)

```
/client
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # UI components (buttons, forms, etc.)
│   │   └── [other components]
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and services
│   ├── pages/            # Page components
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
```

## Server Directory (Backend)

```
/server
├── index.ts              # Server entry point
├── integrations.ts       # External integrations (Google Sheets)
├── routes.ts             # API routes
├── storage.ts            # Database/storage interface
├── stripe.ts             # Stripe payment integration
└── vite.ts               # Vite server setup
```

## Shared Directory

```
/shared
└── schema.ts             # Database schema and types
```

## Public Directory

```
/public
├── assets/               # Public static assets
├── images/               # Image files
└── favicon.ico           # Site favicon
```

## Key Files for Deployment

### Configuration Files

- `.env` - Environment variables (should be set on the server, not included in repository)
- `package.json` - Node.js dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build and development configuration

### Entry Points

- `server/index.ts` - Main server entry point
- `client/src/main.tsx` - Main client entry point

### Build Output

When built for production, the application generates:

```
/dist
├── client/               # Compiled frontend code
└── server/               # Compiled backend code
```

## Important Considerations for Deployment

1. **Environment Variables**: All environment variables listed in the deployment guide must be set on the server.

2. **Node.js Version**: The application requires Node.js 16 or higher.

3. **Build Process**: The application needs to be built before deployment using `npm run build`.

4. **Entry Point**: The main entry point for the application is `server/index.js` (compiled from `server/index.ts`).

5. **Static Assets**: All static assets are served from the `/public` directory and `/dist/client` after building.

## Post-Build Structure

After running `npm run build`, the directory structure will look like:

```
/flingping-site
├── client/               # Source frontend code
├── deploy-guide/         # Deployment documentation
├── dist/                 # Compiled code (this is what gets served)
│   ├── client/           # Compiled frontend code
│   └── server/           # Compiled backend code
├── public/               # Static assets
├── server/               # Source backend code
├── shared/               # Source shared code
├── .env                  # Environment variables (not included in repository)
├── package.json          # Node.js dependencies and scripts
└── [other config files]
```

## For Hostinger Deployment

When deploying to Hostinger, ensure:

1. The entire project directory is uploaded
2. Node.js is configured to use `dist/server/index.js` as the entry point
3. All required environment variables are set in the Hostinger control panel
4. The project has been built using `npm run build` before uploading