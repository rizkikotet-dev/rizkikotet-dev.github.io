---
title: Custom Firmware OpenWrt & ImmortalWrt | RTA-WRT
date: 2025-02-03 15:25:00 +0700
categories: [OpenWrt, Firmware]
tags: [OpenWrt, Custom Firmware, Networking]
comments: true
pin: true
---

<h1 align="center">
  <img src="/files/logo.png" alt="OpenWrt Logo" width="100">
  <br><strong>RTA-WRT - Custom Firmware for OpenWrt & ImmortalWrt</strong><br>
</h1>

<h3 align="center">OpenWrt 23.05.5 | ImmortalWrt 23.05.4</h3>

<h4 align="center">Bergabunglah dengan Komunitas Kami di Telegram untuk Update & Tutorial Terbaru!</h4>

<p align="center">
<a href="https://t.me/rtawrt"><img alt="Telegram Channel" src="https://img.shields.io/badge/Telegram-Channel-blue?style=for-the-badge&logo=telegram"></a>
<a href="https://t.me/backup_rtawrt"><img alt="Telegram Group" src="https://img.shields.io/badge/Telegram-Group-blue?style=for-the-badge&logo=telegram"></a>
<a href="https://t.me/RizkiKotet"><img alt="Contact Personal" src="https://img.shields.io/badge/Telegram-Contact-blue?style=for-the-badge&logo=telegram"></a>
</p>

<p align="center"><strong>Built with ImageBuilder | Custom Scripts by FriWrt</strong></p>

---

## ⚠️ Peringatan untuk Instalasi Pertama

> **Catatan:** Booting awal mungkin memerlukan waktu lebih lama karena proses partisi ulang penyimpanan dan konfigurasi tambahan.

---

## ℹ️ Informasi Sistem

- **Alamat IP Default:** `192.168.1.1`
- **Username:** `root`
- **Password:** `rtawrt`
- **SSID:** `RTA-WRT_2G` / `RTA-WRT_5G`

### 🚀 Fitur Unggulan

- ModemManager dengan koneksi ulang otomatis
- OpenClash dengan core MetaCubeX Mihomo terbaru
- Passwall & MihomoTProxy sebagai alternatif tunneling
- TinyFM - File Manager ringan
- Internet Detector & Lite Watchdog untuk kestabilan koneksi
- Tema Argon & Material dengan login screen kustom
- 3GInfo Lite, ModemInfo, SMS Tool, dan utilitas modem lainnya
- Dukungan layar OLED (teruji di Raspberry Pi 4B)

---

## 🖼️ Pratinjau Antarmuka

### Tampilan Login
<p align="center">
    <img src="/files/Login.png" alt="Login Interface">
</p>

### Dashboard Utama
<p align="center">
    <img src="/files/Dashboard.png" alt="Dashboard Interface">
</p>

---

## 📥 Download

<script src="https://unpkg.com/@tailwindcss/browser@4"></script>

<style type="text/tailwindcss">
  @theme {
    --color-clifford: #da373d;
  }
</style>

<div class="space-y-4">
  <!-- Release selector and search container -->
  <div class="rounded-lg shadow p-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Release selector -->
      <div>
        <select id="releaseSelector" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
               class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               placeholder="Cari file...">
      </div>
    </div>
  </div>

  <!-- Table container -->
  <div class="rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto max-h-[600px]">
      <table class="w-full border-collapse border">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold border">
              Nama File
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold border w-32">
              Ukuran
            </th>
            <th class="px-4 py-3 text-center text-sm font-semibold border w-24">
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

Terima kasih telah menggunakan **RTA-WRT**. Dukungan Anda sangat berarti bagi kami untuk terus berkembang!

Last Update: 22022025