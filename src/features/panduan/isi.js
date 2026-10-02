// Isi panduan petugas. Untuk mengubah teks panduan, cukup edit file ini.
// Tiap bagian: id, judul, ringkas (opsional), langkah (daftar bernomor) atau butir (daftar poin).
export const PANDUAN = [
  {
    id: 'tujuan',
    judul: 'Untuk apa alat ini',
    paragraf: [
      'Alat ini dipakai petugas Direktorat SMA untuk mencatat hasil kunjungan ke sekolah lokus: melihat data dukung sekolah, mewawancarai narasumber memakai instrumen, lalu mengirim hasilnya sekali di akhir.',
      'Tidak ada login dan tidak ada kode akses. Anda memilih nama sendiri dari daftar.',
    ],
  },
  {
    id: 'persiapan',
    judul: 'Sebelum berangkat',
    poin: [
      'Buka alat ini di HP atau laptop dan pastikan halaman Beranda terbuka. Daftar petugas dan sekolah tersimpan di perangkat, jadi tetap bisa dibuka bila sinyal lemah.',
      'Gunakan satu perangkat dan satu peramban yang sama selama mengisi, supaya cadangan isian di perangkat tidak terpisah.',
      'Jangan menghapus data peramban (cache atau riwayat) sebelum isian terkirim.',
      'Baca panduan ini sampai selesai, terutama bagian "Cara mengisi" dan "Bila sinyal putus".',
    ],
  },
  {
    id: 'alur',
    judul: 'Cara mengisi, dari awal sampai kirim',
    langkah: [
      { judul: 'Pilih tahap pelaksanaan', isi: 'Di Beranda, pilih kartu tahap dan tanggal kegiatan Anda.' },
      { judul: 'Pilih titik lokus', isi: 'Pilih provinsi, lalu kabupaten atau kota tempat sekolah berada.' },
      { judul: 'Pilih tim', isi: 'Ketuk kartu tim Anda. Kartu menampilkan petugas dan sekolah sasaran tim. Bila hanya ada satu tim, atau nama Anda sudah tersimpan di perangkat, tim terpilih otomatis.' },
      { judul: 'Centang petugas yang hadir', isi: 'Centang semua pewawancara yang ikut ke sekolah. Bila ada petugas di luar daftar, ketik namanya pada kolom "Nama lain" lalu tekan Tambah.' },
      { judul: 'Pilih sekolah sasaran', isi: 'Ketuk sekolah yang sedang dikunjungi. Cek tanggal pelaksanaan pada jendela yang muncul, ubah bila berbeda dari jadwal, lalu tekan Mulai.' },
      { judul: 'Lihat data dukung (wajib)', isi: 'Baca data dukung sekolah lebih dulu, lalu tekan "Saya sudah melihat data dukung". Waktunya dicatat dan ikut terkirim. Tombol "Mulai wawancara" baru aktif setelah itu.' },
      { judul: 'Isi identitas dan narasumber', isi: 'Pastikan nama sekolah, tanggal, dan pewawancara benar. Pilih peran narasumber (kepala sekolah, operator Dapodik, bendahara, pengelola data, atau peran lain), lalu isi nama masing-masing. Narasumber paling banyak 3 orang.' },
      { judul: 'Isi ringkasan status S1 sampai S8', isi: 'Isi sesuai keterangan narasumber, bukan menyalin dari data dukung. Data Dapodik di sisi layar hanya sebagai pembanding. S4 dihitung otomatis dari S2 dikurangi S3.' },
      { judul: 'Wawancara butir B01 sampai B31', isi: 'Butir tampil satu per satu. Baca pertanyaan di sisi kiri, gunakan bahan wawancara di sisi kanan untuk menggali jawaban, lalu tulis kesimpulan jawaban. Tekan Lanjut untuk ke butir berikutnya. Daftar bagian dan butir di samping memungkinkan Anda melompat ke butir mana pun.' },
      { judul: 'Tinjau dan kirim', isi: 'Di halaman Tinjau, periksa ringkasan. Bila ada yang belum lengkap, daftar masalah muncul dan bisa diketuk untuk melompat ke bagian itu. Bila sudah lengkap, tekan Kirim sekali.' },
    ],
  },
  {
    id: 'butir15',
    judul: 'Butir 15 yang kadang tidak ditanyakan',
    paragraf: [
      'Butir 15 hanya ditanyakan bila jumlah peserta didik Dapodik (S2) berbeda dengan peserta didik BOSP 2027 pada data dukung. Bila sama, butir 15 otomatis ditandai "tidak ditanyakan" dan cukup ditekan Lanjut.',
      'Untuk sekolah yang tidak punya data dukung, butir 15 tampil dan Anda yang memutuskan. Boleh diisi "tidak ditanyakan".',
    ],
  },
  {
    id: 'dukung',
    judul: 'Membaca data dukung',
    poin: [
      'Angka ditampilkan apa adanya sebagai bahan pendalaman. Bukan penilaian terhadap sekolah, jadi sampaikan dengan nada bertanya.',
      'Selisih BOSP: jumlah peserta didik BOSP 2027 dikurangi BOSP 2026.',
      'Selisih Dapodik: jumlah peserta didik Dapodik terbaru dikurangi BOSP 2027.',
      'Residu: peserta didik yang datanya bermasalah, dipisah menjadi NISN dan NIK.',
      'Kelengkapan: seberapa lengkap data pokok terisi di Dapodik.',
      'Validitas: seberapa sesuai isian dengan aturan pengisian, misalnya format NISN dan NIK.',
      'Kemutakhiran: seberapa baru data diperbarui dan disinkronkan.',
      'Ketiganya adalah komponen Indeks Kualitas Data Dapodik, skala 0 sampai 100.',
    ],
  },
  {
    id: 'sinyal',
    judul: 'Bila sinyal putus',
    poin: [
      'Isian yang Anda ketik tersimpan otomatis di perangkat. Bila halaman tertutup atau sinyal hilang, buka lagi alat ini, pilih sekolah yang sama, dan isian dipulihkan. Pesan "Isian dipulihkan dari perangkat ini" akan muncul.',
      'Bila pengiriman gagal, muncul pesan galat dan isian tetap utuh. Tekan "Kirim ulang" setelah sinyal membaik.',
      'Isian dianggap terkirim hanya bila layar menampilkan "Isian berhasil terkirim" lengkap dengan nomor sesi. Bila tidak, anggap belum terkirim.',
    ],
  },
  {
    id: 'tidakada',
    judul: 'Bila sekolah tidak ada di daftar',
    poin: [
      'Tekan "Lokus saya tidak ada di sini" di Beranda.',
      'Pilih sekolah lain dari daftar 72 lokus, atau tambah sekolah baru: isi nama sekolah, kabupaten atau kota, dan tanggal pelaksanaan. NPSN dan provinsi boleh dikosongkan.',
      'Sekolah tambahan tidak punya data dukung. Anda bisa langsung mulai wawancara.',
    ],
  },
  {
    id: 'ubah',
    judul: 'Mengubah isian yang sudah terkirim',
    poin: [
      'Pilih sekolah yang sama di Beranda. Bila sudah ada isian di server, pilih "Lanjutkan atau ubah isian dari server".',
      'Ubah yang perlu, lalu kirim lagi. Isian lama diperbarui, bukan dibuat ganda.',
      'Bila saat mengirim muncul "Sekolah ini sudah punya isian", artinya petugas lain sudah mengirim. Pilih "Muat isian yang sudah ada untuk diubah". Perhatian: isian di layar akan diganti dengan isi dari server.',
    ],
  },
  {
    id: 'dashboard',
    judul: 'Dashboard progres',
    paragraf: ['Menu Dashboard menampilkan progres seluruh lokus: berapa yang sudah terkirim, masih draft, dan belum diisi. Datanya diperbarui otomatis tiap 60 detik selama tab terbuka, atau tekan Muat ulang.'],
  },
  {
    id: 'tips',
    judul: 'Catatan penting',
    poin: [
      'Pilih nama Anda sendiri. Nama dipakai sebagai pewawancara pada hasil kunjungan.',
      'Kirim sekali di akhir. Tidak ada simpan per butir ke server.',
      'Semua 31 butir wajib terisi. Butir 15 boleh "tidak ditanyakan".',
      'Tulis kesimpulan jawaban dengan kalimat singkat dan jelas. Hindari menulis penilaian terhadap pribadi narasumber.',
      'Kendala yang tidak tercantum di sini, catat dan laporkan ke tim data.',
    ],
  },
];
