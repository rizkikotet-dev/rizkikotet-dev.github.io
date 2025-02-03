---
icon: fas fa-download
order: 4
---

<div class="row">
  <div class="col-12 col-md-8 mb-3">
    <div class="input-group">
      <span class="input-group-text border-secondary bg-body"><i class="fas fa-search"></i></span>
      <input type="text" class="form-control border-secondary bg-body" id="searchInput" 
        placeholder="Search files..." aria-label="Search">
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <span>
      <i class="far fa-folder-open fa-fw"></i>
      <span class="ms-2">Available Downloads</span>
    </span>
  </div>

  <div class="card-body">
    <ul id="download-list" class="list-group list-group-flush"></ul>
    <div class="text-center mt-3">
      <button id="loadMore" class="btn btn-outline-primary d-none">
        Load More
      </button>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const fileList = [
    {% for file in site.static_files %}
      {% if file.path contains '/downloads/' %}
        {
          name: "{{ file.name }}",
          path: "{{ file.path | relative_url }}",
          date: "{{ file.modified_time | date: '%Y-%m-%d' }}"
        },
      {% endif %}
    {% endfor %}
  ];

  const itemsPerPage = 10;
  let currentPage = 0;
  let filteredFiles = [...fileList];

  const downloadList = document.getElementById('download-list');
  const loadMoreBtn = document.getElementById('loadMore');
  const searchInput = document.getElementById('searchInput');

  function displayFiles(files, start, limit) {
    const fragment = document.createDocumentFragment();
    
    files.slice(start, start + limit).forEach(file => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      const fileInfo = document.createElement('div');
      fileInfo.className = 'd-flex flex-column';
      
      const nameDiv = document.createElement('div');
      const icon = document.createElement('i');
      icon.className = 'far fa-file fa-fw';
      
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.name;
      link.className = 'ms-2';
      link.textContent = file.name;
      
      nameDiv.appendChild(icon);
      nameDiv.appendChild(link);
      
      const dateDiv = document.createElement('small');
      dateDiv.className = 'text-muted ms-4';
      dateDiv.textContent = `Added: ${file.date}`;
      
      fileInfo.appendChild(nameDiv);
      fileInfo.appendChild(dateDiv);
      
      const downloadBtn = document.createElement('a');
      downloadBtn.href = file.path;
      downloadBtn.download = file.name;
      downloadBtn.className = 'btn btn-outline-primary btn-sm';
      downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
      
      li.appendChild(fileInfo);
      li.appendChild(downloadBtn);
      fragment.appendChild(li);
    });

    return fragment;
  }

  function updateList() {
    downloadList.innerHTML = '';
    const fragment = displayFiles(filteredFiles, 0, itemsPerPage);
    downloadList.appendChild(fragment);
    
    loadMoreBtn.classList.toggle('d-none', filteredFiles.length <= itemsPerPage);
    currentPage = 1;
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredFiles = fileList.filter(file => 
      file.name.toLowerCase().includes(searchTerm)
    );
    updateList();
  }

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

  // Initial display
  updateList();
});
</script>

<style>
#download-list .btn-sm {
  padding: 0.25rem 0.5rem;
}

.input-group {
  max-width: 100%;
}

#download-list .list-group-item:hover {
  background-color: var(--bs-gray-100);
}

[data-theme="dark"] #download-list .list-group-item:hover {
  background-color: var(--bs-gray-800);
}
</style>