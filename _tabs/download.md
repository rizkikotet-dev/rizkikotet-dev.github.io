---
layout: page
title: Daftar Rilis Terbaru
icon: fas fa-download
order: 5
---

<div class="release-container px-1">
  <div id="release-info" class="mb-4"></div>
  
  <!-- Search box using Chirpy's search style -->
  <div class="mb-3">
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input type="text" 
             id="searchInput" 
             class="w-100"
             placeholder="Cari file..."
             aria-label="Search files">
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

<!-- Custom styles that work with Chirpy -->
<style>
/* Table styles compatible with Chirpy's dark mode */
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

/* Search box customization */
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

/* Button customization */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-files td:last-child {
    text-align: center;
  }
}
</style>