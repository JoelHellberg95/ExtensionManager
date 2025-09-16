/*
Main JavaScript for Browser Extension Manager UI
*/

document.addEventListener('DOMContentLoaded', function() {
  let extensions = [];
  let currentFilter = 'all';
  let removeIndex = null;

  // Modal elements
  const modalOverlay = document.getElementById('modal-overlay');
  const confirmRemoveBtn = document.getElementById('confirm-remove');
  const cancelRemoveBtn = document.getElementById('cancel-remove');

  // Render extensions list
  function renderExtensions() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    const filtered = extensions.filter(ext => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'active') return ext.isActive;
      if (currentFilter === 'inactive') return !ext.isActive;
    });
    const container = document.createElement('div');
    container.id = 'extensions-list';
    filtered.forEach((ext, idx) => {
      const extDiv = document.createElement('div');
      extDiv.className = 'extension-item' + (ext.isActive ? ' active' : '');
      extDiv.innerHTML = `
        <img src="${ext.logo}" alt="${ext.name} logo" class="extension-logo">
        <div class="extension-info">
          <h3>${ext.name}</h3>
          <p>${ext.description}</p>
          <div class="extension-controls">
            <button class="remove-btn">Remove</button>
            <label class="toggle-switch ${ext.isActive ? 'active' : 'inactive'}">
              <input type="checkbox" ${ext.isActive ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="status-dot${ext.isActive ? '' : ' inactive'}">
          <span class="dot"></span>
          <span class="status-label">${ext.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      `;
      // Toggle active/inactive
      extDiv.querySelector('.toggle-switch input').addEventListener('change', () => {
        ext.isActive = !ext.isActive;
        renderExtensions();
      });
      // Remove with modal
      extDiv.querySelector('.remove-btn').addEventListener('click', () => {
        removeIndex = extensions.indexOf(ext);
        modalOverlay.style.display = 'flex';
      });
      container.appendChild(extDiv);
    });
    main.appendChild(container);
  }

  // Filter controls
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      renderExtensions();
    });
  });

  // Modal logic
  confirmRemoveBtn.addEventListener('click', function() {
    if (removeIndex !== null) {
      extensions.splice(removeIndex, 1);
      removeIndex = null;
      renderExtensions();
    }
    modalOverlay.style.display = 'none';
  });
  cancelRemoveBtn.addEventListener('click', function() {
    removeIndex = null;
    modalOverlay.style.display = 'none';
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  }
  themeToggle.addEventListener('click', function() {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
  setTheme('light');

  // Load data
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      extensions = data;
      renderExtensions();
    });
});
