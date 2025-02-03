---
layout: page
title: Downloads
icon: fas fa-download
order: 4
---

{% include lang.html %}

{% assign HEAD_PREFIX = 'h_' %}
{% assign LIST_PREFIX = 'l_' %}

<div class="row g-2 align-items-center">
  <div class="col">
    <input 
      type="text" 
      class="form-control form-control-lg border-0 bg-light dark-mode-inverted" 
      id="searchInput"
      placeholder="{{ site.data.locales[lang].search.hint | default: 'Search files...' }}"
    >
  </div>
</div>

<div class="card categories mt-3">
  <div class="card-header d-flex justify-content-between hide-border-bottom">
    <span class="ms-2">
      <i class="far fa-folder-open fa-fw"></i>
      <span class="text-muted">Available Downloads</span>
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
    <nav aria-label="Downloads pagination">
      <ul class="pagination justify-content-center mt-3">
        <li class="page-item disabled" id="prevPage">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item active" id="currentPage">
          <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item" id="nextPage">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
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
  let currentPage = 1;
  let totalPages = Math.ceil(fileList.length / itemsPerPage);
  let filteredFiles = [...fileList];

  const downloadList = document.querySelector('#download-list ul');
  const prevPageBtn = document.getElementById('prevPage');
  const currentPageBtn = document.getElementById('currentPage');
  const nextPageBtn = document.getElementById('nextPage');
  const searchInput = document.getElementById('searchInput');
  const fileCountSpan = document.getElementById('file-count');

  function displayFiles(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const files = filteredFiles.slice(start, end);

    downloadList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    files.forEach(file => {
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

    downloadList.appendChild(fragment);
    updatePagination();
  }

  function updatePagination() {
    prevPageBtn.classList.toggle('disabled', currentPage === 1);
    nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
    currentPageBtn.firstElementChild.textContent = currentPage;
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredFiles = fileList.filter(file => 
      file.name.toLowerCase().includes(searchTerm)
    );
    totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
    currentPage = 1;
    displayFiles(currentPage);
    fileCountSpan.textContent = filteredFiles.length;
  }

  function init() {
    searchInput.addEventListener('input', handleSearch);

    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayFiles(currentPage);
      }
    });

    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayFiles(currentPage);
      }
    });

    displayFiles(currentPage);
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

.form-control.form-control-lg {
  padding: 0.75rem 1rem;
}

.dark-mode-inverted {
  background-color: var(--body-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

.dark-mode-inverted::placeholder {
  color: var(--text-color-secondary) !important;
}

.hide-border-bottom {
  border-bottom: none !important;
}
</style>