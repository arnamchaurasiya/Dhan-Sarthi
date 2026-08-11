# 🚀 Vercel Deployment Guide - Dhan-Sarthi

This guide explains how to deploy the **Dhan-Sarthi** web prototype and Android Simulator to **Vercel**.

---

## 🌟 What This Deployment Includes

When deployed to Vercel:
1. **Desktop / Laptop View**: Displays a photorealistic interactive **Android Mobile Simulator** (Pixel 8 / Galaxy S24 style) running the full live Dhan-Sarthi app.
2. **Download App Option**: Features a **"Download Android APK"** button that downloads `dhan-sarthi-v1.0.0.apk` directly.
3. **QR Code Scanner**: Displays an interactive **QR Code** so judges and users can scan with their smartphone camera to open the app or download the APK directly to their phones.
4. **Interactive Controls**: Includes **Restart Prototype** navigation button and **Device Frame Style Toggle**.
5. **Mobile View**: Automatically adapts to full-screen view when opened directly on a smartphone browser.

---

## 🛠️ Deployment Options

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Add Vercel web deployment with Android simulator and APK download"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
   - Select your repository (`Dhan-Sarthi` or `arnamchaurasiya/Dhan-Sarthi`).

3. **Configure Project Settings**:
   - **Framework Preset**: `Other` (or `Expo`)
   - **Build Command**: `cd mobile && npm install && npm run build` *(Pre-configured in vercel.json)*
   - **Output Directory**: `mobile/dist` *(Pre-configured in vercel.json)*

4. **Click Deploy**:
   - Vercel will build and deploy your app in ~1-2 minutes!
   - You will get a live production URL like `https://dhan-sarthi.vercel.app`.

---

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   Run the following command from the root directory:
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy: **`y`**
   - Which scope: **Select your account**
   - Link to existing project: **`n`**
   - What's your project's name: **`dhan-sarthi`**
   - In which directory is your code located: **`./`**

3. **Production Deployment**:
   ```bash
   vercel --prod
   ```

---

## 📱 Updating the APK Download File

The downloadable APK file is located at:
```
mobile/public/dhan-sarthi.apk
```
When you run `npx eas-cli build -p android --profile preview` to generate your production/preview APK file from EAS, simply place your output `.apk` file into `mobile/public/dhan-sarthi.apk`. Expo Web and Vercel will automatically host it for direct 1-click download on the website!
