# InPromptu

A powerful Chrome browser extension that provides smart, categorized prompts for LLM chat interfaces. Access hundreds of professional prompts with a sleek sidebar interface and manage your own custom prompts seamlessly.

![InPromptu Logo](icons/icon48.png)

## ✨ Features

### 🎯 Smart Prompt Management
- **400+ Professional Prompts**: Pre-loaded with comprehensive prompts across 5 categories
- **Custom Prompt Creation**: Add, edit, and delete your own prompts with full management capabilities
- **Universal Edit/Delete**: Treat all prompts equally - edit or delete any prompt, default or custom
- **Real-time Search**: Find prompts instantly with highlighted search results across titles and content
- **Category Filtering**: Organized prompts by Code, Writing, Research, Creative, and Productivity

### 🚀 Seamless Integration
- **Sidebar Interface**: Press `Ctrl+Shift+P` on any LLM site to open the smart sidebar
- **One-Click Insertion**: Click any prompt to instantly insert it into the chat field
- **Cross-Platform Newlines**: Proper line break handling for all LLM platforms (ChatGPT, Claude, Poe, etc.)
- **8 Supported Sites**: Works on ChatGPT, Claude, Poe, Bard, Copilot, Character.AI, Perplexity, and You.com

### 🎨 Modern Interface
- **Sleek Design**: Clean, professional interface with rounded edges and smooth animations
- **Logo Integration**: Beautiful branded experience with custom logo
- **Responsive Layout**: Works perfectly on all screen sizes
- **Dynamic Updates**: Prompt counts and content update in real-time

## 🌐 Supported LLM Platforms

- **ChatGPT** (chat.openai.com, chatgpt.com)
- **Claude AI** (claude.ai)
- **Google Bard** (bard.google.com)
- **Microsoft Copilot** (copilot.microsoft.com)
- **Poe** (poe.com)
- **Character.AI** (character.ai)
- **Perplexity** (perplexity.ai)
- **You.com** (you.com)

## 📂 Prompt Categories

### 💻 Code
- Comprehensive code review and debugging
- Architecture analysis and optimization
- Best practices and refactoring guides

### ✍️ Writing & Summarization
- Professional writing enhancement
- Content adaptation and repurposing
- Comprehensive analysis and summaries

### 🔍 Research & Analysis
- Strategic research planning
- Data analysis and insights
- Competitive analysis frameworks

### 🎨 Creative & Innovation
- Creative brainstorming sessions
- Innovation strategy development
- Design thinking approaches

### ⚡ Productivity & Planning
- Project management templates
- Workflow optimization strategies
- Strategic planning frameworks

## 🚀 Installation

### Method 1: Download from GitHub (Recommended)

1. **Download the Extension**:
   ```bash
   git clone https://github.com/yourusername/inpromptu.git
   ```
   Or download as ZIP and extract to a folder named "InPromptu"

2. **Enable Developer Mode**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" ON in the top-right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Select the InPromptu folder containing all the extension files
   - The extension icon should appear in your toolbar

4. **Pin the Extension** (Optional):
   - Click the extensions icon (🧩) in Chrome's toolbar
   - Find "InPromptu" and click the pin icon to keep it visible

### Method 2: Manual File Download

1. Download these files to a folder named "InPromptu":
   - `manifest.json`
   - `content_script.js`
   - `popup.html`
   - `popup.css`
   - `popup.js`
   - `prompts.json`
   - `icons/` folder with all icon files

2. Follow steps 2-4 from Method 1 above

## 📖 How to Use

### Opening the Sidebar

1. **Navigate to any supported LLM site** (ChatGPT, Claude, etc.)
2. **Press `Ctrl+Shift+P`** to open the InPromptu sidebar
3. **Browse prompts** by category or use the search bar

### Using Prompts

1. **Search or Browse**: Use the search bar or browse categories
2. **Click to Insert**: Click any prompt to instantly insert it into the chat field
3. **Edit Content**: Modify the inserted text as needed before sending

### Managing Prompts

#### Adding Custom Prompts
1. **Click the + button** in the sidebar header
2. **Fill in the form**:
   - **Title**: Descriptive name for your prompt
   - **Category**: Choose from existing categories
   - **Content**: Your prompt text (supports multi-line with `\n`)
3. **Save**: Click "Save Prompt" to add it to your collection

#### Editing Prompts
1. **Hover over any prompt** to see edit/delete buttons
2. **Click the edit button** (pencil icon)
3. **Modify** the title, category, or content
4. **Save** your changes

#### Deleting Prompts
1. **Hover over any prompt** to see edit/delete buttons
2. **Click the delete button** (trash icon)
3. **Confirm** the deletion when prompted

### Search Features

- **Real-time Search**: Results update as you type
- **Highlight Matches**: Search terms are highlighted in yellow
- **Category Search**: Search includes category names
- **No Results Handling**: Clear feedback when no matches found

### Browser Popup

Click the InPromptu icon in your toolbar to access:
- **Quick Start Guide**: Step-by-step usage instructions
- **Supported Sites**: List of compatible LLM platforms
- **Status Information**: Current site compatibility and prompt counts
- **Tips and Shortcuts**: Usage hints and keyboard shortcuts

## ⌨️ Keyboard Shortcuts

- **`Ctrl+Shift+P`**: Open/close sidebar on LLM sites
- **`Escape`**: Close sidebar or modal
- **Click Extension Icon**: Open browser popup for information

## 🔧 Technical Details

### File Structure
```
InPromptu/
├── manifest.json          # Extension configuration (Manifest V3)
├── content_script.js       # Sidebar functionality and prompt injection
├── popup.html             # Browser popup interface
├── popup.css              # Modern styling with rounded edges
├── popup.js               # Popup functionality and storage management
├── prompts.json           # Default categorized prompts database
├── icons/                 # Extension icons and logo
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon-template.svg
└── README.md              # This documentation
```

### Storage & Privacy

- **Local Storage**: Custom prompts stored in `chrome.storage.local`
- **No Cloud Sync**: Everything stays on your device
- **No Data Collection**: Zero telemetry or analytics
- **Offline First**: Works completely without internet
- **Open Source**: Full transparency, audit the code yourself

### Permissions

Minimal permissions for maximum security:
- `activeTab`: To insert prompts into LLM sites
- `storage`: To save your custom prompts locally
- `tabs`: To detect current site compatibility

## 🎯 Use Cases

### For Developers
- **Code Reviews**: Comprehensive analysis templates
- **Debugging**: Systematic troubleshooting approaches
- **Architecture**: Design pattern guidance
- **Documentation**: README and API templates

### For Writers & Marketers
- **Content Creation**: Writing enhancement prompts
- **SEO Optimization**: Content analysis templates
- **Social Media**: Engagement and strategy prompts
- **Copywriting**: Conversion-focused templates

### For Researchers & Analysts
- **Data Analysis**: Statistical insight templates
- **Market Research**: Competitive analysis frameworks
- **Academic Research**: Citation and methodology guides
- **Report Writing**: Executive summary templates

### For Creatives & Innovators
- **Brainstorming**: Idea generation techniques
- **Design Thinking**: User experience frameworks
- **Innovation**: Strategic development approaches
- **Problem Solving**: Creative methodology templates

### For Project Managers
- **Planning**: Comprehensive project templates
- **Risk Assessment**: Management frameworks
- **Team Coordination**: Communication strategies
- **Process Optimization**: Workflow improvement guides

## 🔄 Customization

### Adding New Prompts
- Use the built-in interface (+ button) for the best experience
- All changes are automatically saved and synchronized

### Modifying Categories
1. Edit `prompts.json` to add new categories
2. Follow the existing JSON structure
3. Reload the extension to see changes

### Importing/Exporting (Future Feature)
- Export your custom prompts as JSON
- Import prompts from other users
- Share prompt collections with your team

## 🛡️ Privacy & Security

### Data Protection
- **Zero Data Collection**: No analytics, telemetry, or user tracking
- **Local Storage Only**: All data stays on your device
- **No External Requests**: Completely offline operation
- **XSS Protection**: Proper HTML escaping for all user content

### Security Features
- **Content Sanitization**: All user input is properly escaped
- **Minimal Permissions**: Only requests necessary browser permissions
- **Open Source**: Full code transparency for security auditing

## 🆘 Troubleshooting

### Installation Issues

**Extension not loading?**
- Ensure Developer Mode is enabled in `chrome://extensions/`
- Verify all files are in the same folder
- Check the console for error messages

**Manifest errors?**
- Make sure you have the latest Chrome version
- Ensure all required files are present
- Check file permissions

### Usage Issues

**Sidebar not opening?**
- Verify you're on a supported LLM site
- Try refreshing the page
- Check if other extensions conflict
- Look for console errors (F12)

**Prompts not inserting?**
- Make sure the input field is visible and active
- Try clicking in the chat input first
- Check console for insertion errors

**Edit/Delete buttons not working?**
- Hover over prompts to reveal action buttons
- Ensure JavaScript is enabled
- Try refreshing the sidebar

### Performance Issues

**Sidebar loading slowly?**
- Check if you have many custom prompts
- Clear browser cache if needed
- Restart Chrome if problems persist

## 🚀 Future Roadmap

### Planned Features
- **Import/Export**: Share prompt collections as JSON files
- **Prompt Variables**: Template placeholders for dynamic content
- **Usage Analytics**: Track your most-used prompts
- **Team Sharing**: Collaborate on prompt collections
- **AI Enhancement**: AI-powered prompt suggestions
- **More Platforms**: Support for additional LLM sites

### Community Features
- **Prompt Marketplace**: Community-shared prompt collections
- **Rating System**: Rate and review prompts
- **Version Control**: Track prompt modifications over time

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Use GitHub Issues for bug reports
2. **Feature Requests**: Suggest new features via Issues
3. **Code Contributions**: Submit Pull Requests
4. **Prompt Contributions**: Share useful prompts
5. **Documentation**: Improve this README or add examples

## 📄 License

This project is open source under the MIT License. Feel free to modify, distribute, and use according to your needs.

## 🙏 Acknowledgments

- Icons designed with modern LLM aesthetics in mind
- Prompt templates inspired by industry best practices
- UI/UX following contemporary browser extension standards

---

**InPromptu - Smart prompts at your fingertips!** ✨

*Made with ❤️ for the LLM community* 