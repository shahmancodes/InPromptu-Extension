// InPromptu - Descriptive Popup Script

class Inpromptu {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadPrompts();
    this.setupEventListeners();
    this.updateStatus();
    
    // Listen for storage changes to update counts dynamically
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes.customPrompts) {
        this.loadCustomPrompts().then(() => {
          this.updatePromptCount();
        });
      }
    });
  }

  async loadPrompts() {
    try {
      // Load default prompts from prompts.json
      const response = await fetch(chrome.runtime.getURL('prompts.json'));
      if (!response.ok) {
        throw new Error(`Failed to fetch prompts.json: ${response.status}`);
      }
      const data = await response.json();
      this.categories = data.categories || [];
      
      // Load custom prompts from local storage for counting
      await this.loadCustomPrompts();
      
      // Flatten all prompts for counting
      this.allPrompts = this.categories.flatMap(category => 
        (category.prompts || []).map(prompt => ({ ...prompt, categoryId: category.id, categoryName: category.name }))
      );
    } catch (error) {
      console.error('Failed to load prompts:', error);
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
      console.warn('Could not load custom prompts:', error);
      this.customPrompts = [];
    }
  }

  setupEventListeners() {
    // Accordion functionality
    this.setupAccordion();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Handle any modal closing if needed
      }
    });
  }

  setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.closest('.accordion-item');
        const isActive = accordionItem.classList.contains('active');
        
        // Close all other accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          accordionItem.classList.add('active');
        }
      });
    });

    // Open status section by default
    const statusHeader = document.getElementById('status-header');
    if (statusHeader) {
      statusHeader.closest('.accordion-item').classList.add('active');
    }
  }

  async updateStatus() {
    // Update current site status
    await this.updateCurrentSiteStatus();
    
    // Update prompt count
    this.updatePromptCount();
  }

  async updateCurrentSiteStatus() {
    const currentSiteElement = document.getElementById('current-site');
    
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        currentSiteElement.textContent = 'Unknown';
        currentSiteElement.className = 'status-value not-supported';
        return;
      }
      
      const url = new URL(tab.url);
      const hostname = url.hostname;
      
      // Check if current site is supported
      const supportedSites = {
        'chat.openai.com': 'ChatGPT',
        'chatgpt.com': 'ChatGPT',
        'claude.ai': 'Claude AI',
        'bard.google.com': 'Google Bard',
        'copilot.microsoft.com': 'Microsoft Copilot',
        'poe.com': 'Poe',
        'character.ai': 'Character.AI',
        'perplexity.ai': 'Perplexity',
        'you.com': 'You.com'
      };
      
      if (supportedSites[hostname]) {
        currentSiteElement.textContent = supportedSites[hostname];
        currentSiteElement.className = 'status-value supported';
      } else {
        currentSiteElement.textContent = 'Not Supported';
        currentSiteElement.className = 'status-value not-supported';
      }
    } catch (error) {
      console.error('Error checking current site:', error);
      currentSiteElement.textContent = 'Error';
      currentSiteElement.className = 'status-value not-supported';
    }
  }

  updatePromptCount() {
    const totalPrompts = this.allPrompts ? this.allPrompts.length : 0;
    const customCount = this.customPrompts.length;
    
    document.getElementById('prompt-count').textContent = `${totalPrompts} prompts`;
    document.getElementById('custom-prompt-count').textContent = `${customCount} custom`;
  }
}

// Initialize Inpromptu when the popup loads
let inpromptu;
document.addEventListener('DOMContentLoaded', () => {
  inpromptu = new Inpromptu();
}); 