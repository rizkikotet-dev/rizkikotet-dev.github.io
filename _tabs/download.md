---
layout: page
title: Daftar Rilis Terbaru
icon: fas fa-download
order: 5
---
<div class="release-container">
  <div id="release-info" class="mb-4"></div>
  <div class="table-responsive">
    <table class="table table-hover" id="release-table">
      <thead>
        <tr>
          <th>Nama File</th>
          <th>Ukuran</th>
          <th>Unduh</th>
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

<script src="{{ '/assets/js/fetch-releases.js' | relative_url }}"></script>