---
layout: page
title: Downloads
icon: fas fa-download
order: 4
---

<div class="search-container">
    <i class="fas fa-search fa-fw"></i> 
    <input class="form-control" 
        id="searchInput" 
        type="search" 
        aria-label="search" 
        autocomplete="off" 
        placeholder="Search files..."
    > 
</div>

<div class="card categories mt-3">
  <div class="card-header d-flex justify-content-between hide-border-bottom">
    <span class="ms-2">
      <i class="far fa-folder-open fa-fw"></i>
      <span class="text-muted">Available Downloads</span>
      <span class="text-muted small font-weight-light">
        (<span id="file-count">0</span> files)
      </span>
    </span>
  </div>

  <div id="download-list" class="collapse show">
    <ul class="list-group">
      <li class="list-group-item text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading releases...
      </li>
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
const downloadManager = {
  config: {
    repoOwner: 'rizkikotet-dev',
    repoName: 'RTA-WRT',
    itemsPerPage: 10,
    apiUrl: 'https://api.github.com/repos/rizkikotet-dev/RTA-WRT/releases'
  },

  state: {
    currentPage: 1,
    totalPages: 1,
    filteredFiles: [],
    currentPath: '',
    releasesData: []
  },

  elements: {
    downloadList: document.querySelector('#download-list ul'),
    prevPageBtn: document.getElementById('prevPage'),
    currentPageBtn: document.getElementById('currentPage'),
    nextPageBtn: document.getElementById('nextPage'),
    searchInput: document.getElementById('searchInput'),
    fileCountSpan: document.getElementById('file-count')
  },

  async init() {
    try {
      await this.fetchReleases();
      this.setupEventListeners();
    } catch (error) {
      console.error('Initialization error:', error);
      this.showError(`Failed to initialize: ${error.message}`);
    }
  },

  async fetchReleases() {
    try {
      // Show loading state
      this.showLoading();

      // Fetch with detailed error handling
      const response = await fetch(this.config.apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `GitHub API Error (${response.status}): ${
            errorData?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from GitHub API');
      }

      if (data.length === 0) {
        this.showMessage('No releases found. Please check back later.');
        return;
      }

      this.state.releasesData = data;
      this.state.filteredFiles = this.transformReleasesData(data);
      this.updateFileCount();
      this.displayFiles();
    } catch (error) {
      console.error('Error fetching releases:', error);
      this.showError(`Failed to load releases: ${error.message}`);
    }
  },

  showLoading() {
    this.elements.downloadList.innerHTML = `
      <li class="list-group-item text-center">
        <i class="fas fa-spinner fa-spin"></i> Loading releases...
        <div class="small text-muted">Fetching from GitHub...</div>
      </li>
    `;
  },

  showMessage(message) {
    this.elements.downloadList.innerHTML = `
      <li class="list-group-item text-center">
        <i class="fas fa-info-circle"></i> ${message}
      </li>
    `;
  },

  showError(message) {
    this.elements.downloadList.innerHTML = `
      <li class="list-group-item text-center text-danger">
        <i class="fas fa-exclamation-circle"></i> ${message}
        <div class="small mt-2">
          <button onclick="downloadManager.retryFetch()" class="btn btn-sm btn-outline-danger">
            <i class="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      </li>
    `;
  },

  async retryFetch() {
    await this.fetchReleases();
  },

  transformReleasesData(releases) {
    return releases.flatMap(release => {
      return release.assets.map(asset => ({
        name: asset.name,
        path: asset.browser_download_url,
        date: new Date(asset.created_at).toISOString().split('T')[0],
        relativePath: `${release.tag_name}/${asset.name}`,
        size: this.formatBytes(asset.size)
      }));
    });
  },

  // ... rest of the methods remain the same ...
};

// Initialize with better error handling
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    downloadManager.init().catch(error => {
      console.error('Failed to initialize download manager:', error);
      downloadManager.showError(`Initialization failed: ${error.message}`);
    });
  });
} else {
  downloadManager.init().catch(error => {
    console.error('Failed to initialize download manager:', error);
    downloadManager.showError(`Initialization failed: ${error.message}`);
  });
}
</script>

<style>
/* ... previous styles remain the same ... */

.text-danger {
  color: #dc3545 !important;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
  background: transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
  cursor: pointer;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.small {
  font-size: 0.875em;
}

.mt-2 {
  margin-top: 0.5rem !important;
}
</style>