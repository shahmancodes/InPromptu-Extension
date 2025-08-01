// InPromptu - Content Script (Sidebar)

class InPromptuContent {
  constructor() {
    console.log('InPromptu: Constructor called');
    this.isSidebarOpen = false;
    this.categories = null;
    this.allPrompts = null;
    this.customPrompts = null;
    this.currentCategory = null;
    this.sidebarElement = null;
    this.editingPromptId = null;
    
    // Input selectors for different LLM sites
    this.inputSelectors = {
      'chat.openai.com': '#prompt-textarea, [data-testid="conversation-turn-3"] textarea, div[contenteditable="true"]',
      'chatgpt.com': '#prompt-textarea, [data-testid="conversation-turn-3"] textarea, div[contenteditable="true"]',
      'claude.ai': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'bard.google.com': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'copilot.microsoft.com': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'poe.com': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'character.ai': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'perplexity.ai': 'textarea, div[contenteditable="true"], [data-testid="composer"]',
      'you.com': 'textarea, div[contenteditable="true"], [data-testid="composer"]'
    };
    
    console.log('InPromptu: Input selectors:', this.inputSelectors);
    this.init();
  }

  init() {
    console.log('InPromptu: Initializing...');
    
    // Add event listeners
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);
    window.addEventListener('keydown', this.handleKeydown.bind(this), true);
    
    console.log('InPromptu: Initialization complete');
  }

  handleKeydown(event) {
    console.log('InPromptu: Key pressed:', event.key, 'Ctrl:', event.ctrlKey, 'Shift:', event.shiftKey, 'Meta:', event.metaKey);
    
    // Check for Ctrl+Shift+P - toggle sidebar
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
      console.log('InPromptu: Ctrl+Shift+P detected!');
      event.preventDefault();
      event.stopPropagation();
      
      if (this.isSidebarOpen) {
        this.closeSidebar();
      } else {
        this.openSidebar();
      }
    }
    
    // Close sidebar on Escape
    if (event.key === 'Escape' && this.isSidebarOpen) {
      console.log('InPromptu: Escape pressed, closing sidebar');
      this.closeSidebar();
    }
  }

  async openSidebar() {
    if (this.isSidebarOpen) return;
    
    console.log('InPromptu: Opening sidebar');
    
    // Load prompts if not already loaded
    if (!this.categories) {
      await this.loadPrompts();
    }
    
    this.createSidebar();
    this.isSidebarOpen = true;
    console.log('InPromptu: Sidebar opened');
  }

  closeSidebar() {
    if (!this.isSidebarOpen || !this.sidebarElement) return;
    
    console.log('InPromptu: Closing sidebar');
    this.sidebarElement.classList.add('closing');
    
    setTimeout(() => {
      if (this.sidebarElement && this.sidebarElement.parentNode) {
        this.sidebarElement.parentNode.removeChild(this.sidebarElement);
      }
      this.sidebarElement = null;
      this.isSidebarOpen = false;
      console.log('InPromptu: Sidebar closed');
    }, 300);
  }

  async loadPrompts() {
    console.log('InPromptu: Loading prompts...');
    try {
      // Load default prompts from prompts.json
      const response = await fetch(chrome.runtime.getURL('prompts.json'));
      if (!response.ok) {
        throw new Error(`Failed to fetch prompts.json: ${response.status}`);
      }
      const data = await response.json();
      this.categories = data.categories || [];
      
      // Load custom prompts from local storage
      await this.loadCustomPrompts();
      
      // Merge custom prompts with default categories
      this.mergeCustomPrompts();
      
      // Flatten all prompts for easy access
      this.allPrompts = this.categories.flatMap(category => 
        (category.prompts || []).map(prompt => ({ ...prompt, categoryId: category.id, categoryName: category.name }))
      );
      
      console.log('InPromptu: Loaded categories:', this.categories.length);
      console.log('InPromptu: Total prompts loaded:', this.allPrompts.length);
      console.log('InPromptu: Custom prompts loaded:', this.customPrompts.length);
    } catch (error) {
      console.error('InPromptu: Failed to load prompts:', error);
      this.categories = [];
      this.allPrompts = [];
      this.customPrompts = [];
    }
  }

  async loadCustomPrompts() {
    try {
      const result = await chrome.storage.local.get('customPrompts');
      this.customPrompts = result.customPrompts || [];
    } catch (error) {
      console.warn('InPromptu: Could not load custom prompts:', error);
      this.customPrompts = [];
    }
  }

  async saveCustomPrompts() {
    try {
      await chrome.storage.local.set({ customPrompts: this.customPrompts });
    } catch (error) {
      console.error('InPromptu: Failed to save custom prompts:', error);
      this.showNotification('Failed to save prompt', 'error');
    }
  }

  mergeCustomPrompts() {
    // Create a map of custom prompts by original ID to handle edited default prompts
    const customPromptsByOriginalId = new Map();
    this.customPrompts.forEach(customPrompt => {
      if (customPrompt.originalId) {
        customPromptsByOriginalId.set(customPrompt.originalId, customPrompt);
      }
    });

    // Add custom prompts to their respective categories
    this.customPrompts.forEach(customPrompt => {
      const category = this.categories.find(cat => cat.id === customPrompt.categoryId);
      if (category) {
        // Add custom flag to distinguish from default prompts
        const promptWithFlag = {
          ...customPrompt,
          isCustom: true
        };
        category.prompts.push(promptWithFlag);
      }
    });

    // Replace default prompts that have been edited with their custom versions
    this.categories.forEach(category => {
      if (category.prompts) {
        category.prompts = category.prompts.map(prompt => {
          const customVersion = customPromptsByOriginalId.get(prompt.id);
          if (customVersion) {
            // Replace default prompt with custom version
            return {
              ...customVersion,
              isCustom: true
            };
          }
          return prompt;
        });
      }
    });
  }

  createSidebar() {
    console.log('InPromptu: Creating sidebar...');
    
    // Create sidebar container
    this.sidebarElement = document.createElement('div');
    this.sidebarElement.id = 'inpromptu-sidebar';
    this.sidebarElement.innerHTML = this.getSidebarHTML();
    
    // Add styles
    this.addSidebarStyles();
    
    // Add event listeners
    this.addSidebarEventListeners();
    
    // Append to body
    document.body.appendChild(this.sidebarElement);
    
    // Trigger animation
    setTimeout(() => {
      this.sidebarElement.classList.add('open');
    }, 10);
    
    console.log('InPromptu: Sidebar created and added to body');
  }

  getSidebarHTML() {
    const categoriesHTML = this.generateCategoriesHTML();

    return `
      <div class="sidebar-overlay"></div>
      <div class="sidebar-content">
        <div class="sidebar-header">
          <div class="sidebar-title">
            <img class="logo-icon" src="${chrome.runtime.getURL('icons/icon32.png')}" alt="InPromptu Logo" width="24" height="24">
            <div class="title-text">
              <h2>InPromptu</h2>
              <span class="subtitle">Smart prompts at your fingertips</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="add-prompt-btn" id="sidebar-add-prompt" title="Add new prompt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button class="close-btn" id="close-sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="sidebar-body">
          <div class="search-container">
            <input type="text" id="sidebar-search" placeholder="Search prompts..." />
          </div>
          
          <div class="categories-container">
            ${categoriesHTML}
          </div>
        </div>
        
        <div class="sidebar-footer">
          <div class="footer-info">
            <span class="prompt-count">${this.allPrompts.length} prompts</span>
            <span class="shortcut-hint">Ctrl+Shift+P to toggle</span>
          </div>
        </div>
      </div>

      <!-- Add/Edit Prompt Modal -->
      <div class="sidebar-modal-overlay" id="sidebar-prompt-modal" style="display: none;">
        <div class="sidebar-modal">
          <div class="sidebar-modal-header">
            <h3 id="sidebar-modal-title">Add New Prompt</h3>
            <button class="sidebar-modal-close" id="sidebar-modal-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="sidebar-modal-content">
            <div class="form-group">
              <label for="sidebar-prompt-title">Title</label>
              <input type="text" id="sidebar-prompt-title" placeholder="Enter prompt title..." />
            </div>
            <div class="form-group">
              <label for="sidebar-prompt-category">Category</label>
              <select id="sidebar-prompt-category">
                <option value="code">💻 Code</option>
                <option value="writing">✍️ Writing & Summarization</option>
                <option value="research">🔍 Research & Analysis</option>
                <option value="creative">🎨 Creative & Innovation</option>
                <option value="productivity">⚡ Productivity & Planning</option>
              </select>
            </div>
            <div class="form-group">
              <label for="sidebar-prompt-content">Content</label>
              <textarea id="sidebar-prompt-content" placeholder="Enter your prompt content..." rows="8"></textarea>
            </div>
            <div class="sidebar-modal-actions">
              <button class="btn-secondary" id="sidebar-cancel-prompt">Cancel</button>
              <button class="btn-primary" id="sidebar-save-prompt">Save Prompt</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addSidebarStyles() {
    const styles = `
      #inpromptu-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        z-index: 999999;
        display: flex;
        justify-content: flex-end;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      #inpromptu-sidebar.open {
        opacity: 1;
      }
      
      #inpromptu-sidebar.closing {
        opacity: 0;
      }
      
      .sidebar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
      }
      
      .sidebar-content {
        position: relative;
        width: 400px;
        height: 100%;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }
      
      #inpromptu-sidebar.open .sidebar-content {
        transform: translateX(0);
      }
      
      .sidebar-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .sidebar-title {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }
      
      .logo-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }
      
      .title-text {
        flex: 1;
      }
      
      .title-text h2 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 4px 0;
        letter-spacing: -0.5px;
      }
      
      .subtitle {
        font-size: 12px;
        opacity: 0.85;
        font-weight: 400;
      }
      
      .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .add-prompt-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .add-prompt-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .sidebar-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
      
      .search-container {
        margin-bottom: 20px;
      }
      
      #sidebar-search {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        background: #f9fafb;
        transition: all 0.2s;
        color: #111827;
      }
      
      #sidebar-search:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      #sidebar-search::placeholder {
        color: #9ca3af;
      }
      
      .category-section {
        margin-bottom: 24px;
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .category-icon {
        font-size: 18px;
      }
      
      .category-name {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
      }
      
      .prompts-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .prompt-item {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }
      
      .prompt-item:hover {
        border-color: #667eea;
        background: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
      }
      
      .prompt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      
      .prompt-title {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
        flex-grow: 1;
        margin-right: 8px;
      }
      
      .prompt-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }
      
      .prompt-item:hover .prompt-actions {
        opacity: 1;
      }
      
      .action-btn {
        background: none;
        border: none;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        color: #6b7280;
        transition: all 0.2s;
      }
      
      .action-btn:hover {
        background: #f3f4f6;
        color: #374151;
      }
      
      .action-btn.edit:hover {
        color: #059669;
      }
      
      .action-btn.delete:hover {
        color: #dc2626;
      }
      
      .prompt-preview {
        color: #6b7280;
        font-size: 12px;
        line-height: 1.4;
      }
      
      .sidebar-footer {
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        padding: 12px 20px;
      }
      
      .footer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #6b7280;
      }
      
      .prompt-count {
        font-weight: 500;
      }
      
      .shortcut-hint {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        background: #e5e7eb;
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      /* Sidebar Modal Styles */
      .sidebar-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000000;
        backdrop-filter: blur(2px);
      }
      
      .sidebar-modal {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: modalSlideIn 0.3s ease-out;
        display: flex;
        flex-direction: column;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .sidebar-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f9fafb;
        flex-shrink: 0;
      }
      
      .sidebar-modal-header h3 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
      }
      
      .sidebar-modal-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s;
      }
      
      .sidebar-modal-close:hover {
        color: #374151;
      }
      
      .sidebar-modal-content {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
        scrollbar-width: thin;
        scrollbar-color: #d1d5db transparent;
      }
      
      .sidebar-modal-content::-webkit-scrollbar {
        width: 6px;
      }
      
      .sidebar-modal-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .sidebar-modal-content::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }
      
      .sidebar-modal-content::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s;
        font-family: inherit;
        background: white;
        color: #111827;
      }
      
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        color: #111827;
      }
      
      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: #9ca3af;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }
      
      .form-group textarea {
        resize: vertical;
        min-height: 120px;
        line-height: 1.5;
      }
      
      .sidebar-modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        flex-shrink: 0;
      }
      
      .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }
      
      .btn-primary {
        background: #667eea;
        color: white;
      }
      
      .btn-primary:hover {
        background: #5a67d8;
      }
      
      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
      }
      
      .btn-secondary:hover {
        background: #e5e7eb;
      }
      
      /* Responsive */
      @media (max-width: 480px) {
        .sidebar-content {
          width: 100%;
        }
        
        .sidebar-modal {
          width: 95%;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  addSidebarEventListeners() {
    // Close button
    const closeBtn = this.sidebarElement.querySelector('#close-sidebar');
    closeBtn.addEventListener('click', () => this.closeSidebar());
    
    // Overlay click to close
    const overlay = this.sidebarElement.querySelector('.sidebar-overlay');
    overlay.addEventListener('click', () => this.closeSidebar());
    
    // Add prompt button
    const addPromptBtn = this.sidebarElement.querySelector('#sidebar-add-prompt');
    addPromptBtn.addEventListener('click', () => this.openAddModal());
    
    // Search functionality
    const searchInput = this.sidebarElement.querySelector('#sidebar-search');
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    
    // Set up prompt item event listeners (including edit/delete buttons)
    this.addPromptItemEventListeners();
    
    // Modal events
    this.setupModalEventListeners();
  }

  setupModalEventListeners() {
    const modal = this.sidebarElement.querySelector('#sidebar-prompt-modal');
    const modalClose = this.sidebarElement.querySelector('#sidebar-modal-close');
    const cancelBtn = this.sidebarElement.querySelector('#sidebar-cancel-prompt');
    const saveBtn = this.sidebarElement.querySelector('#sidebar-save-prompt');
    
    modalClose.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());
    saveBtn.addEventListener('click', () => this.savePrompt());
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  }

  openAddModal() {
    this.editingPromptId = null;
    document.getElementById('sidebar-modal-title').textContent = 'Add New Prompt';
    document.getElementById('sidebar-prompt-title').value = '';
    document.getElementById('sidebar-prompt-category').value = 'code';
    document.getElementById('sidebar-prompt-content').value = '';
    document.getElementById('sidebar-prompt-modal').style.display = 'flex';
    
    // Focus on title input
    setTimeout(() => {
      document.getElementById('sidebar-prompt-title').focus();
    }, 100);
  }

  editPrompt(promptId) {
    console.log('InPromptu: editPrompt called with ID:', promptId);
    const prompt = this.allPrompts.find(p => p.id === promptId);
    if (!prompt) {
      console.error('InPromptu: Prompt not found for editing, ID:', promptId);
      return;
    }

    this.editingPromptId = promptId;
    document.getElementById('sidebar-modal-title').textContent = 'Edit Prompt';
    document.getElementById('sidebar-prompt-title').value = prompt.title;
    document.getElementById('sidebar-prompt-category').value = prompt.categoryId;
    document.getElementById('sidebar-prompt-content').value = prompt.content;
    document.getElementById('sidebar-prompt-modal').style.display = 'flex';
    
    // Focus on title input
    setTimeout(() => {
      document.getElementById('sidebar-prompt-title').focus();
    }, 100);
  }

  closeModal() {
    document.getElementById('sidebar-prompt-modal').style.display = 'none';
    this.editingPromptId = null;
  }

  async savePrompt() {
    console.log('InPromptu: savePrompt called');
    const title = document.getElementById('sidebar-prompt-title').value.trim();
    const categoryId = document.getElementById('sidebar-prompt-category').value;
    const content = document.getElementById('sidebar-prompt-content').value.trim();

    if (!title || !content) {
      this.showNotification('Please fill in both title and content', 'error');
      return;
    }

    try {
      if (this.editingPromptId) {
        console.log('InPromptu: Editing existing prompt, ID:', this.editingPromptId);
        // Edit existing prompt
        const prompt = this.allPrompts.find(p => p.id === this.editingPromptId);
        if (!prompt) {
          this.showNotification('Prompt not found', 'error');
          return;
        }

        // Update the prompt in all arrays
        const updatedPrompt = {
          ...prompt,
          title,
          categoryId,
          content,
          updatedAt: Date.now()
        };

        // Update in allPrompts
        const allPromptsIndex = this.allPrompts.findIndex(p => p.id === this.editingPromptId);
        if (allPromptsIndex !== -1) {
          this.allPrompts[allPromptsIndex] = updatedPrompt;
        }

        // Update in categories
        this.categories.forEach(category => {
          if (category.prompts) {
            const categoryIndex = category.prompts.findIndex(p => p.id === this.editingPromptId);
            if (categoryIndex !== -1) {
              category.prompts[categoryIndex] = updatedPrompt;
            }
          }
        });

        // Update in custom prompts if it was a custom prompt
        if (prompt.isCustom) {
          const customIndex = this.customPrompts.findIndex(p => p.id === this.editingPromptId);
          if (customIndex !== -1) {
            this.customPrompts[customIndex] = updatedPrompt;
            await this.saveCustomPrompts();
          }
        }
        
        this.showNotification('Prompt updated successfully!', 'success');
      } else {
        console.log('InPromptu: Adding new prompt');
        // Add new prompt
        const newPrompt = {
          id: `prompt-${Date.now()}`,
          title,
          categoryId,
          content,
          createdAt: Date.now(),
          isCustom: true
        };
        
        this.allPrompts.push(newPrompt);
        this.customPrompts.push(newPrompt);
        
        // Add to the appropriate category
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
          category.prompts.push(newPrompt);
        }
        
        await this.saveCustomPrompts();
        this.showNotification('Prompt added successfully!', 'success');
      }

      this.refreshSidebar();
      this.closeModal();
    } catch (error) {
      console.error('Failed to save prompt:', error);
      this.showNotification('Failed to save prompt', 'error');
    }
  }

  async deletePrompt(promptId) {
    console.log('InPromptu: deletePrompt called with ID:', promptId);
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      const prompt = this.allPrompts.find(p => p.id === promptId);
      if (!prompt) {
        console.error('InPromptu: Prompt not found for deletion, ID:', promptId);
        this.showNotification('Prompt not found', 'error');
        return;
      }

      console.log('InPromptu: Deleting prompt:', prompt.title);

      // Remove from allPrompts array
      this.allPrompts = this.allPrompts.filter(p => p.id !== promptId);
      
      // Remove from custom prompts if it's a custom prompt
      if (prompt.isCustom) {
        this.customPrompts = this.customPrompts.filter(p => p.id !== promptId);
        await this.saveCustomPrompts();
      }
      
      // Remove from categories
      this.categories.forEach(category => {
        if (category.prompts) {
          category.prompts = category.prompts.filter(p => p.id !== promptId);
        }
      });

      this.refreshSidebar();
      this.showNotification('Prompt deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      this.showNotification('Failed to delete prompt', 'error');
    }
  }

  async refreshSidebar() {
    // Re-merge custom prompts with categories
    this.mergeCustomPrompts();
    
    // Update allPrompts array
    this.allPrompts = this.categories.flatMap(category => 
      (category.prompts || []).map(prompt => ({ ...prompt, categoryId: category.id, categoryName: category.name }))
    );
    
    // Re-render the sidebar content
    const categoriesContainer = this.sidebarElement.querySelector('.categories-container');
    categoriesContainer.innerHTML = this.generateCategoriesHTML();
    
    // Update prompt count
    const promptCount = this.sidebarElement.querySelector('.prompt-count');
    promptCount.textContent = `${this.allPrompts.length} prompts`;
    
    // Re-add event listeners to new prompt items
    this.addPromptItemEventListeners();
  }

  generateCategoriesHTML() {
    return this.categories.map(category => `
      <div class="category-section" data-category="${category.id}">
        <div class="category-header">
          <span class="category-icon">${category.icon}</span>
          <span class="category-name">${category.name}</span>
        </div>
        <div class="prompts-list">
          ${(category.prompts || []).map(prompt => this.generatePromptItemHTML(prompt)).join('')}
        </div>
      </div>
    `).join('');
  }

  generatePromptItemHTML(prompt) {
    return `
      <div class="prompt-item" data-prompt-id="${prompt.id}">
        <div class="prompt-header">
          <div class="prompt-title">${prompt.title}</div>
          <div class="prompt-actions">
            <button class="action-btn edit" title="Edit prompt" data-prompt-id="${prompt.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action-btn delete" title="Delete prompt" data-prompt-id="${prompt.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="prompt-preview">${this.truncateText(prompt.content, 80)}</div>
      </div>
    `;
  }

  addPromptItemEventListeners() {
    console.log('InPromptu: Setting up prompt item event listeners');
    
    const promptItems = this.sidebarElement.querySelectorAll('.prompt-item');
    console.log('InPromptu: Found', promptItems.length, 'prompt items');
    
    promptItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking on action buttons
        if (e.target.closest('.action-btn')) return;
        
        const promptId = item.dataset.promptId;
        console.log('InPromptu: Prompt item clicked, ID:', promptId);
        this.insertPrompt(promptId, item);
      });
    });

    // Edit prompt buttons
    const editButtons = this.sidebarElement.querySelectorAll('.action-btn.edit');
    console.log('InPromptu: Found', editButtons.length, 'edit buttons');
    
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the prompt item click
        const promptId = e.currentTarget.dataset.promptId;
        console.log('InPromptu: Edit button clicked, ID:', promptId);
        this.editPrompt(promptId);
      });
    });

    // Delete prompt buttons
    const deleteButtons = this.sidebarElement.querySelectorAll('.action-btn.delete');
    console.log('InPromptu: Found', deleteButtons.length, 'delete buttons');
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the prompt item click
        const promptId = e.currentTarget.dataset.promptId;
        console.log('InPromptu: Delete button clicked, ID:', promptId);
        this.deletePrompt(promptId);
      });
    });
  }

  handleSearch(searchTerm) {
    const promptItems = this.sidebarElement.querySelectorAll('.prompt-item');
    const categorySections = this.sidebarElement.querySelectorAll('.category-section');
    const searchLower = searchTerm.toLowerCase().trim();
    
    // If search is empty, show all prompts and categories
    if (!searchTerm || searchTerm.trim() === '') {
      promptItems.forEach(item => {
        item.style.display = 'block';
      });
      categorySections.forEach(section => {
        section.style.display = 'block';
      });
      return;
    }
    
    let hasVisiblePrompts = false;
    let visiblePromptsInCategory = 0;
    
    // Search through each category
    categorySections.forEach(section => {
      const categoryPrompts = section.querySelectorAll('.prompt-item');
      visiblePromptsInCategory = 0;
      
      categoryPrompts.forEach(item => {
        const title = item.querySelector('.prompt-title').textContent.toLowerCase();
        const preview = item.querySelector('.prompt-preview').textContent.toLowerCase();
        
        // Enhanced search: check title, preview, and category
        const categoryName = section.querySelector('.category-name').textContent.toLowerCase();
        const matchesSearch = title.includes(searchLower) || 
                            preview.includes(searchLower) || 
                            categoryName.includes(searchLower);
        
        if (matchesSearch) {
          item.style.display = 'block';
          visiblePromptsInCategory++;
          hasVisiblePrompts = true;
          
          // Highlight matching text in title (optional enhancement)
          this.highlightSearchTerm(item.querySelector('.prompt-title'), searchTerm);
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide category based on whether it has visible prompts
      if (visiblePromptsInCategory > 0) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
    
    // Show "no results" message if no prompts match
    this.showNoResultsMessage(hasVisiblePrompts, searchTerm);
  }

  highlightSearchTerm(element, searchTerm) {
    // Remove any existing highlights
    const originalText = element.textContent;
    element.innerHTML = originalText;
    
    if (searchTerm.trim() === '') return;
    
    // Simple highlighting - you can enhance this with more sophisticated regex
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = originalText.replace(regex, '<mark style="background: #fef3c7; padding: 1px 2px; border-radius: 2px;">$1</mark>');
  }

  showNoResultsMessage(hasVisiblePrompts, searchTerm) {
    // Remove existing no-results message
    const existingMessage = this.sidebarElement.querySelector('.no-results-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    if (!hasVisiblePrompts && searchTerm.trim() !== '') {
      const noResultsMessage = document.createElement('div');
      noResultsMessage.className = 'no-results-message';
      noResultsMessage.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #374151;">No prompts found</div>
          <div style="font-size: 14px;">Try searching with different keywords</div>
          <div style="font-size: 12px; margin-top: 8px; color: #9ca3af;">Searched for: "${searchTerm}"</div>
        </div>
      `;
      
      const categoriesContainer = this.sidebarElement.querySelector('.categories-container');
      categoriesContainer.appendChild(noResultsMessage);
    }
  }

  async insertPrompt(promptId, promptElement) {
    try {
      const prompt = this.allPrompts.find(p => p.id === promptId);
      if (!prompt) return;
      
      // Find the input field
      const inputField = this.findInputField();
      if (!inputField) {
        console.error('InPromptu: Could not find input field');
        return;
      }
      
      console.log('InPromptu: Inserting prompt:', prompt.title);
      
      // Insert the prompt content with proper handling for different input types
      this.insertTextIntoField(inputField, prompt.content);
      
      // Show feedback
      this.showInsertFeedback(promptElement);
      
      // Close sidebar after a short delay
      setTimeout(() => {
        this.closeSidebar();
      }, 500);
      
    } catch (error) {
      console.error('InPromptu: Failed to insert prompt:', error);
    }
  }

  findInputField() {
    const hostname = window.location.hostname;
    const selectors = this.inputSelectors[hostname] || 'textarea, div[contenteditable="true"]';
    
    // Try to find the most likely input field
    const elements = document.querySelectorAll(selectors);
    
    for (let element of elements) {
      // Prefer visible, focused, or recently used input fields
      if (element.offsetParent !== null && // visible
          (element === document.activeElement || 
           element.matches(':focus') ||
           element.getAttribute('placeholder') ||
           element.getAttribute('aria-label'))) {
        return element;
      }
    }
    
    // Fallback to first visible element
    for (let element of elements) {
      if (element.offsetParent !== null) {
        return element;
      }
    }
    
    return null;
  }

  showInsertFeedback(promptElement) {
    // Add a brief visual feedback
    promptElement.style.background = '#10b981';
    promptElement.style.color = 'white';
    
    setTimeout(() => {
      promptElement.style.background = '';
      promptElement.style.color = '';
    }, 300);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 2000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideDown 0.3s ease-out;
      max-width: 300px;
      text-align: center;
    `;
    
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
          style.remove();
        }, 300);
      }
    }, 3000);
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  insertTextIntoField(inputField, text) {
    console.log('InPromptu: Inserting text into', inputField.tagName, 'contentEditable:', inputField.contentEditable);
    
    if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
      // For textarea and input elements, use value and preserve \n
      inputField.value = text;
      inputField.focus();
      // Trigger input event
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      inputField.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (inputField.contentEditable === 'true') {
      // For contentEditable elements, convert \n to <br> and use innerHTML
      const htmlContent = this.escapeHtml(text).replace(/\n/g, '<br>');
      inputField.innerHTML = htmlContent;
      inputField.focus();
      
      // Place cursor at the end
      this.setCursorToEnd(inputField);
      
      // Trigger input events
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      inputField.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Fallback for other input types
      inputField.value = text;
      inputField.focus();
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      inputField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')    // Escape ampersands first
      .replace(/</g, '&lt;')     // Escape less than
      .replace(/>/g, '&gt;')     // Escape greater than
      .replace(/"/g, '&quot;')   // Escape quotes
      .replace(/'/g, '&#x27;');  // Escape single quotes
  }

  setCursorToEnd(element) {
    try {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false); // Collapse to end
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      console.warn('InPromptu: Could not set cursor position:', error);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('InPromptu: Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('InPromptu: DOMContentLoaded fired, creating instance');
    window.inpromptuContent = new InPromptuContent();
  });
} else {
  console.log('InPromptu: Document already loaded, creating instance immediately');
  window.inpromptuContent = new InPromptuContent();
} 