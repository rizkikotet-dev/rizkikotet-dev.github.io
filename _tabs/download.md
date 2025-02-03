---
layout: page
title: Downloads
icon: fas fa-download
order: 4
---

{% include lang.html %}

{% assign HEAD_PREFIX = 'h_' %}
{% assign LIST_PREFIX = 'l_' %}

<div class="row">
  <div class="col-12 col-md-8 mb-3">
    <div class="input-group">
      <span class="input-group-text border-secondary bg-body">
        <i class="fas fa-search fa-fw"></i>
      </span>
      <input 
        type="text" 
        class="form-control border-secondary bg-body" 
        id="searchInput" 
        placeholder="{{ site.data.locales[lang].search.hint | default: 'Search files...' }}"
      >
    </div>
  </div>
</div>

<div class="card categories">
  <div class="card-header d-flex justify-content-between hide-border-bottom">
    <span class="ms-2">
      <i class="far fa-folder-open fa-fw"></i>
      <span class="text">Available Downloads</span>
      <span class="text-muted small font-weight-light">
        <span id="file-count">0</span> files
      </span>
    </span>

    <button
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#download-list"
      aria-expanded="true"
      aria-controls="download-list"
      class="category-trigger hide-border-bottom"
    >
      <i class="fas fa-fw fa-angle-down"></i>
    </button>
  </div>

  <div id="download-list" class="collapse show">
    <ul class="list-group">
    </ul>
    <div class="text-center p-3">
      <button 
        type="button"
        id="loadMore" 
        class="btn btn-outline-primary btn-sm d-none">
        Load More
      </button>
    </div>
  </div>
</div>

<script>
(function() {
  const fileList = [
    {% for file in site.static_files %}
      {% if file.path contains '/downloads/' %}
      {
        name: "{{ file.name }}",
        path: "{{ file.path | relative_url }}",
        date: "{{ file.modified_time | date: '%Y-%m-%d' }}"
      }{% unless forloop.last %},{% endunless %}
      {% endif %}
    {% endfor %}
  ];

  const itemsPerPage = 10;
  let currentPage = 0;
  let filteredFiles = [...fileList];

  const downloadList = document.querySelector('#download-list ul');
  const loadMoreBtn = document.getElementById('loadMore');
  const searchInput = document.getElementById('searchInput');
  const fileCountSpan = document.getElementById('file-count');

  function displayFiles(files, start, limit) {
    const fragment = document.createDocumentFragment();
    
    files.slice(start, start + limit).forEach(file => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span>
            <i class="far fa-file fa-fw"></i>
            <a href="${file.path}" download class="mx-2">${file.name}</a>
            <span class="text-muted small font-weight-light">
              Added: ${file.date}
            </span>
          </span>
          <a href="${file.path}" 
             download 
             class="category-trigger hide-border-bottom"
             aria-label="Download ${file.name}"
          >
            <i class="fas fa-download fa-fw"></i>
          </a>
        </div>
      `;
      
      fragment.appendChild(li);
    });

    return fragment;
  }

  function updateList() {
    downloadList.innerHTML = '';
    const fragment = displayFiles(filteredFiles, 0, itemsPerPage);
    downloadList.appendChild(fragment);
    
    loadMoreBtn.classList.toggle('d-none', filteredFiles.length <= itemsPerPage);
    fileCountSpan.textContent = filteredFiles.length;
    currentPage = 1;
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredFiles = fileList.filter(file => 
      file.name.toLowerCase().includes(searchTerm)
    );
    updateList();
  }

  function init() {
    searchInput.addEventListener('input', handleSearch);

    loadMoreBtn.addEventListener('click', () => {
      const start = currentPage * itemsPerPage;
      const fragment = displayFiles(filteredFiles, start, itemsPerPage);
      downloadList.appendChild(fragment);
      currentPage++;
      
      if (currentPage * itemsPerPage >= filteredFiles.length) {
        loadMoreBtn.classList.add('d-none');
      }
    });

    updateList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<style>
.category-trigger {
  margin-left: 2rem;
  border-bottom: none !important;
  background: none;
  border: none;
  padding: 0;
}

.category-trigger:hover {
  color: var(--link-hover-color) !important;
}

#download-list .list-group-item:first-child {
  border-top: none;
}

#download-list .list-group-item:last-child {
  border-bottom: none;
}

[data-theme="dark"] .input-group-text {
  background-color: var(--body-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .form-control {
  background-color: var(--body-bg);
  border-color: var(--border-color);
}

.hide-border-bottom {
  border-bottom: none !important;
}
</style>