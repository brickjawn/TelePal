# TelePal - PWA Teleprompter

A professional teleprompter Progressive Web App with script storage, offline capabilities, and zero dependencies.

## 🚀 Features

### Core Functionality
- **Script Editor**: Rich text editor with word count and time estimation
- **Script Library**: Save, organize, and manage multiple scripts
- **Smooth Teleprompter**: Variable speed control (0.1x to 5x) with smooth scrolling
- **Professional Controls**: Keyboard shortcuts and intuitive controls
- **Fullscreen Mode**: Distraction-free teleprompter experience

### PWA Features
- **Offline Capable**: Works without internet connection
- **Installable**: Install as a native app on any device
- **Script Storage**: Local storage with import/export functionality
- **Auto-save**: Automatic script saving every 30 seconds
- **Background Sync**: Sync scripts when connection is restored

### Customization
- **Font Size**: Adjustable from 12px to 72px
- **Colors**: Customizable text and background colors
- **Line Spacing**: Adjustable from 0.8x to 2.5x
- **Text Alignment**: Left, center, or right alignment
- **Mirroring**: Horizontal text mirroring for professional setups
- **High Contrast**: Enhanced visibility mode

## 🎯 Quick Start

1. **Open the application**:
   ```bash
   # Simply open index.html in your browser, or:
   python3 -m http.server 8000  # Then visit http://localhost:8000
   ```

2. **Install as PWA** (optional):
   - Look for the install prompt in your browser
   - Click "Install" to add to your home screen/apps

3. **Create your first script**:
   - Enter a title for your script
   - Type your content in the text area
   - Use line breaks for natural pauses
   - Scripts are automatically saved

4. **Start teleprompter**:
   - Click "Start Teleprompter"
   - Use spacebar to play/pause
   - Adjust speed with arrow keys or slider
   - Press Escape to exit fullscreen

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Look for the install icon in the address bar
3. Click "Install TelePal"
4. The app will be added to your applications

### Mobile (iOS/Android)
1. Visit the app in Safari/Chrome
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Spacebar` | Play/Pause teleprompter |
| `↑ Arrow` | Increase speed |
| `↓ Arrow` | Decrease speed |
| `Escape` | Exit fullscreen |

## 🎛️ Script Management

### Script Library
- **Save Scripts**: Automatically saved as you type
- **Load Scripts**: Click on any script to load it
- **Duplicate Scripts**: Create copies of existing scripts
- **Delete Scripts**: Remove scripts you no longer need
- **Import/Export**: Backup and restore your scripts

### Auto-save
- Scripts are automatically saved every 30 seconds
- Manual save with the "Save Script" button
- Auto-save can be disabled in settings

## 🔒 Security & Privacy

### Zero Dependencies
- No npm packages or external libraries
- No supply chain attack risks
- Pure HTML, CSS, and JavaScript

### Local Storage Only
- All scripts stored locally on your device
- No data sent to external servers
- Complete privacy and control

### Offline Capable
- Works without internet connection
- Service worker caches all resources
- Scripts accessible offline

## 📁 File Structure

```
telepal/
├── index.html          # Main application
├── styles.css          # All styling
├── script.js           # All functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
```

## 🛠️ Technical Details

### Browser Compatibility
- **Chrome**: 60+ ✅
- **Firefox**: 55+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅

### PWA Features
- **Service Worker**: Offline functionality
- **Web App Manifest**: Installable app
- **Background Sync**: Data synchronization
- **Push Notifications**: Ready for future features

### Performance
- **Load Time**: < 1 second
- **Memory Usage**: < 10MB
- **File Size**: < 50KB total
- **Offline**: Full functionality without internet

## 🎨 Customization

### Settings
- Font size and family
- Text and background colors
- Line spacing and alignment
- Mirroring and contrast options
- Auto-save preferences

### Script Management
- Import/export scripts
- Duplicate and organize
- Search and filter (future feature)
- Categories and tags (future feature)

## 📋 Use Cases

### Content Creators
- YouTube videos
- Live streams
- Podcast recordings
- Social media content

### Professionals
- Business presentations
- Training videos
- Educational content
- Conference talks

### Broadcasters
- News reading
- Live television
- Radio shows
- Podcast hosting

## 🔧 Advanced Usage

### Import Scripts
```javascript
// Import from JSON file
// Supports single script or array of scripts
{
  "title": "My Script",
  "content": "Script content here...",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### Export Scripts
- Export all scripts as JSON
- Backup your script library
- Share scripts between devices
- Version control your content

## 🚀 Deployment

### Local Development
```bash
# Simple HTTP server
python3 -m http.server 8000
# or
npx serve .
# or
php -S localhost:8000
```

### Web Hosting
- Upload all files to any web server
- No build process required
- Works on any hosting provider
- CDN-friendly static files

### PWA Hosting
- Requires HTTPS in production
- Service worker needs secure context
- Manifest.json for app installation
- Progressive enhancement

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

- **Issues**: Report bugs and request features
- **Documentation**: Check this README
- **Community**: Join discussions

---

**TelePal PWA** - Professional teleprompter with offline capabilities and script storage.