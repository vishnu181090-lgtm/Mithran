CONCEPTLAB AI — REAL EMAIL LOGIN SETUP

WHAT THIS UPDATE ADDS
- Email + password sign in
- Sign up with name, email and password
- Supabase-managed authentication sessions
- Sign out button on the learning dashboard
- Email confirmation support (if enabled in Supabase)

FILES
1. App.tsx            Replace src/App.tsx
2. Dashboard.tsx      Put in src/Dashboard.tsx (this is your previous App.tsx renamed)
3. AuthScreen.tsx     Put in src/AuthScreen.tsx
4. auth.css           Put in src/auth.css
5. supabaseClient.ts  Put in src/supabaseClient.ts
6. .env.example       Copy to the project ROOT as .env, then fill in real values

STEP 1 — SUPABASE PROJECT
1. Open https://supabase.com/ and sign in/create a project.
2. Create a project and keep its database password private.
3. In Project Settings / API (or Connect), copy the Project URL and the publishable key / anon public key.
4. In Authentication > Providers, make sure Email is enabled.
5. For development, you can leave email confirmation enabled; users will need to click the confirmation email. You can configure the email confirmation behavior in Supabase Authentication settings.
6. In Authentication > URL Configuration, set Site URL to http://localhost:5173 (or the local port Vite actually prints). Add that same origin to the redirect URLs if required. For production, add your deployed website URL too.

STEP 2 — COPY FILES
Open your existing project folder, likely:
C:\Users\C VIshnuprasad\robotics-mission-control

Copy these files into its src folder:
- App.tsx (replace the existing src/App.tsx)
- Dashboard.tsx (new file; renamed copy of the old src/App.tsx)
- AuthScreen.tsx (new file)
- auth.css (new file)
- supabaseClient.ts (new file)

Important: Dashboard.tsx must be the original ConceptLab AI App.tsx from your project/demo ZIP. Do not overwrite it with a blank file.

STEP 3 — INSTALL AUTH PACKAGE
Open the VS Code terminal at the project root and run:
npm.cmd install @supabase/supabase-js

STEP 4 — ADD YOUR PRIVATE LOCAL CONFIG
At the project root (same folder as package.json), copy .env.example to a file named .env.
Fill it with the actual values from your Supabase project, for example:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-public-key

Use the publishable key or legacy anon public key only. NEVER use a service_role key or secret key in a Vite/browser app. Keep .env out of public repositories; Vite exposes variables beginning with VITE_ to browser code.

STEP 5 — RESTART VITE
Stop the current Vite terminal with Ctrl+C, then run:
npm.cmd run dev
Open the exact Local URL shown by Vite. If it uses port 5176, use http://localhost:5176 rather than assuming 5173.

STEP 6 — TEST
1. Choose Sign up and create a test account.
2. If email confirmation is enabled, open the confirmation email and confirm the account.
3. Log in with that email and password.
4. The ConceptLab dashboard should appear. Use Sign out to return to login.

TROUBLESHOOTING
- If you see the setup card, the .env file is missing, misnamed, or the values are not filled. Restart Vite after changing .env.
- If email confirmation is enabled, sign-up may show a message to check your email before login.
- If Supabase says the redirect URL is not allowed, add the exact local origin shown by Vite to Supabase Authentication > URL Configuration.
- Do not share your password or service-role/secret key in chat or screenshots.
