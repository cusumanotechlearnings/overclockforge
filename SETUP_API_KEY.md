# Setting Up Your OpenAI API Key

To use The Forge's assignment generation feature, you need an OpenAI API key. Here's how to get one and set it up (5 minutes):

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in with your OpenAI account (or create one if you don't have one)
3. Click the **"Create new secret key"** button
4. Give it a name (e.g., "The Forge") - this is optional but helpful
5. Click **"Create secret key"**
6. **Important:** Copy the key immediately - it starts with `sk-` and you won't be able to see it again!
7. Paste it somewhere safe (like a notes app) temporarily

## Step 2: Create the .env.local File

1. In your project folder (`/Users/rachelcusumano/Desktop/CursorCode`), create a new file
2. Name it exactly: `.env.local` (the dot at the beginning is important!)
3. Open the file in a text editor

## Step 3: Add Your API Key

Inside the `.env.local` file, type this on a single line:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

Replace `sk-your-actual-key-here` with the actual key you copied from OpenAI.

**Example:**
```
OPENAI_API_KEY=sk-proj-abc123xyz789def456ghi789
```

**Important Notes:**
- No spaces around the `=` sign
- No quotes around the key
- The entire thing should be on one line
- Make sure there are no extra spaces at the beginning or end

## Step 4: Save and Restart

1. Save the `.env.local` file
2. If your development server is running, stop it (press `Ctrl+C` or `Cmd+C` in the terminal)
3. Start it again with `npm run dev`
4. The API key will now be loaded automatically!

## Troubleshooting

**"OpenAI API key is not configured" error**
- Make sure the file is named exactly `.env.local` (with the dot at the beginning)
- Make sure it's in the root folder of your project (same folder as `package.json`)
- Make sure there are no typos in `OPENAI_API_KEY`
- Restart your development server after creating/editing the file

**Can't find the .env.local file**
- Some file systems hide files starting with `.` 
- On Mac: In Finder, press `Cmd+Shift+.` to show hidden files
- On Windows: Enable "Show hidden files" in File Explorer settings
- Or just create it directly in your code editor

**Still not working?**
- Double-check that you copied the entire API key (it's quite long)
- Make sure you didn't accidentally include quotes or spaces
- Verify the file is saved in the correct location

## Security Note

The `.env.local` file is already set up to be ignored by git (it's in `.gitignore`), so your API key won't accidentally be committed to version control. This is important - keep your API key private!

## Testing

Once you've set up your API key:
1. Start your development server: `npm run dev`
2. Open http://localhost:3000 in your browser
3. Enter a topic in the search bar (e.g., "ethical decision making")
4. Click "Generate Assignment"
5. You should see a loading spinner, then a generated assignment!

---

**That's it!** You're now ready to generate assignments with The Forge! 🎉
