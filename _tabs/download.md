---
layout: page
title: Downloads
icon: fas fa-download
order: 4
---

{% include lang.html %}

{% assign HEAD_PREFIX = 'h_' %}
{% assign LIST_PREFIX = 'l_' %}

<search id="search" class="align-items-center ms-3 ms-lg-0"> 
    <i class="fas fa-search fa-fw"></i> 
    <input class="form-control" 
        id="searchInput" 
        type="search" 
        aria-label="search" 
        autocomplete="off" 
        placeholder="{{ site.data.locales[lang].search.hint | default: 'Search files...' }}"
    > 
</search>

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
  const REPO_OWNER = 'rizkikotet-dev';
  const REPO_NAME = 'RTA-WRT';
  const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`;

  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;
  let filteredFiles = [];
  let currentPath = '';
  let releasesData = [];

  const downloadList = document.querySelector('#download-list ul');
  const prevPageBtn = document.getElementById('prevPage');
  const currentPageBtn = document.getElementById('currentPage');
  const nextPageBtn = document.getElementById('nextPage');
  const searchInput = document.getElementById('searchInput');
  const fileCountSpan = document.getElementById('file-count');

  async function fetchReleases() {
    try {
      const response = await fetch(API_URL);
      releasesData = await response.json();
      
      // Transform releases data into our file structure
      filteredFiles = releasesData.flatMap(release => {
        return release.assets.map(asset => ({
          name: asset.name,
          path: asset.browser_download_url,
          date: new Date(asset.created_at).toISOString().split('T')[0],
          relativePath: `${release.tag_name}/${asset.name}`,
          size: formatBytes(asset.size)
        }));
      });

      totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
      displayFiles(currentPage);
      fileCountSpan.textContent = filteredFiles.length;
    } catch (error) {
      console.error('Error fetching releases:', error);
      downloadList.innerHTML = '<li class="list-group-item">Error loading releases. Please try again later.</li>';
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function displayFiles(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const filesToDisplay = getFilteredFiles();
    const files = filesToDisplay.slice(start, end);

    downloadList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    if (currentPath !== '') {
      const backLi = document.createElement('li');
      backLi.className = 'list-group-item';
      backLi.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span onclick="navigateBack()" style="cursor: pointer;">
            <i class="fas fa-arrow-left fa-fw"></i>
            <span class="mx-2">Back to parent directory</span>
          </span>
        </div>
      `;
      fragment.appendChild(backLi);
    }

    if (currentPath === '') {
      // Display releases as folders
      const uniqueReleases = new Set(filteredFiles.map(file => file.relativePath.split('/')[0]));
      [...uniqueReleases].forEach(release => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const releaseFiles = filteredFiles.filter(f => f.relativePath.startsWith(release + '/'));
        
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span onclick="navigateToFolder('${release}')" style="cursor: pointer;">
              <i class="far fa-folder fa-fw"></i>
              <span class="mx-2">${release}</span>
              <span class="text-muted small font-weight-light">
                (${releaseFiles.length} files)
              </span>
            </span>
          </div>
        `;
        fragment.appendChild(li);
      });
    } else {
      // Display files in the selected release
      files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span>
              <i class="far fa-file fa-fw"></i>
              <span class="mx-2">${file.name}</span>
              <span class="text-muted small font-weight-light">
                ${file.size} - Added: ${file.date}
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
    }

    downloadList.appendChild(fragment);
    updatePagination(filesToDisplay.length);
  }

  function getFilteredFiles() {
    const searchTerm = searchInput.value.toLowerCase();
    let files = [...filteredFiles];
    
    if (currentPath !== '') {
      files = files.filter(file => file.relativePath.startsWith(`${currentPath}/`));
    }
    
    if (searchTerm) {
      files = files.filter(file => file.name.toLowerCase().includes(searchTerm));
    }
    
    return files;
  }

  function updatePagination(totalItems) {
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPageBtn.querySelector('a').textContent = currentPage;
    prevPageBtn.classList.toggle('disabled', currentPage === 1);
    nextPageBtn.classList.toggle('disabled', currentPage >= totalPages);
  }

  function navigateToFolder(folderName) {
    currentPath = folderName;
    currentPage = 1;
    displayFiles(currentPage);
  }

  function navigateBack() {
    currentPath = '';
    currentPage = 1;
    displayFiles(currentPage);
  }

  function init() {
    fetchReleases();

    searchInput.addEventListener('input', () => {
      currentPage = 1;
      displayFiles(currentPage);
    });

    prevPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayFiles(currentPage);
      }
    });

    nextPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayFiles(currentPage);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.navigateToFolder = navigateToFolder;
  window.navigateBack = navigateBack;
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

search {
  display: flex;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid var(--search-border-color);
  background: var(--main-bg);
  padding: 0 0.5rem;
}

search i {
  z-index: 2;
  font-size: 0.9rem;
  color: var(--search-icon-color);
}

#searchInput {
  background: center;
  border: 0;
  border-radius: 0;
  padding: 0.18rem 0.3rem;
  color: var(--text-color);
  height: auto;
}

#searchInput:focus {
  box-shadow: none;
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