---
layout: page
title: Daftar Rilis
icon: fas fa-download
order: 5
---

<script src="https://unpkg.com/@tailwindcss/browser@4"></script>

<style type="text/tailwindcss">
  @theme {
    --color-clifford: #da373d;
  }
</style>

<div class="space-y-4">
  <!-- Release selector and search container -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Release selector -->
      <div>
        <select id="releaseSelector" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Loading releases...</option>
        </select>
      </div>
      
      <!-- Search box -->
      <div class="relative">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400 dark:text-gray-500"></i>
        </div>
        <input type="text" 
               id="searchInput" 
               class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="Cari file...">
      </div>
    </div>
  </div>

  <!-- Table container -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto max-h-[600px]">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Nama File
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 w-32">
              Ukuran
            </th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 w-24">
              Unduh
            </th>
          </tr>
        </thead>
        <tbody id="release-list" class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr>
            <td colspan="3" class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- No results message -->
  <div id="noResults" class="hidden bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-lg p-4 text-center">
    Tidak ada file yang sesuai dengan pencarian
  </div>
</div>

<script src="{{ '/assets/js/fetch-releases.js' | relative_url }}"></script>