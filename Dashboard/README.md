# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7a4070b8-3ce3-45d8-befb-13cc519e51cc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7a4070b8-3ce3-45d8-befb-13cc519e51cc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <GIT_URL>

# Step 2: Navigate to the project directory.
cd ./Dashboard

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

The development server will start on **http://localhost:8080** with the base path `/dashboard/`.

**To access the dashboard:**

- Open your browser and navigate to: **http://localhost:8080/dashboard/**
- Or use VS Code's "Simple Browser" preview to view: **http://localhost:8080/dashboard/**

**Important Notes:**

- The dev server runs on port **8080** (configured in vite.config.ts)
- The base path is set to **/dashboard/** to match the deployment structure
- Make sure no other service is using port 8080 before starting the dev server
- The server will automatically reload when you make changes to the code

**Contribution Workflow**

To contribute changes to this project, follow this workflow:

1. **Create a new branch** for your feature or fix:

   ```sh
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in your preferred IDE (VS Code, WebStorm, etc.)

3. **Commit and push** your changes:

   ```sh
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request (PR)** on GitHub:

   - Navigate to the repository on GitHub
   - Click "Pull requests" → "New pull request"
   - Select your branch and create the PR
   - Add a clear description of your changes

5. **Request Review**: Assign another developer to review your PR

6. **Merge**: Once approved by another developer, merge the PR into the main branch

**Note**: Never commit directly to the main branch. All changes must go through the PR review process.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7a4070b8-3ce3-45d8-befb-13cc519e51cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

```

```
