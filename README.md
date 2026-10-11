# ⚔️ Math Battle Arena (MBA)

> **Media Pembelajaran Matematika Interaktif Berbasis Game Battle RPG untuk SMP**

Math Battle Arena (MBA) merupakan media pembelajaran matematika berbasis web yang menggabungkan konsep **Role-Playing Game (RPG)** dengan **gamifikasi edukasi**. Aplikasi ini dirancang untuk membantu proses belajar matematika menjadi lebih menyenangkan melalui sistem pertarungan antartim yang interaktif, kompetitif, dan kolaboratif.

---

# 📖 Tentang Proyek

Math Battle Arena mengubah aktivitas mengerjakan soal matematika menjadi sebuah **pertarungan RPG** antara dua tim.

Setiap jawaban benar akan menghasilkan serangan kepada lawan, sedangkan jawaban salah akan memberikan penalti. Pemain harus bekerja sama dengan anggota tim untuk mengurangi HP lawan hingga habis sebelum waktu pertandingan berakhir.

Aplikasi ini ditujukan untuk siswa **SMP Kelas VII, VIII, dan IX**, serta dapat digunakan guru sebagai media evaluasi pembelajaran di kelas.

---

# 🎯 Tujuan Pengembangan

- Mengurangi rasa takut terhadap matematika (Math Anxiety).
- Membuat pembelajaran lebih aktif dan menyenangkan.
- Meningkatkan kemampuan berhitung cepat.
- Melatih kerja sama tim dan sportivitas.
- Mempermudah guru dalam melakukan evaluasi hasil belajar.

---

# ⚔️ Gameplay

## Battle Tim

Pertandingan berlangsung antara:

- 🔵 Tim Kiri
- 🔴 Tim Kanan

Masing-masing tim bergantian menjawab soal matematika untuk menyerang lawan.

---

## Sistem Jawaban

Setiap tim memiliki:

- 4 pilihan jawaban
- Tombol jawaban terpisah
- Timer setiap soal

Tim yang menjawab benar lebih cepat akan:

- Memberikan damage kepada lawan
- Mengisi Ultimate Energy
- Menambah Combo

Sedangkan jawaban salah akan menyebabkan:

- Penalti sementara (Lock Answer)
- Kehilangan kesempatan menyerang

---

## HP Battle

Setiap tim memiliki:

- ❤️ HP Awal: **100**

Pertandingan berakhir apabila:

- HP salah satu tim habis
- Seluruh soal selesai dikerjakan

---

## Combo & Ultimate

Jawaban benar secara beruntun akan meningkatkan Combo.

Combo akan mengisi energi Ultimate sehingga karakter dapat mengeluarkan jurus pamungkas dengan animasi khusus dan damage lebih besar.

---

## Timer

Guru dapat memilih durasi setiap soal:

- ⏱️ 8 Detik
- ⏱️ 10 Detik
- ⏱️ 15 Detik
- ⏱️ 20 Detik

---

## Roster Siswa

Nama siswa dari masing-masing tim akan bergantian tampil secara otomatis sesuai urutan bermain sehingga seluruh anggota tim memperoleh kesempatan berpartisipasi.

---

# 🛡️ Hero RPG

Tersedia delapan karakter hero dengan kemampuan unik.

| Hero | Senjata | Skill | Ultimate |
|------|----------|---------|-----------|
| 🗡️ Kesatria Baja | Pedang Paladin & Perisai Singa | Holy Sword Slash | Excalibur Judgment |
| 🔮 Penyihir Elemen | Tongkat Kristal Astral | Arcane Fireblast | Supernova Cataclysm |
| ⚔️ Pendekar Samurai | Katana Muramasa | Iaido Slash | Senbonzakura Thousand Slash |
| 🤖 Siber Mekanik | Plasma Cannon | Photon Beam | Hyperion Laser Barrage |
| 🥷 Bayangan Shinobi | Kusarigama & Shuriken | Shadow Shuriken | Void Eclipse Execution |
| 🏴‍☠️ Kapten Bajak Laut | Cutlass & Meriam | Cannon Shot | Kraken Tempest Bombardment |
| 🏹 Pemanah Elang | Busur Kristal | Arrow Piercer | Solar Rain of Arrows |
| 🛡️ Penjaga Perisai Suci | Greatshield Runik | Shield Shockwave | Aegis Divine Sanctuary |

---

# 📚 Materi Matematika

Bank soal mencakup berbagai materi SMP, di antaranya:

- Operasi Hitung Dasar
- Bilangan Bulat
- Pecahan
- Perbandingan dan Rasio
- Aljabar
- Pythagoras
- Geometri
- Pola Bilangan
- Logika Matematika

Setiap soal memiliki:

- 4 pilihan jawaban
- 1 jawaban benar
- Pembahasan
- Kategori materi
- Tingkat kesulitan

---

# 👨‍🏫 Teacher Dashboard

Dashboard guru menyediakan berbagai fitur untuk mengelola pembelajaran.

## Manajemen Soal

- Menambah soal
- Mengedit soal
- Menghapus soal
- Menambahkan pembahasan
- Mengelompokkan berdasarkan kategori

---

## Import & Export

Guru dapat:

- Import Bank Soal JSON
- Export Bank Soal JSON

Sehingga soal dapat dibagikan kepada guru lain.

---

## AI Generator (Google Gemini)

Guru cukup memasukkan:

- Materi
- Jenjang kelas

Kemudian sistem akan menghasilkan soal matematika secara otomatis menggunakan Google Gemini AI.

---

# 📊 Statistik Pertandingan

Setelah pertandingan selesai, aplikasi akan menampilkan:

- Tim Pemenang
- Total Damage
- Akurasi Jawaban
- Jumlah Jawaban Benar
- Jumlah Jawaban Salah
- Durasi Pertandingan
- MVP (Most Valuable Player)

---

## Riwayat Pertandingan

Seluruh pertandingan akan disimpan secara lokal.

Fitur yang tersedia:

- Pilih pertandingan
- Hapus terpilih
- Pilih semua
- Hapus seluruh riwayat
- Konfirmasi penghapusan

---

## Export Laporan

Riwayat pertandingan dapat diekspor menjadi:

- CSV
- Microsoft Excel

Untuk kebutuhan dokumentasi maupun penilaian kelas.

---

# 🎵 Pengalaman Bermain

Math Battle Arena dilengkapi dengan:

- Background Music
- Sound Effect
- Animasi Serangan
- Animasi Ultimate
- Efek Kemenangan
- Efek Damage

Seluruh audio dibangun menggunakan **Web Audio API** sehingga ringan tanpa memerlukan file audio eksternal.

---

# 🎮 Kontrol Permainan

Selama pertandingan guru dapat:

- Pause Game
- Resume Game
- Keluar Pertandingan
- Fullscreen Mode

Mode fullscreen sangat cocok digunakan pada:

- Proyektor
- Smart TV
- Smartboard
- Layar kelas

---

# 💻 Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| React 19 | Frontend Framework |
| TypeScript | Bahasa Pemrograman |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Lucide React | Icon Library |
| Web Audio API | Audio Engine |
| Google Gemini API | AI Generator Soal |
| LocalStorage | Penyimpanan Data Lokal |

---

# 📁 Penyimpanan Data

Seluruh data disimpan menggunakan **Browser LocalStorage**, meliputi:

- Bank Soal
- Pengaturan
- Riwayat Pertandingan
- Statistik
- Data Tim

---

# ✨ Manfaat

## 👨‍🎓 Untuk Siswa

- Belajar matematika lebih menyenangkan.
- Melatih kecepatan berhitung.
- Meningkatkan fokus.
- Membangun kerja sama tim.
- Mengurangi rasa takut terhadap matematika.

---

## 👨‍🏫 Untuk Guru

- Pembelajaran lebih interaktif.
- Pengelolaan bank soal lebih mudah.
- Evaluasi hasil belajar otomatis.
- Riwayat pertandingan tersimpan rapi.
- Laporan dapat diekspor ke Excel.

---

## 🏫 Untuk Sekolah

- Mendukung pembelajaran berbasis teknologi.
- Meningkatkan keterlibatan siswa di kelas.
- Menjadi media pembelajaran inovatif berbasis AI.

---

# 🚀 Visi

Math Battle Arena hadir sebagai media pembelajaran matematika modern yang menggabungkan **edukasi**, **gamifikasi**, dan **kecerdasan buatan** untuk menciptakan pengalaman belajar yang lebih menarik, interaktif, dan efektif bagi siswa maupun guru.
