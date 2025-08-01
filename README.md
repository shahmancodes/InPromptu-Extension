# PromptEZ

A sleek Chrome browser extension that helps you quickly access and copy categorized prompts for LLM chat interfaces. Smart prompts at your fingertips!

## ✨ Features

- **Categorized Prompts**: Organized into 5 categories - Code, Writing & Summarization, Research & Analysis, Creative & Innovation, and Productivity & Planning
- **Detailed Prompts**: Each prompt is comprehensive and includes structured templates for better results
- **Quick Search**: Find prompts instantly with real-time search across all categories
- **Add Custom Prompts**: Create and save your own prompts with the + button
- **One-Click Copy**: Click any prompt to instantly copy it to your clipboard
- **Sleek Design**: Modern, clean interface that's easy to use and navigate
- **Persistent Storage**: Your custom prompts are saved and synced across devices

## 📂 Prompt Categories

### 💻 Code
- **Comprehensive Code Review**: Thorough analysis for quality, performance, security, and bugs
- **Advanced Debugging Assistant**: Systematic debugging with step-by-step approaches
- **Refactor & Optimize Code**: Improve readability, performance, and best practices

### ✍️ Writing & Summarization  
- **Professional Writing Enhancement**: Improve clarity, grammar, and impact
- **Comprehensive Summary & Analysis**: Detailed summaries with key insights
- **Content Adaptation & Repurposing**: Adapt content for different formats and audiences

### 🔍 Research & Analysis
- **Research Strategy & Planning**: Create comprehensive research plans
- **Data Analysis & Insights**: Extract actionable insights from data
- **Competitive Analysis Framework**: Systematic competitor analysis

### 🎨 Creative & Innovation
- **Creative Brainstorming Session**: Generate diverse and innovative ideas
- **Innovation Strategy Framework**: Develop structured innovation approaches

### ⚡ Productivity & Planning
- **Strategic Project Planning**: Comprehensive project management templates
- **Workflow Optimization Analysis**: Streamline processes and improve efficiency

## 🚀 Installation

### Load as Unpacked Extension

1. **Download the extension files**:
   - Download all files in this folder to your computer
   - Keep them in a folder named "PromptEZ" or similar

2. **Enable Developer Mode in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top-right corner

3. **Load the extension**:
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Pin the extension** (recommended):
   - Click the extensions icon (puzzle piece) in Chrome's toolbar
   - Pin "PromptEZ" for easy access

## 📖 How to Use

### Basic Usage

1. **Click the PromptEZ icon** in your browser toolbar
2. **Browse categories** using the tabs at the top
3. **Search for prompts** using the search bar
4. **Click any prompt** to copy it to your clipboard
5. **Paste the prompt** into any LLM chat interface

### Adding Custom Prompts

1. **Click the + button** in the top-right corner
2. **Fill in the details**:
   - **Title**: Give your prompt a descriptive name
   - **Category**: Choose which category it belongs to
   - **Content**: Write your prompt content
3. **Click "Save Prompt"** to add it to your collection

### Search Tips

- **Search by title** or content keywords
- **Use Ctrl+K** (or Cmd+K on Mac) to quickly focus the search bar
- **Clear search** with the X button or by switching categories

### Keyboard Shortcuts

- **Ctrl+K / Cmd+K**: Focus search bar
- **Escape**: Close any open modal or clear search

## 🎨 Design Philosophy

PromptEZ follows a clean, modern design philosophy:
- **Sleek but not fancy**: Professional appearance without unnecessary complexity
- **Category-focused**: Clear organization for easy navigation
- **Search-first**: Quick access to any prompt through instant search
- **Copy-optimized**: One-click copying for seamless workflow

## 🔧 Technical Details

### File Structure

```
PromptEZ/
├── manifest.json              # Extension configuration
├── prompts.json              # Default categorized prompts
├── popup.html                # Main interface
├── popup.css                 # Modern styling
├── popup.js                  # Functionality & interactions
├── icons/                    # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md                 # This file
```

### Storage

- **Local Storage**: Custom prompts are stored locally in your browser
- **Chrome Sync**: Prompts sync across your Chrome browsers when signed in
- **No External Services**: Everything works offline, no data sent to external servers

### Permissions

The extension requires minimal permissions:
- `storage`: To save and sync your custom prompts
- `activeTab`: To interact with the current webpage for copying

## 🎯 Use Cases

### For Developers
- Code reviews and debugging assistance
- Architecture and optimization guidance
- Documentation and testing templates

### For Writers
- Content improvement and adaptation
- Professional communication templates
- Research and analysis frameworks

### For Professionals
- Project planning and management
- Workflow optimization
- Strategic analysis and planning

### For Creatives
- Brainstorming and ideation
- Innovation strategy development
- Creative problem-solving approaches

## 🔄 Updates & Customization

### Adding More Categories

1. Edit `prompts.json` to add new categories
2. Follow the existing structure with `id`, `name`, `icon`, and `prompts`
3. Reload the extension to see changes

### Modifying Existing Prompts

1. Edit the content in `prompts.json`
2. Use markdown formatting for better structure
3. Reload the extension to apply changes

## 🛡️ Privacy & Security

- **No data collection**: PromptEZ doesn't collect or transmit any personal data
- **Local storage only**: All prompts are stored locally in your browser
- **No external connections**: Works completely offline
- **Open source**: Code is transparent and auditable

## 🆘 Troubleshooting

### Extension Not Loading?
1. Make sure Developer Mode is enabled
2. Check that all files are in the same folder
3. Reload the extension from chrome://extensions/

### Prompts Not Copying?
1. Make sure clipboard permissions are granted
2. Try clicking the prompt again
3. Check if other extensions are interfering

### Search Not Working?
1. Clear the search bar and try again
2. Make sure you're typing in the search field
3. Try switching categories to reset the view

## 🚀 Future Enhancements

Planned features for future versions:
- Import/Export prompt collections
- Prompt templates with variables
- Team sharing capabilities
- Integration with popular LLM platforms
- Prompt analytics and usage tracking

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

---

**PromptEZ - Smart prompts at your fingertips!** ✨ 