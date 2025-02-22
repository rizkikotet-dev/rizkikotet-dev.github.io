---
layout: page
title: Daftar Rilis
icon: fas fa-download
order: 5
---

<div class="release-container px-1">
  <!-- Release selector and search container -->
  <div class="card mb-3">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <select id="releaseSelector" class="form-select" aria-label="Select release">
            <option value="">Loading releases...</option>
          </select>
        </div>
        <div class="col-md-6">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" 
                   id="searchInput" 
                   class="w-100"
                   placeholder="Cari file..."
                   aria-label="Search files">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Table container -->
  <div class="card">
    <div class="table-responsive" style="max-height: 600px;">
      <table class="table table-files">
        <thead class="sticky-top">
          <tr>
            <th scope="col">Nama File</th>
            <th scope="col" class="text-nowrap" style="width: 120px;">Ukuran</th>
            <th scope="col" style="width: 100px;">Unduh</th>
          </tr>
        </thead>
        <tbody id="release-list">
          <tr>
            <td colspan="3" class="text-center">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- No results message -->
  <div id="noResults" class="alert-warning text-center rounded mt-3 py-2 d-none">
    Tidak ada file yang sesuai dengan pencarian
  </div>
</div>

<script src="{{ '/assets/js/fetch-releases.js' | relative_url }}"></script>

<style>
.table-files {
  margin-bottom: 0;
}

.table-files thead {
  background: var(--card-bg);
  border-bottom: 2px solid var(--border-color);
}

.table-files th {
  border: none;
  font-weight: 600;
}

.table-files td {
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.search-box {
  position: relative;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-box input {
  padding: 0.25rem 0.5rem 0.25rem 2rem;
  border: none;
  background: transparent;
  color: var(--text-color);
}

.search-box input:focus {
  outline: none;
}

.btn-download {
  background-color: var(--link-color);
  border-color: var(--link-color);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  transition: opacity 0.2s ease;
}

.btn-download:hover {
  opacity: 0.8;
  color: #fff;
}

@media (max-width: 768px) {
  .table-files td:last-child {
    text-align: center;
  }
}
</style>