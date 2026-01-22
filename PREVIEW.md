# How to Preview The Forge in Your Browser

## Quick Steps (5 minutes)

### Step 1: Install Node.js (if you don't have it)
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer (just click "Next" through all the steps)
4. Restart your terminal/command prompt after installing

**How to check if you have Node.js:**
- Open Terminal (Mac) or Command Prompt (Windows)
- Type: `node --version`
- If you see a version number (like `v20.10.0`), you're good! ✅
- If you see "command not found", you need to install it

### Step 2: Install Project Dependencies
1. Open Terminal/Command Prompt
2. Navigate to your project folder:
   ```bash
   cd /Users/rachelcusumano/Desktop/CursorCode
   ```
   *(On Windows, the path would be something like: `cd C:\Users\YourName\Desktop\CursorCode`)*

3. Install all the required packages:
   ```bash
   npm install
   ```
   *This might take 2-3 minutes. You'll see lots of text scrolling by - that's normal!*

### Step 3: Start the Development Server
Once installation is complete, run:
```bash
npm run dev
```

You should see a message like:
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

### Step 4: Open in Browser
1. Look for the "Local: http://localhost:3000" line
2. Click that link, OR
3. Open your web browser (Chrome, Safari, Firefox, etc.)
4. Type `localhost:3000` in the address bar
5. Press Enter

**You should now see The Forge homepage! 🎉**

### Step 5: Making Changes
- Keep the terminal window open while you're previewing
- If you edit any files, the page will automatically refresh
- To stop the server, press `Ctrl + C` (or `Cmd + C` on Mac) in the terminal

---

## Troubleshooting

**"npm: command not found"**
→ You need to install Node.js (see Step 1 above)

**"Port 3000 is already in use"**
→ Another app is using port 3000. Either:
- Stop that other app, OR
- Use a different port by running: `npm run dev -- -p 3001`
- Then open `localhost:3001` instead

**Nothing shows up or there's an error**
→ Check the terminal window for error messages
→ Make sure you're in the correct folder (`/Users/rachelcusumano/Desktop/CursorCode`)

**The page loads but looks broken**
→ Wait a moment - the first build can take a bit
→ Try refreshing the browser (F5 or Cmd+R)

---

## What You Should See

When everything works, you'll see:
- A nice gradient background
- "The Forge" as the main heading
- "AI-Driven Assignment Synthesizer" as the subtitle
- A search bar where you can type
- A blue "Generate Assignment" button
- An info box explaining how it works

That's it! You're now previewing your app. 🚀
