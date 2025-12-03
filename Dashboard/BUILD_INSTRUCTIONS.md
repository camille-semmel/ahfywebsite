# Dashboard Build Instructions

This dashboard is a React + TypeScript + Vite application that integrates with the main Ahfy website.

## Development

To run the dashboard in development mode:

```bash
cd Dashboard
npm install
npm run dev
```

The development server will run on `http://localhost:8080`

## Building for Production

To build the dashboard for production and integrate it with the main website:

```bash
cd Dashboard
npm run build
```

This will:

1. Build the React application with the base path set to `/dashboard/`
2. Output the built files to the `../dashboard-app/` directory (root level of the website)
3. The dashboard will be accessible at `yourwebsite.com/dashboard/`

## Integration with Main Website

The dashboard is integrated with the main website through:

- **Base Path**: Set to `/dashboard/` in `vite.config.ts`
- **Build Output**: Configured to output to `../dashboard-app/` directory
- **Access**: Available via URL path only (not in navigation menu)
  - Production: `https://yourwebsite.com/dashboard/`
  - Development: `http://127.0.0.1:3000/dashboard/` (or your dev server port)

## Important Notes

- The dashboard requires a build step before deployment
- After building, ensure the `dashboard-app/` folder is deployed alongside your main website files
- The React Router is configured to work with the `/dashboard/` base path
- All asset paths are automatically adjusted by Vite during the build process
- The dashboard is not linked in the navigation menu but is accessible via direct URL

## File Structure After Build

```
ahfywebsite/
├── index.html              (main website)
├── about-us.html
├── pricing.html
├── css/
├── js/
├── dashboard-app/          (built React app - created after npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
└── Dashboard/              (source code)
    ├── src/
    ├── package.json
    └── vite.config.ts
```
