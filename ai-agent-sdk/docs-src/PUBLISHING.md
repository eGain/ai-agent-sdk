# Publishing @egain/ai-agent-sdk to eGain Enterprise Registry

This guide explains how to manually publish the `@egain/ai-agent-sdk` package to the eGainDev organization's GitHub Packages registry at [https://github.com/orgs/eGainDev/packages](https://github.com/orgs/eGainDev/packages).

## Prerequisites

1. **GitHub Personal Access Token (PAT)**
   - Create a token with `write:packages` permission
   - Go to: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Or: https://github.com/settings/tokens

2. **Access to eGainDev GitHub Organization**
   - Ensure you have write access to the eGainDev organization's GitHub Packages
   - Organization: [https://github.com/orgs/eGainDev](https://github.com/orgs/eGainDev)

## Quick Start: Simple Publishing

The publishing process is now simplified! Just set your GitHub token as an environment variable and run the publish command.

### Step 1: Set Your GitHub Token

You have two options to set your GitHub Personal Access Token:

#### Option A: Using .env file (Recommended)

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your token
GITHUB_TOKEN=your_github_token_here
```

The `.env` file is already in `.gitignore`, so your token won't be committed to the repository.

#### Option B: Using Environment Variables

**On macOS/Linux:**
```bash
export GITHUB_TOKEN=your_github_token_here
```

**On Windows (PowerShell):**
```powershell
$env:GITHUB_TOKEN="your_github_token_here"
```

**On Windows (CMD):**
```cmd
set GITHUB_TOKEN=your_github_token_here
```

**Alternative:** You can also use `NPM_TOKEN` instead of `GITHUB_TOKEN`:
```bash
export NPM_TOKEN=your_github_token_here
# or in .env file:
# NPM_TOKEN=your_github_token_here
```

### Step 2: Publish

That's it! Just run:
```bash
npm run publish-package
```

The publish script will automatically:
1. ✅ Check for your token in environment variables
2. ✅ Configure npm authentication
3. ✅ Clean, build, and test (via `prepublishOnly`)
4. ✅ Publish to GitHub Packages

## Configuration Details

The `.npmrc` file is already configured:
```
@egain:registry=https://npm.pkg.github.com/
```

The publish script (`scripts/publish.js`) automatically:
- Loads environment variables from `.env` file (if it exists)
- Falls back to system environment variables
- Sets the authentication token in npm config
- Publishes to GitHub Packages

You don't need to manually configure npm authentication.

## Complete Publishing Workflow

### Step 1: Update Version (if needed)

Before publishing a new version, update the version in `package.json`:
```bash
# For patch version (0.0.1 → 0.0.2)
npm version patch

# For minor version (0.0.1 → 0.1.0)
npm version minor

# For major version (0.0.1 → 1.0.0)
npm version major
```

Or manually edit `package.json` and update the `version` field.

### Step 2: Set Your GitHub Token

Make sure your GitHub token is set either in a `.env` file or as an environment variable:

**Using .env file (recommended):**
```bash
# Create .env file from example
cp .env.example .env
# Edit .env and add: GITHUB_TOKEN=your_token_here
```

**Or using environment variable:**
```bash
export GITHUB_TOKEN=your_github_token_here
```

### Step 3: Dry Run (Optional but Recommended)

Test the publish process without actually publishing:
```bash
npm run publish:dry-run
```

This will show you what would be published without actually publishing it.

### Step 4: Publish

Publish to the eGain enterprise registry:
```bash
npm run publish-package
```

The `prepublishOnly` script will automatically:
- Clean previous builds
- Build the SDK
- Run tests

If any step fails, publishing will be aborted.

The package will be published to: `https://npm.pkg.github.com/@egain/ai-agent-sdk`

You can view it at: [https://github.com/orgs/eGainDev/packages](https://github.com/orgs/eGainDev/packages)

## Verification

After publishing, verify the package is available:

```bash
npm view @egain/ai-agent-sdk versions --registry=https://npm.pkg.github.com/
```

Or check on GitHub:
- Go to [https://github.com/orgs/eGainDev/packages](https://github.com/orgs/eGainDev/packages)
- Look for `@egain/ai-agent-sdk`

## Installing the Published Package

To install the published package in another project, configure `.npmrc` in that project:

```
@egain:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:
```bash
npm install @egain/ai-agent-sdk
```

## Troubleshooting

### Error: "GitHub Personal Access Token not found!"

**Solution:** Make sure you've set the `GITHUB_TOKEN` or `NPM_TOKEN`:

**Option 1: Using .env file (recommended):**
```bash
# Copy example file
cp .env.example .env
# Edit .env and add: GITHUB_TOKEN=your_token_here
```

**Option 2: Using environment variable:**
```bash
export GITHUB_TOKEN=your_token_here
```

### Error: "403 Forbidden" or "You do not have permission"

**Solution:** 
- Verify your GitHub token has `write:packages` permission
- Ensure you have access to the **eGainDev** GitHub organization
- Check that the token hasn't expired
- Verify the token is correctly set: `echo $GITHUB_TOKEN`
- Make sure you're authenticated with the correct GitHub account that has access to eGainDev

### Error: "You must be logged in to publish packages"

**Solution:** This shouldn't happen with the new script, but if it does:
1. Verify `GITHUB_TOKEN` is set: `echo $GITHUB_TOKEN`
2. Make sure the token is valid and has `write:packages` permission
3. Try running the publish command again

### Error: "Version already exists"

**Solution:** Update the version number in `package.json` before publishing:
```bash
npm version patch  # or minor, or major
```

### Error: "Package name must be lowercase"

**Solution:** The package name `@egain/ai-agent-sdk` uses the organization name `eGainDev` (with capital G and D). This is correct for GitHub Packages. If you see this error, verify the package name in `package.json` matches `@egain/ai-agent-sdk` exactly.

## Next Steps: Automation

Once manual publishing is working, you can automate this process using:
- GitHub Actions (CI/CD)
- npm scripts with version bumping
- Semantic versioning automation tools

See the automation documentation (to be created) for details.
