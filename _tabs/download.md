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
    itemsPerPage: 10
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
      this.showError('Failed to initialize download manager');
    }
  },

  async fetchReleases() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/releases`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.state.releasesData = await response.json();
      this.state.filteredFiles = this.transformReleasesData(this.state.releasesData);
      this.updateFileCount();
      this.displayFiles();
    } catch (error) {
      console.error('Error fetching releases:', error);
      this.showError('Error loading releases. Please try again later.');
    }
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

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  setupEventListeners() {
    this.elements.searchInput.addEventListener('input', () => {
      this.state.currentPage = 1;
      this.displayFiles();
    });

    this.elements.prevPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.state.currentPage > 1) {
        this.state.currentPage--;
        this.displayFiles();
      }
    });

    this.elements.nextPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.state.currentPage < this.state.totalPages) {
        this.state.currentPage++;
        this.displayFiles();
      }
    });
  },

  displayFiles() {
    const files = this.getFilteredFiles();
    const start = (this.state.currentPage - 1) * this.config.itemsPerPage;
    const end = start + this.config.itemsPerPage;
    const pageFiles = files.slice(start, end);

    this.elements.downloadList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (this.state.currentPath) {
      fragment.appendChild(this.createBackButton());
    }

    if (this.state.currentPath === '') {
      this.displayFolders(fragment);
    } else {
      this.displayFilesList(pageFiles, fragment);
    }

    this.elements.downloadList.appendChild(fragment);
    this.updatePagination(files.length);
  },

  createBackButton() {
    const backLi = document.createElement('li');
    backLi.className = 'list-group-item';
    backLi.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span onclick="downloadManager.navigateBack()" style="cursor: pointer;">
          <i class="fas fa-arrow-left fa-fw"></i>
          <span class="mx-2">Back to parent directory</span>
        </span>
      </div>
    `;
    return backLi;
  },

  displayFolders(fragment) {
    const uniqueReleases = new Set(
      this.state.filteredFiles.map(file => file.relativePath.split('/')[0])
    );

    [...uniqueReleases].forEach(release => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const releaseFiles = this.state.filteredFiles.filter(
        f => f.relativePath.startsWith(release + '/')
      );
      
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span onclick="downloadManager.navigateToFolder('${release}')" style="cursor: pointer;">
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
  },

  displayFilesList(files, fragment) {
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
             class="download-button"
             aria-label="Download ${file.name}"
          >
            <i class="fas fa-download fa-fw"></i>
          </a>
        </div>
      `;
      fragment.appendChild(li);
    });
  },

  getFilteredFiles() {
    const searchTerm = this.elements.searchInput.value.toLowerCase();
    let files = [...this.state.filteredFiles];
    
    if (this.state.currentPath) {
      files = files.filter(file => 
        file.relativePath.startsWith(`${this.state.currentPath}/`)
      );
    }
    
    if (searchTerm) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return files;
  },

  updatePagination(totalItems) {
    this.state.totalPages = Math.ceil(totalItems / this.config.itemsPerPage);
    this.elements.currentPageBtn.querySelector('a').textContent = this.state.currentPage;
    this.elements.prevPageBtn.classList.toggle('disabled', this.state.currentPage === 1);
    this.elements.nextPageBtn.classList.toggle('disabled', 
      this.state.currentPage >= this.state.totalPages
    );
  },

  updateFileCount() {
    this.elements.fileCountSpan.textContent = this.state.filteredFiles.length;
  },

  navigateToFolder(folderName) {
    this.state.currentPath = folderName;
    this.state.currentPage = 1;
    this.displayFiles();
  },

  navigateBack() {
    this.state.currentPath = '';
    this.state.currentPage = 1;
    this.displayFiles();
  },

  showError(message) {
    this.elements.downloadList.innerHTML = `
      <li class="list-group-item text-center text-danger">
        <i class="fas fa-exclamation-circle"></i> ${message}
      </li>
    `;
  }
};

// Initialize the download manager
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => downloadManager.init());
} else {
  downloadManager.init();
}
</script>

<style>
.search-container {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.search-container i {
  margin-right: 0.5rem;
  color: var(--text-muted);
}

#searchInput {
  border: none;
  background: transparent;
  width: 100%;
}

#searchInput:focus {
  outline: none;
  box-shadow: none;
}

.list-group-item {
  background: transparent;
  border-left: none;
  border-right: none;
}

.download-button {
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem;
}

.download-button:hover {
  color: var(--link-color);
}

.pagination {
  margin-top: 1rem;
}

.page-link {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-color);
}

.page-link:hover {
  background: var(--border-color);
  color: var(--link-color);
}

.page-item.active .page-link {
  background-color: var(--link-color);
  border-color: var(--link-color);
}
</style>