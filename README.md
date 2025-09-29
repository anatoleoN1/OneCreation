# OneCreation

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18/20-blue.svg)](https://nodejs.org/)
[![OneCreation Version](https://img.shields.io/badge/version-1.00.1r3.-red.svg)](https://github.com/anatoleoN1/OneCreation/releases)

**OneCreation** is a Minecraft-like game built with **Node.js** that you can play directly in your browser.

---

## 📂 Folder Structure

Make sure to extract the ZIP **outside of any other `OneCreation` folder**. The folder structure should look like this:

```markdown
/OneCreation
├── public/
├── server.js
├── start.bat
├── satrt.sh
└── package.json
```

---

## 💻 Installation

### Windows

1. Download the ZIP file.
2. Extract all contents into a folder named `OneCreation`.
3. open PowerShell
4. run the script
```powershell
cmd /c "copy the location of OneCreation folder\start.bat"
```
6. You should see a message in the console:
```powershell
OneCreation launched on http://localhost:<port>
```
5. Open your browser and navigate to the provided URL to start playing.

---

### macOS / Linux

1. Download the ZIP file.
2. Extract all contents into a folder named `OneCreation`.
3. Open a terminal and navigate to the folder:
```bash
cd /path/to/OneCreation
```
4. Give execution permission to the script:
```bash
chmod +x start.sh
```
5. Run the script:
```bash
./start.sh
```
6. The terminal will display:
```bash
OneCreation launched on http://localhost:<port>
```
7. Open your browser and go to the given URL to start playing.

---

## 📝 Notes

Node.js is required. The scripts will automatically download and install the required version for each release:

v1.00.0: Node.js 18.20.8

v1.00.1: Node.js 20.19.5

Windows uses the _start.bat_ script, while macOS/Linux uses _start.sh_.

Make sure the extracted folder is not nested inside another folder named OneCreation, otherwise paths may break.

## ⚙ Features

Minecraft-like game.

block placement/breaking.

menu for wolds.

edition world.

Automatic world save in lightweight .json files.

## 🖥️ Launching the Game

Once started, open your browser and go to the provided http://localhost:<port> address.
Enjoy exploring your own procedurally generated worlds!

## 📌 License

This project is licensed under the MIT License. See the LICENSE file for details.
