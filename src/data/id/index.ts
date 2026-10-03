/**
 * Indonesian (Bahasa Indonesia) page content.
 *
 * Same method as src/data/pt/: localisation, not translation. Each page is
 * built around the query an Indonesian actually types (`gabungkan pdf`,
 * `kompres pdf`), so slugs are Indonesian too, and a tool is only listed here
 * once its keyword research exists — see ./keywords.ts, the source of truth
 * for every quoted query. Tools with no Indonesian search demand (OFX/QFX/QBO,
 * XML, XLS/XLSX to JSON, CSV to PDF…) are deliberately absent: their
 * Indonesian visitors search the English terms and get the English page.
 *
 * FACTS COME FROM THE AUDITED PAGES. Every claim about what a tool does is
 * taken from the Portuguese and English pages after the 2026-09 FAQ audit
 * (used range, not print area; transparency flattened to white; video in a
 * PPT left untouched…), never from what a converter "usually" does.
 *
 * Questions are quoted exactly as researched — lowercase, unpunctuated — as
 * on the Portuguese pages. Near-identical spellings of one question
 * (`cara mengubah` / `cara merubah` / `cara ubah`) are not all stacked as
 * separate FAQs; one leads, the others are carried in the copy.
 */
import type { LocaleTool, LocaleGuide, LocaleCategory, LocaleStaticPage } from '../../i18n/content';

/**
 * Whether /id/ is built at all. Off until the homepage and static pages exist:
 * a served locale registers /id/ as the home every page links to, and a tool
 * page whose logo points at an unbuilt homepage is a broken site, however
 * good the tool page is.
 */
export const ID_READY = false;

export const idCategories: LocaleCategory[] = [];

export const idTools: LocaleTool[] = [
  {
    en: 'excel-to-pdf',
    slug: 'excel-ke-pdf',
    name: 'Excel ke PDF',
    title: 'Ubah Excel ke PDF Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Konversi Excel ke PDF (.xlsx, .xls, .csv) langsung di browser, dengan tabel asli dan teks yang bisa dipilih. File Excel Anda tidak keluar dari perangkat.',
    headline: 'Excel ke PDF.',
    subtitle: 'Ubah spreadsheet menjadi PDF dengan tabel sungguhan dan judul kolom yang berulang di setiap halaman — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah Excel ke PDF, seret file .xlsx, .xls, atau .csv ke alat di atas lalu unduh PDF-nya. Setiap sheet digambar sebagai tabel sungguhan dengan garis dan judul kolom yang diulang di setiap halaman, dan teksnya tetap bisa dipilih serta dicari. Semua sheet ikut secara bawaan. Konversi berjalan di browser Anda, jadi file tidak pernah dikirim ke server.',
    category: 'Konverter Excel',
    faqs: [
      {
        question: 'cara mengubah excel ke pdf',
        answer: 'Seret file Excel ke alat di bagian atas halaman, lalu unduh PDF-nya. Setiap sheet menjadi tabel bergaris yang dimulai di halaman baru dengan nama sheet sebagai judul. Secara bawaan semua sheet disertakan — termasuk yang disembunyikan — tetapi Anda bisa mematikan "Sertakan semua sheet" untuk mengonversi sheet yang sedang dilihat saja.'
      },
      {
        question: 'cara save excel ke pdf',
        answer: 'Di Excel sendiri caranya File › Save As › PDF, tetapi hasilnya bergantung pada pengaturan halaman setiap sheet — di situlah kolom sering terpotong di tepi kanan. Di sini spreadsheet digambar sebagai tabel sungguhan dalam orientasi lanskap, dengan judul kolom diulang di tiap halaman, dan bisa dipakai tanpa Excel terpasang, termasuk dari HP.'
      },
      {
        question: 'Bagaimana kalau PDF-nya harus di bawah 1 MB atau 2 MB?',
        answer: 'Banyak yang mencari "kompres excel ke pdf" karena portal pendaftaran membatasi ukuran file. Lakukan dalam dua langkah: ubah Excel ke PDF di sini, lalu buka <a href="/id/kompres-pdf/">Kompres PDF</a> dan isi ukuran target, misalnya 1 MB. PDF dari tabel biasanya sudah kecil; yang membuatnya besar hampir selalu gambar atau logo di dalam spreadsheet.'
      },
      {
        question: 'Apakah area cetak (print area) di Excel diikuti?',
        answer: 'Tidak. Alat ini membaca area data yang terpakai — dari sel pertama sampai sel terakhir yang berisi — bukan print area yang Anda atur di Excel. Kolom yang disembunyikan juga tetap tercetak. Untuk mengatur persis apa yang muncul di PDF, hapus baris dan kolom yang tidak diinginkan sebelum konversi, jangan hanya disembunyikan.'
      },
      {
        question: 'Apakah rumus ikut muncul di PDF?',
        answer: 'Tidak — PDF menampilkan nilai hasil hitungan, bukan rumus di baliknya. Untuk daftar harga atau rincian biaya, ini biasanya justru yang diinginkan: penerima melihat angkanya tanpa melihat logika perhitungannya.'
      },
      {
        question: 'Apakah file Excel saya dikirim ke server?',
        answer: 'Tidak. Spreadsheet dibaca dan PDF dibuat di browser Anda, di perangkat Anda sendiri. Spreadsheet sering berisi data paling sensitif — gaji, daftar harga, data pelanggan — dan tidak ada satu pun yang disalin ke server.'
      }
    ],
    content: `
      <h2>Ubah Excel ke PDF dengan tabel sungguhan</h2>
      <p>Masalah paling umum saat <strong>konversi excel ke pdf</strong> muncul ketika dicetak: kolom terpotong di tepi halaman, judul kolom hilang mulai halaman kedua, atau teks berubah menjadi gambar. Di sini setiap sheet digambar sebagai tabel vektor dengan garis dan judul kolom berwarna yang diulang di setiap halaman — dan teksnya tetap bisa dipilih dan dicari, bukan tangkapan layar.</p>
      <p>Saat <strong>convert excel ke pdf</strong>, semua sheet di workbook ikut secara bawaan, masing-masing mulai di halaman baru dengan nama sheet sebagai judul. Bagi yang mencari cara merubah excel ke pdf hanya untuk satu sheet, matikan opsi "Sertakan semua sheet".</p>

      <h2>Yang dibaca — dan yang diabaikan</h2>
      <p>Perlu diketahui sebelum konversi: alat ini membaca <strong>area data yang terpakai</strong>, yaitu semua yang ada di antara sel pertama dan sel terakhir yang berisi. Print area yang Anda atur di Excel tidak dipakai, dan kolom tersembunyi tetap muncul di PDF. Untuk mengecualikan sesuatu, hapus baris dan kolomnya, jangan disembunyikan. Kami menuliskannya terang-terangan karena mengetahuinya setelah laporan terkirim jauh lebih merepotkan.</p>

      <h2>Kompres excel ke pdf untuk batas ukuran portal</h2>
      <p>Pencarian <strong>kompres excel ke pdf</strong> biasanya datang dari orang yang harus mengunggah dokumen ke portal dengan batas 1 MB atau 2 MB. Ubah file excel ke pdf di sini terlebih dulu; jika hasilnya masih di atas batas, <a href="/id/kompres-pdf/">Kompres PDF</a> punya mode "ukuran target" yang mencari pengaturan paling ringan yang tetap muat di bawah batas Anda.</p>

      <h2>Angka Anda tidak keluar dari perangkat</h2>
      <p>Spreadsheet menyimpan hal paling sensitif dalam sebuah usaha: gaji, margin, daftar pelanggan. Konverter yang menyalin file ke server menjadikannya soal kepercayaan. Alat ini memproses spreadsheet di dalam browser, di perangkat Anda sendiri — dan kodenya terbuka, jadi klaim ini bisa diperiksa, bukan sekadar dipercaya.</p>
    `
  },
  {
    en: 'xls-to-pdf',
    slug: 'xls-ke-pdf',
    name: 'XLS ke PDF',
    title: 'Ubah XLS ke PDF Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Konversi spreadsheet lama .xls ke PDF dengan tabel asli dan teks yang bisa dipilih, langsung di browser. File tidak keluar dari perangkat Anda.',
    headline: 'XLS ke PDF.',
    subtitle: 'Ubah spreadsheet format lama .xls menjadi PDF dengan tabel sungguhan — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah XLS ke PDF, tambahkan file .xls ke alat di atas lalu unduh PDF-nya. Setiap sheet digambar sebagai tabel sungguhan dengan garis dan judul kolom yang diulang di setiap pergantian halaman, dan teksnya tetap bisa dipilih serta dicari. Semua proses berjalan di browser Anda.',
    category: 'Konverter Excel',
    faqs: [
      {
        question: 'Apa bedanya .xls dan .xlsx di sini?',
        answer: '.xls adalah format biner Excel sebelum 2007, dan .xlsx adalah format yang sekarang. Halaman ini untuk format lama; untuk spreadsheet modern gunakan <a href="/id/excel-ke-pdf/">Excel ke PDF</a>. Hasilnya sama — bedanya hanya pada cara file asal dibaca.'
      },
      {
        question: 'Apakah teks di PDF bisa dipilih?',
        answer: 'Ya. Tabel digambar sebagai elemen vektor sungguhan, jadi teksnya bisa disalin, dicari, dan tetap tajam di zoom berapa pun — bukan tangkapan layar spreadsheet.'
      },
      {
        question: 'Apakah semua sheet ikut?',
        answer: 'Ya, termasuk sheet yang disembunyikan, dan masing-masing dimulai di halaman sendiri dengan nama sheet sebagai judul. Alat ini membaca area data yang terpakai, bukan print area di Excel, dan kolom tersembunyi tetap muncul. Untuk mengecualikan sesuatu, hapus baris dan kolomnya sebelum konversi.'
      },
      {
        question: 'Apakah file saya dikirim ke server?',
        answer: 'Tidak. File dibaca dan PDF dibuat di browser Anda, di perangkat Anda sendiri.'
      }
    ],
    content: `
      <h2>Spreadsheet lama yang masih beredar</h2>
      <p>Format .xls sudah digantikan sejak 2007, tetapi masih sering muncul dari sistem lama, ekspor aplikasi akuntansi, dan arsip bertahun-tahun. Alat untuk <strong>ubah xls ke pdf</strong> berguna ketika penerima tidak butuh spreadsheet-nya — yang dibutuhkan adalah dokumen yang terbuka di mana saja dan tidak bisa berubah tanpa sengaja.</p>

      <h2>Tabel sungguhan, bukan gambar</h2>
      <p>Saat <strong>konversi xls ke pdf</strong>, setiap sheet menjadi tabel vektor dengan garis dan judul kolom yang diulang di setiap pergantian halaman, dan teksnya tetap bisa dipilih. Ini penting jika PDF akan dibaca di layar, dicari isinya, atau dipakai untuk menyalin angka.</p>

      <h2>Yang dibaca alat ini</h2>
      <p>Alat ini memakai area data yang terpakai, bukan print area. Kolom tersembunyi tetap muncul di PDF. Untuk mengatur persis apa yang tampil, hapus baris dan kolom yang tidak diinginkan sebelum mengubah <strong>xls ke pdf</strong> — menyembunyikannya saja tidak cukup.</p>
    `
  },
  {
    en: 'png-to-jpg',
    slug: 'png-ke-jpg',
    name: 'PNG ke JPG',
    title: 'Ubah PNG ke JPG Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Ubah PNG ke JPG yang lebih kecil langsung di browser. Area transparan diratakan ke latar putih. Foto Anda tidak keluar dari perangkat.',
    headline: 'PNG ke JPG.',
    subtitle: 'Perkecil ukuran gambar dengan mengubah PNG menjadi JPG — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah PNG ke JPG, pilih gambar di alat di atas lalu unduh JPG-nya. Area transparan diratakan ke latar putih, karena JPG tidak mendukung transparansi, dan gambar dikompres agar ukurannya lebih kecil. Pilih JPG untuk foto dan untuk memenuhi batas ukuran; tetap pakai PNG untuk logo dan grafis yang butuh latar transparan. Tidak ada yang keluar dari perangkat Anda.',
    category: 'Alat Gambar',
    faqs: [
      {
        question: 'cara ubah png ke jpg',
        answer: 'Seret file .png ke alat di bagian atas halaman, lalu unduh file .jpg-nya. Ukurannya biasanya jauh lebih kecil, yang menyelesaikan sebagian besar kasus formulir atau aplikasi yang menolak gambar karena terlalu besar. Caranya sama di laptop maupun di HP, cukup lewat browser.'
      },
      {
        question: 'cara ubah foto png ke jpg',
        answer: 'Sama persis: pilih fotonya, unduh JPG-nya. Untuk foto, JPG hampir selalu pilihan yang tepat — PNG menyimpan setiap piksel tanpa kompresi yang cocok untuk foto, sehingga foto PNG bisa beberapa kali lebih besar dari JPG-nya tanpa terlihat lebih bagus.'
      },
      {
        question: 'Apakah cukup mengganti nama file dari .png ke .jpg?',
        answer: 'Tidak. Ekstensi hanyalah nama; isi file tetap PNG, dan banyak sistem menolaknya atau menampilkan error. Gambar harus dikodekan ulang, dan itulah yang dilakukan alat ini — tanpa perlu instal aplikasi atau membuat akun.'
      },
      {
        question: 'Bagaimana kalau JPG-nya harus di bawah 200 KB?',
        answer: 'Itulah maksud pencarian "kompres png ke jpg": mengubah format sekaligus memenuhi batas ukuran formulir. Untuk itu gunakan <a href="/image-resizer/">Image Resizer</a> dalam mode ukuran file: isi batasnya, misalnya 200 KB, pilih JPG sebagai format hasil, dan alat akan mencari kualitas tertinggi yang masih muat.'
      },
      {
        question: 'Apa yang terjadi dengan latar transparan?',
        answer: 'Diratakan ke warna putih, karena JPG tidak bisa menyimpan transparansi. Jika gambarnya logo yang akan dipasang di atas latar berwarna, mengubahnya ke JPG akan meninggalkan kotak putih di sekelilingnya — untuk itu tetap gunakan PNG, atau ubah ke <a href="/id/png-ke-webp/">WebP</a> yang mempertahankan transparansi sekaligus memperkecil ukuran.'
      }
    ],
    content: `
      <h2>Kapan perlu mengubah PNG ke JPG</h2>
      <p>Alasan paling umum mencari cara <strong>ubah png ke jpg</strong> adalah ukuran. Tangkapan layar dan gambar dari aplikasi desain biasanya tersimpan sebagai PNG, dan foto berformat PNG bisa beberapa kali lebih besar dari JPG yang setara. Formulir, aplikasi, dan lampiran email punya batas ukuran, dan <strong>konversi png ke jpg</strong> menyelesaikannya tanpa perbedaan yang terlihat pada foto.</p>

      <h2>Yang hilang: transparansi</h2>
      <p>Hanya ini kehilangan yang berarti, dan sifatnya permanen. JPG tidak punya saluran transparansi, jadi setiap area transparan diratakan ke putih. Untuk foto, tidak ada yang berubah — memang tidak ada transparansi yang hilang. Untuk logo yang dirancang untuk latar berwarna, hasilnya adalah kotak putih yang terlihat. Dalam kasus itu, tetap pakai PNG atau gunakan WebP.</p>

      <h2>Mengganti nama tidak mengonversi</h2>
      <p>Mengubah akhiran nama file dari .png ke .jpg tidak mengubah isinya — gambar tetap dikodekan sebagai PNG, dan banyak sistem menolaknya. <strong>Mengubah png ke jpg</strong> yang sebenarnya butuh pengodean ulang, seperti yang dilakukan alat ini.</p>

      <h2>Diproses di perangkat Anda</h2>
      <p>Saat Anda <strong>convert png ke jpg</strong> di sini, konversi terjadi di browser Anda tanpa antrean dan tanpa batas harian, dan gambar tidak disalin ke server mana pun. Ini penting untuk gambar: foto membawa metadata seperti lokasi dan model HP, dan tangkapan layar membawa apa pun yang ada di layar Anda.</p>
    `
  },
  {
    en: 'jpg-to-png',
    slug: 'jpg-ke-png',
    name: 'JPG ke PNG',
    title: 'Ubah JPG ke PNG Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Ubah JPG ke PNG tanpa kehilangan kualitas langsung di browser — cocok untuk diedit, tangkapan layar, dan gambar dengan teks tajam.',
    headline: 'JPG ke PNG.',
    subtitle: 'Ubah JPG menjadi PNG tanpa kehilangan kualitas, agar bisa diedit tanpa makin buruk setiap disimpan — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah JPG ke PNG, pilih gambar di alat di atas lalu unduh PNG tanpa kehilangan kualitas. PNG mencegah penurunan kualitas yang menumpuk pada JPG setiap kali disimpan ulang, jadi tepat untuk diedit, untuk tangkapan layar, dan gambar dengan teks atau garis tajam. File PNG biasanya lebih besar, karena menyimpan setiap piksel apa adanya. Konversi berjalan sepenuhnya di browser Anda.',
    category: 'Alat Gambar',
    faqs: [
      {
        question: 'cara ubah jpg ke png',
        answer: 'Seret file .jpg atau .jpeg ke alat di bagian atas halaman, lalu unduh file .png-nya. Tanpa daftar akun, tanpa watermark, tanpa batas harian, dan gambar tidak keluar dari perangkat Anda.'
      },
      {
        question: 'cara mengubah jpg ke png di hp',
        answer: 'Buka halaman ini di browser HP, ketuk area pilih file, lalu ambil foto dari galeri atau file manager. PNG dibuat di HP Anda sendiri, tanpa perlu instal aplikasi. Hasilnya tersimpan di folder unduhan.'
      },
      {
        question: 'Apakah mengubah ke PNG membuat latar menjadi transparan?',
        answer: 'Tidak. Inilah salah paham paling umum soal format ini. PNG <em>bisa</em> menyimpan transparansi, tetapi JPG tidak punya saluran transparansi — tidak ada latar transparan di file asli yang bisa dipertahankan. Hasilnya PNG dengan latar yang sama seperti sebelumnya. Menghapus latar butuh alat yang mengenali objek di dalam gambar, yang merupakan jenis alat lain.'
      },
      {
        question: 'Apakah file PNG jadi lebih besar dari JPG?',
        answer: 'Hampir selalu ya, kadang beberapa kali lipat. Itulah harga format tanpa kehilangan kualitas: PNG menyimpan setiap piksel, bukan perkiraannya. Untuk foto selisihnya besar; untuk tangkapan layar dan grafis dengan sedikit warna selisihnya jauh lebih kecil.'
      },
      {
        question: 'Apakah gambar saya dikirim ke server?',
        answer: 'Tidak. Gambar didekode dan dikodekan ulang di browser Anda, di perangkat Anda sendiri. Foto dan tangkapan layar tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Kenapa mengubah JPG ke PNG</h2>
      <p>Alasan utamanya adalah penurunan kualitas yang menumpuk. JPG adalah format yang membuang sebagian informasi: setiap kali dibuka, diedit, lalu disimpan lagi, sedikit detail hilang — dan efeknya menumpuk, terlihat sebagai noda di sekitar teks dan tepi gambar. <strong>Ubah jpg ke png</strong> sebelum mulai mengedit membekukan gambar di kondisinya sekarang.</p>
      <p><strong>Konversi jpg ke png</strong> juga tepat ketika gambar berisi teks, garis tipis, atau bidang warna rata: pola-pola itulah yang paling buruk ditangani kompresi JPG.</p>

      <h2>PNG bukan berarti latar transparan</h2>
      <p>Perlu dikatakan dengan jelas karena ini harapan yang paling sering kecewa: PNG <em>mendukung</em> transparansi, tetapi itu tidak berarti mengubah ke PNG akan menghapus latar. JPG tidak punya saluran transparansi — tidak ada yang bisa dipertahankan. Hasilnya punya latar yang sama, hanya dalam format lain. Karena itu kami tidak menjanjikan "jpg ke png transparan": menghapus latar adalah pekerjaan mengenali objek, bukan konversi format.</p>

      <h2>Semuanya terjadi di perangkat Anda</h2>
      <p>Saat <strong>convert jpg ke png</strong> di sini, gambar diproses di dalam browser dan tidak disalin ke server mana pun — sama saja di laptop maupun saat <strong>ubah foto jpg ke png</strong> dari HP.</p>
    `
  },
  {
    en: 'webp-to-png',
    slug: 'webp-ke-png',
    name: 'WebP ke PNG',
    title: 'Ubah WebP ke PNG Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Ubah gambar WebP ke PNG standar langsung di browser, dengan transparansi tetap terjaga, agar bisa dibuka di aplikasi apa pun.',
    headline: 'WebP ke PNG.',
    subtitle: 'Ubah gambar WebP menjadi PNG standar yang bisa dibuka di aplikasi apa pun — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah WebP ke PNG, pilih gambar di alat di atas lalu unduh PNG standar tanpa kehilangan kualitas, yang terbuka di mana saja — termasuk di aplikasi lama dan editor yang tidak mengenali WebP. Transparansi tetap terjaga. File PNG biasanya lebih besar, karena menyimpan setiap piksel tanpa kompresi WebP. Semuanya diproses di browser Anda.',
    category: 'Alat Gambar',
    faqs: [
      {
        question: 'Kenapa banyak aplikasi tidak bisa membuka WebP?',
        answer: 'WebP adalah format yang relatif baru dan dibuat untuk web. Browser modern menampilkannya tanpa masalah, tetapi banyak aplikasi perkantoran, editor gambar lama, dan sistem internal perusahaan belum mengenalinya — itulah sebabnya gambar yang disimpan dari situs web sering harus diubah dulu sebelum dipakai.'
      },
      {
        question: 'Apakah transparansi tetap terjaga?',
        answer: 'Ya. WebP dan PNG sama-sama mendukung transparansi, jadi area transparan tetap utuh setelah konversi. Ini salah satu keuntungan mengubah ke PNG dibanding ke JPG, yang akan meratakan semuanya ke putih.'
      },
      {
        question: 'Apakah kualitas gambar menurun?',
        answer: 'Tidak ada penurunan tambahan: PNG tanpa kehilangan kualitas dan menyimpan persis piksel yang dihasilkan WebP. Jika WebP asalnya sudah dikompres, kompresi itu tetap terlihat — konversi tidak mengembalikan detail yang sudah hilang, tetapi juga tidak menurunkan apa pun.'
      },
      {
        question: 'Kenapa file PNG-nya lebih besar?',
        answer: 'Karena WebP mengompres lebih baik. PNG menyimpan setiap piksel tanpa perkiraan, sehingga biasanya jauh lebih besar dari WebP yang setara. Itulah harga format yang terbuka di mana saja.'
      },
      {
        question: 'Apakah gambar saya dikirim ke server?',
        answer: 'Tidak. Konversi terjadi di browser Anda, di perangkat Anda sendiri, dan gambar tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Format yang tidak bisa dibuka aplikasi Anda</h2>
      <p>Pencarian <strong>ubah webp ke png</strong> hampir selalu berawal sama: Anda menyimpan gambar dari sebuah situs, mencoba memasukkannya ke Word atau editor, dan file-nya ditolak. WebP dibuat untuk web dan ditampilkan oleh setiap browser modern, tetapi banyak aplikasi perkantoran dan sistem internal belum mengenalinya.</p>
      <p><strong>Konversi webp ke png</strong> mengembalikan gambar ke format universal yang bisa dibuka aplikasi apa pun.</p>

      <h2>Tidak ada yang hilang saat konversi</h2>
      <p>PNG tidak kehilangan kualitas, jadi gambar sampai persis seperti aslinya — termasuk transparansi, yang didukung kedua format. Jika WebP asalnya sudah dikompres, kompresi itu tetap terlihat: konversi tidak menciptakan detail yang sudah tidak ada, tetapi juga tidak menambah penurunan baru.</p>

      <h2>File akan menjadi lebih besar</h2>
      <p>Itulah konsekuensinya. WebP ada justru karena kompresinya lebih baik; PNG menyimpan setiap piksel. Saat mengubah <strong>webp ke png</strong>, perkirakan file yang jauh lebih besar — sebagai ganti bisa dibuka di mana saja. Jika gambar akan dipakai lagi di web, arah sebaliknya biasanya lebih masuk akal.</p>
    `
  },
  {
    en: 'png-to-webp',
    slug: 'png-ke-webp',
    name: 'PNG ke WebP',
    title: 'Ubah PNG ke WebP Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Ubah PNG ke WebP langsung di browser: jauh lebih kecil dengan kualitas setara dan transparansi tetap terjaga.',
    headline: 'PNG ke WebP.',
    subtitle: 'Perkecil gambar situs Anda sambil mempertahankan transparansi — diproses di perangkat Anda sendiri.',
    quickAnswer: 'Untuk mengubah PNG ke WebP, pilih gambar di alat di atas lalu unduh WebP yang jauh lebih kecil dengan kualitas visual setara — dalam pengujian kami, setengah hingga seperenam ukuran PNG — dengan transparansi tetap terjaga. WebP didukung semua browser modern dan mempercepat pemuatan halaman. Konversi berjalan sepenuhnya di perangkat Anda.',
    category: 'Alat Gambar',
    faqs: [
      {
        question: 'Seberapa kecil hasilnya?',
        answer: 'Dalam pengujian kami, 50% sampai 83% lebih kecil: tangkapan layar turun kira-kira menjadi setengah, dan foto yang disimpan sebagai PNG menjadi seperenamnya. WebP dibuat dengan kualitas 92%, jadi perbedaannya tidak terlihat dalam pemakaian normal. Gambar yang sangat sederhana dengan sedikit warna sudah terkompres baik sebagai PNG dan berkurang lebih sedikit.'
      },
      {
        question: 'Apakah transparansi tetap ada?',
        answer: 'Ya. WebP mendukung saluran alfa, jadi logo dan gambar berlatar transparan tetap utuh setelah konversi — berbeda dengan JPG, yang akan meratakan semuanya ke putih.'
      },
      {
        question: 'Apakah semua browser bisa menampilkan WebP?',
        answer: 'Ya, semua browser modern — Chrome, Firefox, Safari, Edge, dan versi HP-nya. Yang perlu diwaspadai bukan browser, melainkan aplikasi perkantoran dan editor lama yang mungkin masih menolak format ini. Untuk gambar web tidak masalah; untuk file yang akan dimasukkan ke Word, pilih PNG.'
      },
      {
        question: 'Apakah kualitasnya menurun?',
        answer: 'Ukuran berkurang karena kompresi yang lebih efisien, dan dalam pemakaian normal perbedaannya tidak terlihat. Tetap saja ini kompresi ulang: jika gambar masih akan diedit berulang kali, simpan PNG aslinya sebagai salinan kerja dan pakai WebP untuk dipublikasikan.'
      },
      {
        question: 'Apakah gambar saya dikirim ke server?',
        answer: 'Tidak. Konversi terjadi di browser Anda, di perangkat Anda sendiri, dan gambar tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Gambar lebih ringan tanpa mengubah tampilan situs</h2>
      <p>Mengubah <strong>png ke webp</strong> biasanya dilakukan setelah ketahuan bahwa gambarlah yang membuat halaman lambat. Di situs biasa, gambar adalah bagian terberat dari setiap halaman — dan PNG, karena tanpa kehilangan kualitas, adalah format yang paling berat.</p>
      <p>Dalam pengujian kami, <strong>konversi png ke webp</strong> memperkecil file 50% sampai 83% dengan kualitas yang tidak terlihat bedanya, yang langsung berarti halaman lebih cepat, terutama di koneksi seluler.</p>

      <h2>Transparansi tetap terjaga</h2>
      <p>Inilah yang membedakan WebP dari JPG dalam peran ini. Logo, ikon, dan gambar yang dipotong tetap berlatar transparan setelah konversi, jadi tidak ada tata letak yang perlu diubah.</p>

      <h2>Di mana WebP belum cocok</h2>
      <p>Semua browser modern menampilkan WebP, tetapi aplikasi perkantoran dan editor lama belum tentu. Jika gambar akan dimasukkan ke dokumen Word atau dikirim ke orang yang membukanya di editor lama, PNG tetap pilihan aman. Dan simpan PNG aslinya jika gambar masih akan diedit: WebP sangat baik untuk dipublikasikan, bukan untuk diolah berkali-kali.</p>
    `
  },
  {
    en: 'txt-to-pdf',
    slug: 'txt-ke-pdf',
    name: 'TXT ke PDF',
    title: 'Ubah TXT ke PDF Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Ubah file teks (.txt) menjadi PDF berhalaman langsung di browser, dengan teks yang bisa dipilih dan tata letak monospace.',
    headline: 'TXT ke PDF.',
    subtitle: 'Ubah catatan, log, dan kode menjadi PDF berhalaman yang mudah dibagikan — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah TXT ke PDF, pilih file .txt di alat di atas lalu unduh PDF yang rapi dan berhalaman, dengan teks yang bisa dipilih dalam tata letak monospace. Baris panjang dipotong ke baris berikutnya secara otomatis dan isinya mengalir antarhalaman, sehingga catatan, log, dan kode menjadi dokumen yang mudah dibagikan. File dibuat di browser Anda dan tidak keluar dari perangkat.',
    category: 'Alat Dokumen',
    faqs: [
      {
        question: 'cara ubah txt ke pdf',
        answer: 'Seret file .txt ke alat di bagian atas halaman, lalu unduh PDF-nya. Pembagian halaman berjalan otomatis dan teks tetap bisa dipilih di hasilnya, jadi Anda bisa menyalin bagian tertentu dan mencari di dalam dokumen.'
      },
      {
        question: 'Kenapa teksnya memakai huruf monospace?',
        answer: 'Karena file .txt sering bergantung pada perataan dengan spasi: log, keluaran terminal, tabel sederhana, dan kode hanya terbaca jika setiap karakter selebar yang lain. Huruf proporsional akan membuat semuanya tidak sejajar. Untuk teks biasa, perbedaannya hanya soal tampilan.'
      },
      {
        question: 'Apa yang terjadi dengan baris yang sangat panjang?',
        answer: 'Baris dipotong ke baris berikutnya agar muat di lebar halaman, bukan terpotong di tepi. Tidak ada isi yang hilang — satu baris log sepanjang 300 karakter tampil utuh, tersebar di beberapa baris.'
      },
      {
        question: 'Apakah huruf dan karakter khusus tampil dengan benar?',
        answer: 'Ya, untuk file UTF-8, yang merupakan standar saat ini. File lama yang disimpan dengan encoding lain bisa menampilkan karakter yang salah — dalam hal itu, buka lagi file .txt di editor, simpan sebagai UTF-8, lalu konversi ulang.'
      },
      {
        question: 'Apakah file saya dikirim ke server?',
        answer: 'Tidak. PDF disusun di dalam browser Anda, di perangkat Anda sendiri, dan file tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Saat file teks harus menjadi dokumen</h2>
      <p>Mencari cara <strong>ubah txt ke pdf</strong> biasanya berarti isinya harus dikirim, dilampirkan, atau dicetak — dan .txt tidak cocok untuk itu: tidak punya halaman, tidak punya margin, dan terbuka berbeda di setiap aplikasi. Mengubah <strong>txt ke pdf</strong> memberi teks bentuk yang tetap, yang sampai sama persis ke penerima.</p>

      <h2>Tata letak monospace, dengan sengaja</h2>
      <p>File teks sering bergantung pada perataan dengan spasi — log, keluaran terminal, kode, tabel yang disusun dengan spasi manual. Huruf proporsional akan merusak perataan itu. Karena itu PDF memakai huruf monospace, di mana setiap karakter sama lebarnya dan kolom tetap sejajar.</p>

      <h2>Tidak ada yang terpotong</h2>
      <p>Baris panjang dipindahkan ke baris berikutnya agar muat di lebar halaman, dan isi mengalir otomatis antarhalaman. Teks PDF tetap bisa dipilih dan dicari, jadi dokumennya tetap berguna sebagai sumber, bukan sekadar gambar dari file aslinya.</p>
    `
  },
  {
    en: 'compress-pdf',
    slug: 'kompres-pdf',
    name: 'Kompres PDF',
    title: 'Kompres PDF Online Gratis — 1 MB, 500 KB, 200 KB | ConvertOcean',
    description: 'Kompres PDF sesuai ukuran yang diinginkan — 1 MB, 500 KB atau 200 KB — langsung di browser. Tanpa upload, tanpa watermark, tanpa batas harian.',
    headline: 'Kompres PDF.',
    subtitle: 'Perkecil ukuran PDF sampai di bawah batas portal pendaftaran — tanpa file keluar dari perangkat Anda, tanpa watermark, tanpa daftar akun.',
    quickAnswer: 'Untuk kompres PDF, seret dokumen ke alat di atas: ukurannya langsung diperkecil, dan Anda bisa mengganti tingkatnya (Ringan, Disarankan, Kuat) atau memakai "Tentukan ukuran" untuk mengisi batas dalam KB, misalnya 1 MB, 500 KB, atau 200 KB. Semua terjadi di dalam browser Anda: file tidak keluar dari perangkat dan tidak disalin ke server mana pun. Inilah cara tercepat agar dokumen hasil scan muat di bawah batas ukuran portal seperti SSCASN.',
    category: 'Alat PDF',
    faqs: [
      {
        question: 'cara kompres pdf',
        answer: 'Seret dokumen ke alat di bagian atas halaman: PDF langsung diperkecil dengan tingkat Disarankan, dan Anda bisa menggantinya ke Ringan atau Kuat. Ukuran akhir tampil sebelum Anda mengunduh. Jika ada batas yang harus dipenuhi, pakai "Tentukan ukuran" lalu isi angkanya dalam KB. Tanpa daftar akun, tanpa watermark, tanpa batas harian.'
      },
      {
        question: 'kompres pdf sesuai ukuran yang diinginkan',
        answer: 'Pilih "Tentukan ukuran", isi batasnya — misalnya 1024 KB untuk 1 MB, 500 KB, atau 200 KB — lalu klik "Sesuaikan ke ukuran ini". Alat mencari pengaturan paling ringan yang masih muat di bawah batas itu, jadi dokumen tidak dikompres lebih keras dari yang perlu. Jika batasnya tidak bisa dicapai tanpa membuat halaman tak terbaca, alat memberi tahu dan menampilkan ukuran terkecil yang mungkin.'
      },
      {
        question: 'cara kompres pdf jadi 1 mb',
        answer: 'Gunakan "Tentukan ukuran" dan isi 1024 KB. Untuk dokumen hasil scan, 1 MB hampir selalu tercapai, karena gambar di dalamnya biasanya disimpan jauh lebih besar dari yang ditampilkan halaman. PDF yang isinya hampir semua teks memang sudah kecil — jika masih di atas 1 MB, biasanya ada halaman yang tidak perlu dikirim; buang dengan <a href="/id/pisahkan-pdf/">Pisahkan PDF</a>.'
      },
      {
        question: 'cara kompres ukuran pdf',
        answer: 'Langkah pertama adalah tahu di mana beratnya. Buka PDF dan coba pilih satu kalimat: jika teksnya tersorot, dokumen sebagian besar berupa teks dan sudah kecil — kompresi hanya mengurangi sedikit. Jika kursor hanya menggambar kotak, setiap halaman adalah gambar hasil scan, dan di situlah kompresi benar-benar terasa: dokumen scan dan berisi foto biasanya turun 40% sampai 70%.'
      },
      {
        question: 'cara kompres file pdf di hp',
        answer: 'Buka halaman ini di browser HP, ketuk area pilih file, ambil PDF dari file manager atau unduhan, lalu unduh hasilnya. Tidak perlu instal aplikasi, dan dokumen tetap di HP Anda. Yang membatasi di HP lama adalah memori untuk file besar; batas per file 25 MB.'
      },
      {
        question: 'cara kompres pdf di laptop',
        answer: 'Sama seperti di HP: buka halaman ini di browser apa pun — Chrome, Edge, Firefox — seret PDF ke alat, lalu unduh hasilnya. Tidak ada program yang perlu dipasang.'
      },
      {
        question: 'Apakah dokumen tetap terbaca oleh panitia seleksi?',
        answer: 'Ya, selama Anda memeriksa hasilnya sebelum mengunggah ke portal. Portal menolak file yang tidak terbaca, jadi buka PDF hasil kompres dan pastikan nama, nomor dokumen, dan tanda tangan masih jelas. Jika tingkat Kuat membuat teks buram, turunkan satu tingkat: biasanya file masih di bawah batas.'
      },
      {
        question: 'Apakah dokumen saya dikirim ke server?',
        answer: 'Tidak. Kompresi berjalan sepenuhnya di browser Anda, di perangkat Anda sendiri. Dokumen tidak disalin ke server kami atau pihak ketiga, dan kami tidak bisa melihatnya. Kode situs ini terbuka dan bisa diperiksa di repositori publik.'
      }
    ],
    content: `
      <h2>Kompres PDF ke 1 MB, 500 KB, atau 200 KB</h2>
      <p>Hampir semua pencarian <strong>kompres pdf</strong> berasal dari satu situasi: portal pendaftaran — CPNS, beasiswa, sekolah, lamaran kerja — menolak file karena terlalu besar. Karena itu alat ini punya mode ukuran target. Isi batasnya, dan alat mencari pengaturan paling ringan yang masih muat, bukan langsung mengompres sekeras mungkin. Ini cara paling aman untuk <strong>kompres pdf 1 mb</strong>, <strong>kompres pdf 500kb</strong>, <strong>kompres pdf 200kb</strong>, maupun <strong>kompres pdf 2 mb</strong>.</p>
      <p>Gratis, tanpa daftar akun, tanpa watermark — <strong>kompres pdf online</strong> di sini berarti alat lengkapnya, bukan versi percobaan.</p>

      <h2>Di mana berat file Anda</h2>
      <p>Inilah yang menentukan seberapa kecil file bisa dibuat, dan hampir tidak ada yang memeriksanya dulu. Buka PDF dan coba pilih satu kalimat. Jika teks tersorot, dokumen pada dasarnya teks: ia sudah kecil dan kompresi hanya mengurangi sedikit. Jika kursor hanya menggambar kotak, setiap halaman adalah foto — dan di situlah ukurannya bisa turun drastis.</p>

      <h2>Tanpa kehilangan kualitas: tergantung dokumennya</h2>
      <p>Pada PDF berisi teks, teksnya vektor dan tetap tajam serta bisa dipilih di tingkat mana pun. Teks, tautan, dan kolom formulir tidak diubah — hanya data gambar. Pada halaman hasil scan, tidak ada kompresi yang benar-benar tanpa kehilangan: gambar dikompres ulang dan kualitasnya turun sesuai tingkat yang dipilih. Kami menuliskannya terang-terangan karena dokumen yang ditolak panitia karena buram jauh lebih merepotkan daripada memilih tingkat yang lebih ringan sekarang.</p>

      <h2>Jika ukurannya tetap tidak tercapai</h2>
      <p>Batas per file 25 MB, karena semuanya diproses di memori browser Anda. Untuk dokumen yang lebih besar, atau yang tetap di atas batas, buang halaman yang tidak perlu dengan <a href="/id/pisahkan-pdf/">Pisahkan PDF</a>. Dan jika dokumen belum di-scan, scan pada 200 dpi dalam hitam-putih atau abu-abu: file yang lahir kecil hampir tidak perlu dikompres.</p>

      <h2>Dokumen tidak keluar dari perangkat Anda</h2>
      <p>KTP, ijazah, transkrip, dan slip gaji adalah dokumen yang paling sering perlu dikompres — dan yang paling tidak boleh beredar. Di sini kompresi terjadi di dalam browser, dan file tidak disalin ke server mana pun.</p>
    `
  },
  {
    en: 'compress-powerpoint',
    slug: 'kompres-ppt',
    name: 'Kompres PPT',
    title: 'Kompres PPT Online Gratis — Perkecil PowerPoint | ConvertOcean',
    description: 'Kompres PPT (.pptx) langsung di browser dengan mengompres ulang gambar yang terlalu besar. Teks, layout, dan animasi tetap utuh. Tanpa upload.',
    headline: 'Kompres PPT.',
    subtitle: 'Perkecil file PowerPoint dengan mengompres ulang hanya gambar yang disimpan lebih besar dari tampilannya di slide — teks, layout, catatan, dan animasi tetap sama.',
    quickAnswer: 'Untuk kompres PPT, seret file .pptx ke alat di atas dan ukurannya langsung diperkecil — biasanya 40% sampai 80% untuk presentasi yang banyak fotonya, karena foto yang ditempel tetap disimpan dalam resolusi asli kamera walau tampil di kotak beberapa sentimeter. Untuk mencapai batas tertentu, misalnya 1 MB, pakai opsi tentukan ukuran. Teks, layout, catatan pembicara, dan animasi tetap persis seperti semula.',
    category: 'Alat Dokumen',
    faqs: [
      {
        question: 'cara kompres ppt',
        answer: 'Seret file .pptx ke alat di bagian atas halaman dan ukurannya langsung berkurang. Pada presentasi yang banyak fotonya, biasanya turun 40% sampai 80%. Untuk batas tertentu, isi ukuran yang diinginkan dan alat mencari pengaturan paling ringan yang masih muat.'
      },
      {
        question: 'kompres ppt sesuai ukuran yang diinginkan',
        answer: 'Gunakan "Atau tentukan ukuran", isi angkanya — misalnya 1 MB, 2 MB, 5 MB, atau 10 MB — lalu klik "Sesuaikan ke ukuran ini". Alat memberi tahu dengan jelas jika ukuran itu tidak bisa dicapai, misalnya karena sebagian besar isi file adalah video.'
      },
      {
        question: 'cara kompres ppt yang ada videonya',
        answer: 'Alat ini mengompres gambar (PNG dan JPEG) di dalam presentasi; video yang tertanam dibiarkan apa adanya. Jadi jika file besar karena video, bagian itu tidak bisa diperkecil di sini. Di PowerPoint sendiri ada File › Info › Compress Media untuk video; setelah itu, jalankan alat ini untuk gambarnya.'
      },
      {
        question: 'cara kompres ppt di hp',
        answer: 'Buka halaman ini di browser HP, ketuk area pilih file, dan ambil .pptx dari file manager atau unduhan. File diproses di HP Anda tanpa perlu instal aplikasi, lalu hasilnya tersimpan di folder unduhan.'
      },
      {
        question: 'Bagaimana dengan file .ppt lama?',
        answer: 'Alat ini bekerja dengan .pptx. File .ppt format lama (sebelum 2007) harus dibuka di PowerPoint atau LibreOffice lalu disimpan sebagai .pptx terlebih dulu — format lama itu tidak bisa dibaca di dalam browser.'
      },
      {
        question: 'Apakah tampilan slide berubah?',
        answer: 'Tidak. Teks, layout, warna tema, catatan pembicara, dan animasi tetap persis seperti semula — hanya gambar yang dikodekan ulang, dan hanya yang disimpan lebih besar dari tampilannya di slide. Presentasi tetap bisa diedit sepenuhnya.'
      },
      {
        question: 'Apakah presentasi saya dikirim ke server?',
        answer: 'Tidak. Kompresi terjadi di browser Anda, di perangkat Anda sendiri. Materi kuliah, proposal, dan presentasi internal tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Beratnya ada di foto, bukan di slide</h2>
      <p>Presentasi yang tidak muat di email atau di batas unggah tugas jarang terlalu panjang — fotonya yang terlalu besar. Saat <strong>kompres ppt</strong>, penghematan datang dari satu hal yang jarang diketahui: PowerPoint menyimpan setiap gambar dalam resolusi asli saat ditempel, walaupun slide menampilkannya di kotak beberapa sentimeter.</p>
      <p>Foto HP selebar 4.000 piksel yang tampil sepuluh sentimeter membawa data berkali-kali lipat dari yang pernah ditampilkan layar. Itulah sebabnya presentasi penuh gambar biasanya berkurang 40% sampai 80%.</p>

      <h2>Kompres ppt jadi 1 mb, 2 mb, atau 10 mb</h2>
      <p>Jika ada batas ukuran, isi angkanya dan alat mencari pengaturan paling ringan yang masih di bawahnya, alih-alih mengompres sekeras mungkin dan menurunkan kualitas lebih dari perlu. Cocok untuk <strong>kompres ppt jadi 1 mb</strong> atau <strong>kompres ppt jadi 10 mb</strong>. Yang tidak bisa diperkecil di sini adalah video yang tertanam — alat ini hanya mengompres gambar.</p>

      <h2>Tidak ada yang diubah selain gambar</h2>
      <p>Teks, layout, warna tema, catatan pembicara, dan animasi tetap sama. Hasilnya tetap file .pptx yang bisa diedit — <strong>kompres ppt ke ppt</strong>, tanpa konversi format. Bagi yang mencari <strong>kompres powerpoint</strong>, ini alat yang sama.</p>

      <h2>File .ppt lama butuh satu langkah dulu</h2>
      <p>Format biner .ppt tidak bisa dibaca di browser. Buka di PowerPoint atau LibreOffice, simpan sebagai .pptx, lalu kompres.</p>
    `
  },
  {
    en: 'compress-excel',
    slug: 'kompres-excel',
    name: 'Kompres Excel',
    title: 'Kompres Excel Online Gratis — Perkecil File XLSX | ConvertOcean',
    description: 'Kompres file Excel yang terlalu besar langsung di browser. Sebagian besar ukurannya berasal dari sel kosong berformat, bukan gambar — itulah yang dibuang.',
    headline: 'Kompres Excel.',
    subtitle: 'Spreadsheet raksasa hampir tidak pernah penuh data — isinya sel kosong yang berformat. Itulah yang dibuang alat ini.',
    quickAnswer: 'Untuk kompres Excel, seret file .xlsx ke alat di atas dan ukurannya langsung berkurang. Ukuran berlebih pada spreadsheet biasanya bukan dari gambar, melainkan dari baris dan kolom setelah akhir data yang hanya membawa warna isian atau garis tepi — terjadi ketika seluruh kolom pernah dipilih lalu diformat. Excel menyimpan setiap sel kosong itu, sehingga workbook dengan 200 baris data bisa berukuran 15 MB.',
    category: 'Konverter Excel',
    faqs: [
      {
        question: 'cara kompres file excel',
        answer: 'Seret file ke alat di bagian atas halaman dan ukurannya langsung berkurang. Penyebab file berat hampir selalu sama: suatu saat seluruh kolom atau baris pernah dipilih lalu diberi warna, garis tepi, atau format angka. Excel lalu menyimpan setiap sel kosong yang terkena, dan area data file meluas sampai ribuan baris tanpa isi. Itulah yang dibuang.'
      },
      {
        question: 'cara kompres file excel yang terlalu besar',
        answer: 'Karena ukuran file tidak mengikuti jumlah data, melainkan area yang terpakai. Memilih seluruh kolom A lalu mewarnainya kuning menandai lebih dari sejuta sel sebagai berformat, dan Excel menyimpan semuanya walaupun kosong. Alat ini memotong area itu kembali ke tempat data Anda benar-benar berakhir. Jika ada batas, misalnya 10 MB atau 2 MB, isi di "Atau tentukan ukuran".'
      },
      {
        question: 'cara kompres foto di excel',
        answer: 'Gambar yang disimpan lebih besar dari tampilannya di sheet ikut dikodekan ulang ke ukuran yang berguna. Tetapi pada kebanyakan spreadsheet besar, foto bukan penyebab utamanya — sel kosong berformat jauh lebih berat. Alat ini menangani keduanya sekaligus.'
      },
      {
        question: 'Apakah data atau rumus saya berubah?',
        answer: 'Sel yang berisi — nilai, rumus, dan formatnya — tetap dipertahankan. Yang dibuang adalah sel kosong yang hanya membawa format, di luar area data Anda. Tetap periksa hasilnya sebelum mengganti file asli: ini bukan operasi tanpa perubahan sama sekali, dan halaman ini memberi pilihan seberapa banyak yang dibuang.'
      },
      {
        question: 'Kenapa dimasukkan ke ZIP tidak membuatnya lebih kecil?',
        answer: 'Karena .xlsx di dalamnya sudah berupa arsip ZIP. Mengompresnya lagi ke ZIP lain hampir tidak mengurangi apa pun. Penghematan nyata harus datang dari dalam file: membersihkan area terpakai dan mengodekan ulang gambar yang terlalu besar.'
      },
      {
        question: 'Apakah file saya dikirim ke server?',
        answer: 'Tidak. Seluruh pembacaan dan penulisan ulang terjadi di browser Anda, di perangkat Anda sendiri. Data gaji, daftar harga, dan data pelanggan tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Spreadsheet berat jarang penuh data</h2>
      <p>Inilah bedanya <strong>kompres excel</strong> dengan mengompres file Office lainnya. Di Word atau PowerPoint, beratnya ada di gambar. Di spreadsheet, hampir selalu ada di sel kosong.</p>
      <p>Mekanismenya sederhana dan jarang diketahui: ketika seseorang memilih seluruh kolom lalu memberi warna, garis tepi, atau format angka, Excel menganggap semua sel di kolom itu berformat — lebih dari sejuta — dan menyimpan masing-masing ke file. Dengan cara itu, workbook berisi 200 baris data nyata bisa mencapai 15 MB.</p>

      <h2>Kompres excel ke ukuran kecil — apa yang dibuang</h2>
      <p>Pembersihan memotong area terpakai kembali ke tempat data Anda benar-benar berakhir, dan mengodekan ulang gambar yang disimpan lebih besar dari tampilannya. Nilai, rumus, dan format sel yang berisi tetap utuh. Hasilnya tetap file Excel — <strong>kompres excel ke excel</strong>, bukan konversi. Untuk batas tertentu seperti <strong>kompres excel 10 mb</strong> atau <strong>kompres excel 2 mb</strong>, isi ukuran target.</p>
      <p>Operasi ini tidak sepenuhnya tanpa perubahan, dan halaman ini membuat pilihannya terlihat, bukan menyembunyikannya. Jika file Anda adalah template yang menunggu diisi, matikan opsi pembuangan sel kosong.</p>

      <h2>Angka Anda tidak keluar dari perangkat</h2>
      <p>Spreadsheet menyimpan bagian paling sensitif dari sebuah usaha. Di sini pembacaan dan penulisan ulang terjadi di dalam browser, dan tidak ada yang disalin ke server.</p>
    `
  },
  {
    en: 'compress-word',
    slug: 'kompres-word',
    name: 'Kompres Word',
    title: 'Kompres Word Online Gratis — Perkecil File DOCX | ConvertOcean',
    description: 'Kompres file Word (.docx) langsung di browser dengan mengompres ulang hanya gambar yang terlalu besar. Teks dan format tetap utuh. Tanpa upload.',
    headline: 'Kompres Word.',
    subtitle: 'Perkecil file .docx dengan mengompres ulang hanya gambar yang disimpan lebih besar dari tampilannya di halaman — teks, gaya, dan tabel tetap sama.',
    quickAnswer: 'Untuk kompres Word, seret file .docx ke alat di atas dan ukurannya langsung berkurang. File .docx adalah arsip ZIP, dan ketika terlalu besar penyebabnya hampir selalu gambar: tangkapan layar dari monitor resolusi tinggi bisa selebar 3.840 piksel dan beberapa megabyte, padahal tampil lima belas sentimeter di halaman. Teks, gaya, tabel, dan track changes tetap persis seperti semula.',
    category: 'Alat Dokumen',
    faqs: [
      {
        question: 'cara kompres file word',
        answer: 'Seret file .docx ke alat di bagian atas halaman dan ukurannya langsung berkurang. Jika harus mencapai ukuran tertentu — misalnya 1 MB, 2 MB, atau 10 MB — pakai opsi tentukan ukuran, dan alat mencari pengaturan paling ringan yang masih di bawah batas itu.'
      },
      {
        question: 'cara kompres foto di word',
        answer: 'Word punya fitur sendiri — pilih gambar, buka Picture Format, lalu Compress Pictures. Masalahnya fitur itu harus dijalankan manual dan mudah lupa diterapkan ke semua gambar. Alat ini melakukannya otomatis di seluruh dokumen: mencari gambar yang disimpan lebih besar dari tampilannya di halaman, lalu mengodekannya ulang ke ukuran yang berguna.'
      },
      {
        question: 'cara kompres file word di hp',
        answer: 'Buka halaman ini di browser HP, ketuk area pilih file, dan ambil .docx dari file manager atau unduhan. File diproses di HP Anda tanpa instal aplikasi.'
      },
      {
        question: 'Apakah teks atau formatnya berubah?',
        answer: 'Tidak. Teks, gaya, tabel, header, dan track changes tetap persis seperti semula — hanya gambar yang dikodekan ulang. Dokumen tetap bisa diedit di Word seperti biasa, dan tidak ada konversi format.'
      },
      {
        question: 'Bagaimana kalau maksud saya mengubah Word ke PDF yang kecil?',
        answer: 'Banyak yang mencari "kompres word ke pdf" maksudnya mengubah Word menjadi PDF di bawah batas ukuran. Untuk itu gunakan <a href="/id/word-ke-pdf/">Word ke PDF</a>, lalu jika hasilnya masih besar, <a href="/id/kompres-pdf/">Kompres PDF</a> dengan ukuran target. Halaman ini memperkecil file yang tetap berformat Word.'
      },
      {
        question: 'Apakah dokumen saya dikirim ke server?',
        answer: 'Tidak. Kompresi terjadi di dalam browser Anda, di perangkat Anda sendiri, dan file tidak disalin ke server mana pun. Skripsi, kontrak, dan dokumen internal tetap bersama Anda.'
      }
    ],
    content: `
      <h2>Kenapa file .docx bisa sangat besar</h2>
      <p>Yang mencari cara <strong>kompres word</strong> hampir selalu punya masalah sama: dokumen beberapa halaman yang beratnya puluhan megabyte dan tidak lolos batas lampiran email atau batas unggah tugas. Penyebabnya jarang teks — teks sangat kecil. Penyebabnya gambar.</p>
      <p>Tangkapan layar dari monitor modern lebarnya hampir 4.000 piksel. Ditempel ke dokumen dan diperkecil tampilannya jadi lima belas sentimeter, gambar itu tetap tersimpan utuh: Word menyimpan gambar asli dan hanya menampilkannya lebih kecil. Kalikan dengan selusin tangkapan layar, dan ukurannya membengkak.</p>

      <h2>Kompres word 1 mb, 2 mb, atau 10 mb</h2>
      <p>Alat ini mencari gambar-gambar itu — yang disimpan lebih besar dari yang pernah ditampilkan halaman — dan mengodekannya ulang ke ukuran yang berguna. Teks, gaya, tabel, dan track changes tidak disentuh. Untuk <strong>kompres word 1 mb</strong>, <strong>kompres word 10 mb</strong>, atau batas lain, isi targetnya dan biarkan alat menemukan pengaturan paling ringan yang muat. Hasilnya tetap file Word — <strong>kompres word ke word</strong>.</p>

      <h2>Dimasukkan ke ZIP tidak membantu</h2>
      <p>File .docx di dalamnya sudah berupa arsip ZIP. Mengompresnya lagi ke ZIP lain hampir tidak mengurangi apa pun, karena isinya sudah terkompres. Penghematan hanya datang dari mengolah isinya.</p>

      <h2>Diproses di perangkat Anda</h2>
      <p>Semua terjadi di browser, di perangkat Anda sendiri, dan dokumen tidak disalin ke server mana pun.</p>
    `
  },
  {
    en: 'merge-pdf',
    slug: 'gabungkan-pdf',
    name: 'Gabungkan PDF',
    title: 'Gabungkan PDF Online Gratis — Jadi Satu File | ConvertOcean',
    description: 'Gabungkan PDF jadi satu file langsung di browser, sesuai urutan yang Anda pilih. Tanpa upload: tidak ada dokumen yang keluar dari perangkat Anda.',
    headline: 'Gabungkan PDF.',
    subtitle: 'Satukan beberapa dokumen menjadi satu PDF, sesuai urutan yang Anda pilih — tanpa ada yang keluar dari perangkat Anda.',
    quickAnswer: 'Untuk gabungkan PDF jadi satu, tambahkan file ke alat di atas sesuai urutan kemunculannya, lalu unduh dokumen tunggalnya. Semuanya disusun di dalam browser, tanpa file keluar dari perangkat Anda. Ini cara biasa untuk menyatukan KTP, KK, ijazah, dan transkrip menjadi satu lampiran ketika portal hanya menerima satu file.',
    category: 'Alat PDF',
    faqs: [
      {
        question: 'cara gabungkan pdf',
        answer: 'Tambahkan file ke alat di bagian atas halaman sesuai urutan yang diinginkan. Urutan daftar di layar adalah urutan halaman di file akhir; jika ada yang salah tempat, hapus dengan tombol ✕ lalu tambahkan lagi — file itu masuk ke akhir daftar. Setelah urutannya benar, unduh PDF tunggalnya. Tanpa daftar akun, tanpa watermark, tanpa batas jumlah file.'
      },
      {
        question: 'cara gabungkan file pdf',
        answer: 'Alat ini menerima file PDF hingga 25 MB per file. Tidak ada batas jumlah file maupun halaman; karena prosesnya lokal, yang membatasi adalah memori perangkat Anda. Di komputer biasa, puluhan dokumen bisa digabung tanpa masalah.'
      },
      {
        question: 'cara gabungkan pdf jadi satu',
        answer: 'Hasilnya satu file, dengan halaman sesuai urutan di layar dan nomor halaman berurutan dari awal sampai akhir. Isi setiap dokumen asli dipertahankan — teks tetap bisa dipilih, dan tidak ada kompresi ulang. Yang tidak ikut adalah bookmark dan kolom formulir dari file asal; tautan web tetap berfungsi.'
      },
      {
        question: 'cara gabungkan 2 pdf',
        answer: 'Caranya sama untuk berapa pun jumlahnya: tambahkan kedua file sesuai urutan, periksa daftarnya, lalu unduh. Daftar tidak bisa digeser-geser; jika satu file salah tempat, hapus dengan ✕ dan tambahkan lagi agar masuk ke akhir.'
      },
      {
        question: 'Bagaimana menggabungkan PDF dengan foto atau JPG?',
        answer: 'Foto bukan PDF, jadi ada satu langkah sebelumnya: ubah foto dengan <a href="/id/gambar-ke-pdf/">Gambar ke PDF</a>, yang menghasilkan PDF berisi satu foto per halaman, lalu gabungkan file itu dengan dokumen lain di sini. Alat ini menerima PDF saja.'
      },
      {
        question: 'Apakah PDF gabungan jadi lebih kecil?',
        answer: 'Tidak. Menggabungkan tidak memperkecil ukuran: PDF akhir kira-kira sebesar jumlah file aslinya. Jika portal punya batas ukuran, jalankan hasilnya lewat <a href="/id/kompres-pdf/">Kompres PDF</a> dan pakai "Tentukan ukuran" untuk mencapai batasnya.'
      },
      {
        question: 'Apakah isi dokumen saya terlihat oleh kalian?',
        answer: 'Tidak. Penggabungan terjadi di browser Anda dan file tidak disalin ke server mana pun. Dokumen berisi data pribadi — KTP, KK, NPWP, slip gaji — tetap di perangkat Anda dari awal sampai akhir.'
      }
    ],
    content: `
      <h2>Gabungkan PDF jadi 1 file untuk portal pendaftaran</h2>
      <p>Banyak portal hanya menerima satu lampiran, sementara dokumen Anda terpisah-pisah: KTP, KK, ijazah, transkrip, surat pernyataan. <strong>Gabungkan pdf online</strong> di sini menyatukan semuanya menjadi satu file — <strong>gabungkan pdf jadi satu</strong>, dengan urutan yang Anda tentukan.</p>
      <p>Tanpa daftar akun, tanpa watermark, tanpa batas harian, dan gratis sepenuhnya.</p>

      <h2>Urutan ditentukan sebelum, bukan sesudah</h2>
      <p>Halaman masuk persis sesuai urutan file di layar, dan di dalam setiap file urutan aslinya dipertahankan. Tambahkan file satu per satu jika urutannya penting — setiap file baru masuk ke akhir daftar. Periksa sebelum mengunduh: setelah digabung, mengubah urutan berarti mengulang dari awal. Untuk dokumen seleksi, susun sesuai urutan yang diminta panitia.</p>

      <h2>Foto butuh satu langkah tambahan</h2>
      <p>Pencarian <strong>gabungkan pdf dan jpg</strong> atau <strong>gabungkan pdf dan foto</strong> sering muncul, dan jawabannya: foto bukan PDF. Ubah dulu dengan <a href="/id/gambar-ke-pdf/">Gambar ke PDF</a> — satu foto per halaman — lalu <strong>gabungkan pdf dan pdf</strong> hasilnya di sini.</p>

      <h2>Menggabungkan tidak mengompres</h2>
      <p>File akhir kira-kira sebesar jumlah file aslinya. Jika ada batas ukuran, gabungkan dulu, lalu jalankan hasilnya lewat <a href="/id/kompres-pdf/">Kompres PDF</a> dengan ukuran target.</p>

      <h2>Dokumen tidak keluar dari perangkat Anda</h2>
      <p>Penggabungan dilakukan oleh browser Anda sendiri. Dokumen pribadi tidak disalin ke server mana pun — dan kode situs ini terbuka, jadi klaim ini bisa diperiksa, bukan sekadar dipercaya.</p>
    `
  },
  {
    en: 'split-pdf',
    slug: 'pisahkan-pdf',
    name: 'Pisahkan PDF',
    title: 'Pisahkan PDF Online Gratis — Per Halaman | ConvertOcean',
    description: 'Pisahkan PDF per halaman, ambil halaman tertentu, atau bagi menjadi beberapa bagian langsung di browser. File tidak keluar dari perangkat Anda.',
    headline: 'Pisahkan PDF.',
    subtitle: 'Ambil halaman yang Anda perlukan, pisahkan setiap halaman, bagi menjadi bagian sama besar, atau batasi tiap bagian dengan ukuran — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk pisahkan PDF, pilih file di alat di atas lalu tentukan hasilnya: satu PDF berisi halaman yang Anda pilih, file terpisah untuk setiap halaman (dalam ZIP), seluruh dokumen dibagi menjadi beberapa bagian sama besar, atau bagian-bagian di bawah ukuran tertentu dalam MB. Thumbnail memudahkan memilih halaman dengan sekali klik. Semua terjadi di browser Anda dan file tidak keluar dari perangkat.',
    category: 'Alat PDF',
    faqs: [
      {
        question: 'cara pisahkan pdf',
        answer: 'Seret PDF ke alat di bagian atas halaman, lalu pilih salah satu dari empat hasil: satu PDF berisi halaman yang ditandai; file terpisah untuk setiap halaman, dikirim dalam ZIP; dokumen dibagi menjadi sejumlah bagian sama besar; atau bagian-bagian yang tidak melebihi batas MB yang Anda tentukan.'
      },
      {
        question: 'cara pisahkan halaman pdf',
        answer: 'Klik thumbnail halaman yang Anda inginkan, atau ketik nomornya seperti "1-5, 8". Halaman tidak harus berurutan: menandai halaman 1, 4, dan 9 menghasilkan satu PDF berisi ketiganya, dalam urutan dokumen asli. Cocok untuk mengambil halaman bertanda tangan dari kontrak panjang.'
      },
      {
        question: 'cara pisahkan pdf per halaman',
        answer: 'Pilih "PDF terpisah untuk setiap halaman". Setiap halaman yang dipilih menjadi file sendiri, dan semuanya dikirim bersama dalam satu ZIP — jadi Anda tidak perlu mengunduh satu per satu.'
      },
      {
        question: 'cara pisahkan pdf yang tergabung',
        answer: 'Ketika beberapa dokumen di-scan menjadi satu file — KTP, KK, dan ijazah berurutan — tandai halaman masing-masing dokumen lalu unduh terpisah, atau pakai opsi satu file per halaman lalu susun ulang yang diperlukan dengan <a href="/id/gabungkan-pdf/">Gabungkan PDF</a>.'
      },
      {
        question: 'cara pisahkan file pdf',
        answer: 'Jika tujuannya agar setiap bagian muat di batas ukuran portal, pilih "Seluruh PDF dalam bagian di bawah" lalu isi batasnya dalam MB: alat menghitung di mana harus memotong. File asli tidak diubah — alat ini selalu membuat dokumen baru.'
      },
      {
        question: 'Apakah alat ini bisa membuka PDF yang dikunci kata sandi?',
        answer: 'Tidak. Alat ini membagi dokumen menjadi bagian atau halaman; tidak menghapus kata sandi. Perlindungan PDF ada karena suatu alasan, dan situs yang dibangun di atas privasi dokumen Anda tidak masuk akal jika menawarkan sebaliknya.'
      },
      {
        question: 'Apakah dokumen saya dikirim ke server?',
        answer: 'Tidak. Pemisahan dilakukan oleh browser Anda, di perangkat Anda sendiri. Kontrak dan dokumen pribadi — persis jenis file yang paling sering perlu dipisah — tidak disalin ke server mana pun.'
      }
    ],
    content: `
      <h2>Empat cara pisahkan PDF, Anda yang memilih</h2>
      <p>Alat ini tidak memaksakan satu cara. Anda bisa mengambil halaman yang ditandai di thumbnail; membuat satu file per halaman dalam ZIP — <strong>pisahkan pdf per halaman</strong>; membagi dokumen menjadi beberapa bagian sama besar; atau — yang paling sulit ditemukan di tempat lain — membagi berdasarkan ukuran, dengan batas MB agar setiap bagian muat di portal.</p>
      <p>Gratis, tanpa daftar akun, tanpa batas harian: <strong>pisahkan pdf online</strong> dan <strong>pisahkan pdf gratis</strong> di sini berarti alat lengkapnya.</p>

      <h2>Halaman tidak harus berurutan</h2>
      <p>Saat memilih <strong>pisahkan pdf halaman</strong>, menandai 1, 4, dan 9 menghasilkan satu PDF berisi ketiganya, dalam urutan asli. Ini menyelesaikan kasus seperti mengambil surat kuasa dari dalam berkas atau memisahkan halaman bertanda tangan.</p>

      <h2>Memisahkan PDF yang tergabung</h2>
      <p>Hasil scan sering menjadikan semua dokumen satu file. Untuk <strong>pisahkan pdf yang tergabung</strong>, tandai halaman tiap dokumen dan unduh masing-masing, atau pecah per halaman lalu satukan kembali yang perlu dengan <a href="/id/gabungkan-pdf/">Gabungkan PDF</a>. Jika file masih terlalu besar, lanjutkan ke <a href="/id/kompres-pdf/">Kompres PDF</a>.</p>

      <h2>Dokumen tidak keluar dari perangkat Anda</h2>
      <p>Pemisahan terjadi di browser, di perangkat Anda sendiri. Kontrak, berkas, dan dokumen pribadi tidak disalin ke server mana pun.</p>
    `
  },
  {
    en: 'image-to-text',
    slug: 'gambar-ke-teks',
    name: 'Gambar ke Teks',
    title: 'Gambar ke Teks Online Gratis — OCR Tanpa Upload | ConvertOcean',
    description: 'Ubah gambar ke teks dengan OCR langsung di browser: foto, tangkapan layar, dan hasil scan menjadi teks yang bisa disalin. Gambar tidak keluar dari perangkat.',
    headline: 'Gambar ke Teks.',
    subtitle: 'Ambil teks dari foto, tangkapan layar, dan dokumen hasil scan — pengenalan teks berjalan di perangkat Anda sendiri.',
    quickAnswer: 'Untuk mengubah gambar ke teks, pilih file JPG, PNG, atau WebP di alat di atas: mesin OCR mengenali teks tercetak dan menghasilkan teks yang bisa diedit dan disalin, di dalam browser Anda. Gambar yang tajam dan beresolusi baik dengan teks tercetak memberi hasil paling akurat; tulisan tangan jauh kurang andal. Tidak ada gambar yang keluar dari perangkat Anda.',
    category: 'Alat Gambar',
    faqs: [
      {
        question: 'cara mengubah gambar ke teks',
        answer: 'Pilih foto atau tangkapan layar di alat di atas dan tunggu pengenalan selesai — teks muncul siap disalin, diedit, atau diunduh sebagai .txt. Penggunaan pertama mengunduh mesin pengenalan dan data bahasanya, jadi butuh beberapa saat; setelah itu prosesnya memakai prosesor perangkat Anda sendiri. Tanpa aplikasi, dan gambar tidak dikirim ke mana pun.'
      },
      {
        question: 'cara menyalin teks dari gambar ke word',
        answer: 'Word tidak bisa membaca teks dari gambar yang ditempel — gambar tetap gambar. Caranya: ambil teksnya di sini, klik Salin, lalu tempel ke Word, sebaiknya dengan "Keep Text Only", karena format visual gambar tidak dibangun ulang. Setelah itu terapkan gaya di Word.'
      },
      {
        question: 'cara mengubah gambar teks ke word',
        answer: 'Hasilnya sudah berupa teks yang bisa diedit, bukan gambar: bisa disalin, diperbaiki, ditempel ke Word, dan dicari isinya. Yang tidak ikut kembali adalah tampilan visualnya — huruf tebal, jenis font, kolom, dan tabel tidak terbaca oleh OCR. OCR mengembalikan kata-katanya, bukan desain halamannya.'
      },
      {
        question: 'Seberapa akurat hasilnya?',
        answer: 'Akurasi hampir sepenuhnya ditentukan oleh gambar asalnya. Teks tercetak yang tajam, lurus, dan kontras dikenali dengan sangat baik. Yang mengganggu: foto goyang, cahaya tidak rata, bayangan di atas kertas, teks terlalu kecil, atau difoto miring. Jika hasilnya buruk, foto ulang halamannya dari depan dengan cahaya cukup — biasanya lebih cepat daripada memperbaiki teksnya.'
      },
      {
        question: 'Apakah bisa membaca tulisan tangan?',
        answer: 'Jauh kurang andal. Huruf cetak tulisan tangan hasilnya lumayan; tulisan sambung biasanya penuh kesalahan. Untuk tulisan tangan, siapkan waktu untuk memeriksa hasilnya secara manual.'
      },
      {
        question: 'Apakah gambar saya dikirim ke server?',
        answer: 'Tidak. Pengenalan teks terjadi di memori browser Anda, di perangkat Anda sendiri. Ini sangat penting di sini: gambar yang diproses OCR biasanya dokumen, struk, kontrak, dan kwitansi — dan foto masih membawa metadata seperti lokasi dan model HP.'
      }
    ],
    content: `
      <h2>Apa yang dilakukan OCR — dan apa yang tidak</h2>
      <p>Untuk mengubah <strong>gambar ke teks</strong>, alat ini harus membaca huruf yang tergambar di piksel. Mesin pengenalan karakter optis (OCR) memeriksa piksel, mengenali bentuk huruf, dan mengembalikan karakternya — itulah yang memungkinkan <strong>salin gambar ke teks</strong> tanpa mengetik ulang. Alat ini menjalankan Tesseract, mesin OCR sumber terbuka, langsung di browser Anda.</p>
      <p>Yang dikembalikan adalah kata-katanya. <strong>Konversi gambar ke teks</strong> tidak membangun ulang huruf tebal, jenis font, kolom, atau tabel — informasi visual itu tidak terbaca, dan hasilnya teks polos yang siap diedit.</p>

      <h2>Kualitas foto menentukan hasil</h2>
      <p>Inilah faktor terbesar, jauh di atas pengaturan apa pun. Saat <strong>scan gambar ke teks</strong>, teks tercetak yang tajam, menghadap lurus, dan kontras dikenali dengan akurasi tinggi. Foto goyang, bayangan melintasi halaman, teks kecil, atau foto miring menurunkan akurasi dengan cepat.</p>

      <h2>Tanpa aplikasi, tanpa instalasi, tanpa server</h2>
      <p>Alat <strong>gambar ke teks gratis</strong> yang berjalan di browser tidak perlu dipasang di HP maupun komputer. Dan yang terpenting, gambar tidak perlu dikirim ke mana pun: pengenalan terjadi di perangkat Anda. Struk, kontrak, dan dokumen hasil scan tidak disalin ke server mana pun.</p>
    `
  },
  {
    en: 'pdf-to-word',
    slug: 'pdf-ke-word',
    name: 'PDF ke Word',
    title: 'Ubah PDF ke Word Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Konversi PDF ke Word (.docx) yang bisa diedit langsung di browser, tanpa daftar dan tanpa watermark. File tidak keluar dari perangkat Anda.',
    headline: 'PDF ke Word.',
    subtitle: 'Ubah PDF menjadi dokumen Word yang bisa diedit — judul, tabel, dan gambar dibangun ulang, tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah PDF ke Word, pilih file di alat di atas lalu unduh dokumen .docx yang bisa diedit. Judul, huruf tebal, miring, ukuran huruf, indentasi, dan tabel yang terdeteksi dibangun ulang sebagai format asli Word, dan gambar serta logo masuk sebagai gambar. Semuanya terjadi di dalam browser Anda: file tidak keluar dari perangkat dan tidak disalin ke server mana pun.',
    category: 'Alat Dokumen',
    faqs: [
      {
        question: 'cara mengubah pdf ke word',
        answer: 'Seret PDF ke alat di bagian atas halaman, tunggu konversi selesai, lalu unduh file .docx-nya. Tanpa daftar akun, tanpa antrean, tanpa batas harian. Dokumen terbuka normal di Word, LibreOffice, dan Google Docs, langsung bisa diedit.'
      },
      {
        question: 'cara mengubah pdf ke word di laptop',
        answer: 'Buka halaman ini di browser laptop — Chrome, Edge, atau Firefox — seret PDF ke alat, lalu unduh .docx-nya. Tidak ada program yang perlu dipasang, dan tidak perlu Microsoft Word untuk melakukan konversinya.'
      },
      {
        question: 'cara mengubah file pdf ke word',
        answer: 'Sebelum konversi, lakukan tes sepuluh detik: buka PDF dan coba pilih satu kalimat dengan kursor. Jika teksnya tersorot, PDF itu digital dan bisa dibangun ulang. Jika kursor hanya menggambar kotak, halamannya adalah gambar hasil scan — alat ini akan memberi tahu hal itu dan mengarahkan Anda ke <a href="/id/gambar-ke-teks/">Gambar ke Teks (OCR)</a>.'
      },
      {
        question: 'cara convert pdf ke word',
        answer: 'Yang dibangun ulang sebagai format Word sungguhan: judul, huruf tebal, miring, ukuran huruf, indentasi paragraf, dan tabel. Yang bisa bergeser: PDF menyimpan posisi tetap sedangkan Word memakai teks yang mengalir, jadi margin dan pergantian baris bisa sedikit bergeser pada tata letak berkolom. Dokumen berisi teks biasa hasilnya hampir sama persis.'
      },
      {
        question: 'Bagaimana dengan tabel dan gambar?',
        answer: 'Tabel dikenali dari kolom-kolom ruang kosong yang sejajar di beberapa baris, dan ditulis sebagai tabel Word sungguhan. Jika buktinya lemah, alat memakai tab stop — itulah sebabnya tabel dengan jarak tidak rata bisa muncul sebagai teks rata tab. Diagram, grafik, dan logo dimasukkan sebagai gambar: bisa dipindah dan diubah ukurannya, tetapi isi grafiknya tidak bisa diedit.'
      },
      {
        question: 'Apakah benar-benar gratis?',
        answer: 'Ya, tanpa syarat: tanpa daftar akun, tanpa watermark di dokumen, tanpa batas jumlah file per hari, dan tanpa versi berbayar yang menyembunyikan fitur. Kode situs ini terbuka, dan repositori publiknya menunjukkan persis apa yang dijalankan browser.'
      },
      {
        question: 'Apakah PDF saya dikirim ke server?',
        answer: 'Tidak. Konversi berjalan sepenuhnya di perangkat Anda, di memori browser. PDF tidak disalin ke server kami atau pihak ketiga, dan kami tidak bisa membacanya — penting ketika dokumennya kontrak, slip gaji, atau hasil pemeriksaan medis.'
      }
    ],
    content: `
      <h2>Ubah PDF ke Word tanpa merusak format</h2>
      <p>Banyak orang mencari cara <strong>ubah pdf ke word</strong> yang tidak merusak tata letak karena alasan sederhana: kedua format menggambarkan halaman dengan cara yang berlawanan. PDF menempatkan setiap huruf di koordinat tetap, seperti gambar. Word memakai teks yang mengalir dan menyesuaikan diri dengan margin dan ukuran halaman. <strong>Konversi pdf ke word</strong> berarti menerjemahkan di antara dua model itu.</p>
      <p>Alat ini membaca PDF dengan pdf.js — mesin PDF dari Mozilla, yang juga dipakai Firefox — dan membangun ulang judul, huruf tebal, miring, ukuran huruf, indentasi, dan tabel sebagai format asli Word, bukan menumpuk teks dalam satu kotak. Gambar dan logo masuk sebagai gambar di posisi aslinya.</p>

      <h2>PDF digital dan PDF hasil scan tidak sama</h2>
      <p>Inilah pemeriksaan yang mencegah sebagian besar kekecewaan saat <strong>convert pdf ke word</strong>. Buka file dan coba pilih satu kalimat. Jika tersorot, hurufnya benar-benar ada dan konversi berhasil. Jika kursor hanya menggambar kotak, halamannya adalah foto: bagi file itu, "teks"-nya hanyalah piksel. Dokumen hasil scan butuh OCR terlebih dulu, dan hasilnya mengembalikan kata-kata, bukan desainnya.</p>

      <h2>Kompres pdf ke word</h2>
      <p>Pencarian <strong>kompres pdf ke word</strong> biasanya berarti hal yang sama: mengubah PDF menjadi Word. Itulah yang dilakukan halaman ini. Jika yang Anda perlukan justru PDF yang lebih kecil, gunakan <a href="/id/kompres-pdf/">Kompres PDF</a>.</p>

      <h2>Kenapa konversi terjadi di browser Anda</h2>
      <p>Sebagian besar konverter online menyalin dokumen Anda ke server, mengonversinya di sana, lalu mengembalikan hasilnya. Di sini langkah itu tidak ada: <strong>pdf ke word gratis</strong> dan <strong>pdf ke word online</strong> yang diproses di memori browser Anda sendiri, tanpa file keluar dari perangkat.</p>
    `
  },
  {
    en: 'word-to-pdf',
    slug: 'word-ke-pdf',
    name: 'Word ke PDF',
    title: 'Ubah Word ke PDF Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Konversi Word (.docx) ke PDF langsung di browser, dengan teks yang bisa dipilih dan tanpa watermark. File tidak keluar dari perangkat Anda.',
    headline: 'Word ke PDF.',
    subtitle: 'Ubah dokumen .docx menjadi PDF dengan teks yang bisa dipilih dan pergantian halaman yang rapi — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah Word ke PDF, seret file .docx ke alat di atas lalu unduh PDF-nya. Judul, huruf tebal, miring, daftar, dan tabel dipertahankan, dan hasilnya PDF vektor sungguhan: teks tetap bisa dipilih dan dicari, dan halaman berganti tanpa memotong baris di tengah. Konversi berjalan di browser Anda dan file tidak keluar dari perangkat.',
    category: 'Alat Dokumen',
    faqs: [
      {
        question: 'cara mengubah word ke pdf',
        answer: 'Seret file .docx ke alat di bagian atas halaman, lalu unduh PDF-nya. Tidak perlu memasang apa pun atau membuat akun, dan PDF tanpa watermark. Hasilnya terbuka di pembaca PDF mana pun, termasuk di HP.'
      },
      {
        question: 'cara ubah word ke pdf',
        answer: 'PDF yang dihasilkan berupa vektor, bukan gambar halaman: teks tetap bisa dipilih, dicari, dan tajam di zoom berapa pun. Ini penting ketika dokumen akan dibaca di layar, diproses sistem, atau dilampirkan ke portal yang meminta teks bisa dicari.'
      },
      {
        question: 'cara merubah word ke pdf',
        answer: 'Judul, huruf tebal, miring, daftar bernomor dan berbutir, serta tabel dipertahankan, dan pergantian halaman dihitung agar tidak memotong baris. Teks digambar dengan font pengganti yang disematkan di PDF — Roboto untuk font tanpa kait, Noto Serif untuk font berkait, dan Noto Mono untuk monospace — jadi pergantian baris bisa sedikit berbeda dari Word. Periksa halaman pertama sebelum mengirim dokumen.'
      },
      {
        question: 'Bagaimana kalau PDF-nya harus di bawah 500 KB atau 1 MB?',
        answer: 'Inilah maksud banyak pencarian "kompres word ke pdf": mengubah dokumen sekaligus memenuhi batas ukuran portal. Ubah Word ke PDF di sini; PDF dari dokumen teks biasanya sudah kecil. Jika masih di atas batas — biasanya karena foto di dalamnya — buka <a href="/id/kompres-pdf/">Kompres PDF</a> dan isi ukuran target, misalnya 500 KB.'
      },
      {
        question: 'Apa bedanya .doc dan .docx di sini?',
        answer: 'Alat ini bekerja dengan .docx, format Word sejak 2007. File .doc lama harus dibuka di Word atau LibreOffice lalu disimpan ulang sebagai .docx sebelum dikonversi. Itu keterbatasan format lama yang biner dan tertutup, bukan keterbatasan alatnya.'
      },
      {
        question: 'Apakah dokumen saya dikirim ke server?',
        answer: 'Tidak. Konversi terjadi di dalam browser, di perangkat Anda sendiri, dan file tidak disalin ke server mana pun. CV, surat lamaran, skripsi, dan kontrak tetap bersama Anda dari awal sampai akhir.'
      }
    ],
    content: `
      <h2>Ubah Word ke PDF dengan teks yang tetap bisa dipilih</h2>
      <p>Yang mencari cara <strong>ubah word ke pdf</strong> biasanya ingin dua hal: dokumen tampil sama di komputer mana pun, dan tidak bisa berubah tanpa sengaja. PDF menyelesaikan keduanya — tetapi hanya jika konversinya menghasilkan PDF sungguhan, bukan gambar setiap halaman.</p>
      <p>Itulah bedanya file yang bisa dicari dan disalin dengan file yang hanya foto dari teks Anda. Di sini hasil <strong>konversi word ke pdf</strong> selalu vektor: judul, huruf tebal, miring, daftar, dan tabel tetap elemen nyata, dengan teks yang bisa dipilih.</p>

      <h2>Kompres word ke pdf untuk batas ukuran portal</h2>
      <p>Autocomplete Google untuk <strong>kompres word ke pdf</strong> berakhir dengan "500 kb", "200kb", dan "1 mb": orang perlu PDF yang muat di batas portal. Lakukan dalam dua langkah yang jujur — <strong>convert word ke pdf</strong> di sini, lalu jika masih terlalu besar, <a href="/id/kompres-pdf/">Kompres PDF</a> dengan ukuran target.</p>

      <h2>Saat font berubah — dan cara mencegahnya</h2>
      <p>Saat <strong>mengubah word ke pdf</strong>, font yang hanya terpasang di komputer Anda bisa diganti font setara, yang sedikit menggeser jarak. Dokumen dengan font umum Office jarang mengalami ini. Jika tata letak sangat penting — CV satu halaman, misalnya — periksa hasilnya sebelum mengirim.</p>

      <h2>Tanpa daftar, tanpa watermark, tanpa server</h2>
      <p><strong>Word ke pdf online</strong> di sini gratis, tidak meminta akun, dan tidak menulis watermark. Dan berbeda dari konverter online yang paling dikenal, dokumen Anda tidak disalin ke server: prosesnya dilakukan browser Anda sendiri.</p>
    `
  },
  {
    en: 'pdf-to-excel',
    slug: 'pdf-ke-excel',
    name: 'PDF ke Excel',
    title: 'Ubah PDF ke Excel Online Gratis — Tanpa Upload | ConvertOcean',
    description: 'Konversi tabel PDF ke spreadsheet Excel (.xlsx) langsung di browser, dengan baris dan kolom yang sejajar. File tidak keluar dari perangkat Anda.',
    headline: 'PDF ke Excel.',
    subtitle: 'Ambil tabel dari PDF ke spreadsheet dengan baris dan kolom yang sejajar — tanpa file keluar dari perangkat Anda.',
    quickAnswer: 'Untuk mengubah PDF ke Excel, pilih file di alat di atas lalu unduh spreadsheet .xlsx. Tabel dibangun ulang sel demi sel: nilai yang lebih dari satu kata tetap utuh dan semua baris disejajarkan ke kolom yang sama, bukan setiap potongan teks di sel sendiri. PDF digital paling baik; PDF hasil scan perlu OCR terlebih dulu. Semuanya berjalan di browser Anda dan file tidak keluar dari perangkat.',
    category: 'Konverter Excel',
    faqs: [
      {
        question: 'cara mengubah pdf ke excel',
        answer: 'Seret PDF ke alat di bagian atas halaman lalu unduh file .xlsx-nya. Setiap tabel yang terdeteksi menjadi baris dan kolom di spreadsheet, siap diurutkan, difilter, dan dipakai dalam rumus. Tanpa daftar akun dan tanpa instalasi.'
      },
      {
        question: 'cara convert pdf ke excel',
        answer: 'Sebelum konversi, pastikan PDF-nya digital: buka file dan coba pilih satu kalimat. Jika tersorot, konversi berhasil. Jika kursor hanya menggambar kotak, halamannya gambar hasil scan dan tidak ada teks yang bisa diambil — alat akan memberi tahu dan mengarahkan ke <a href="/id/gambar-ke-teks/">Gambar ke Teks (OCR)</a>.'
      },
      {
        question: 'cara merubah pdf ke excel',
        answer: 'Konversi mempertahankan struktur tabel, bukan tampilannya. Garis, warna latar, dan font PDF tidak ikut — yang kembali adalah nilainya, di posisi baris dan kolom yang benar. Itulah yang membuat angkanya bisa dipakai menghitung, bukan sekadar dilihat.'
      },
      {
        question: 'cara ubah pdf ke excel',
        answer: 'Alat ini memakai posisi setiap potongan teks di halaman, bukan garis tabel, jadi tabel dengan kolom yang berjarak jelas hasilnya paling baik. Sel berisi teks beberapa baris, laporan dengan beberapa tabel di satu halaman, dan sel yang digabung lebih sulit dibaca dan bisa perlu dirapikan manual. Periksa totalnya sebelum memakai datanya.'
      },
      {
        question: 'cara merubah file pdf ke excel',
        answer: 'Nilai yang lebih dari satu kata tetap utuh di satu sel — "Pendapatan kotor kumulatif" tidak dipecah menjadi tiga sel. Inilah kesalahan paling umum konverter yang menganggap setiap potongan teks sebagai kolom sendiri, dan biasanya membuat spreadsheet hasilnya tidak terpakai.'
      },
      {
        question: 'Apakah PDF saya dikirim ke server?',
        answer: 'Tidak. Konversi terjadi sepenuhnya di browser Anda dan PDF tidak disalin ke server mana pun. Ini sangat penting di sini: rekening koran, laporan keuangan, dan daftar pelanggan adalah PDF yang paling sering ingin dijadikan spreadsheet.'
      }
    ],
    content: `
      <h2>Ubah PDF ke Excel tanpa kehilangan kesejajaran kolom</h2>
      <p>Masalah hampir semua alat <strong>konversi pdf ke excel</strong> adalah PDF tidak menyimpan tabel. Yang disimpan adalah huruf di koordinat tertentu. Kisi yang Anda lihat hanya kesan visual: bagi file itu, tidak ada baris maupun kolom. Mengubah <strong>pdf ke excel</strong> berarti menyimpulkan struktur itu dari posisi teks.</p>
      <p>Karena itulah banyak konversi mengembalikan semuanya dalam satu kolom, atau memecah satu nilai menjadi tiga sel. Di sini tabel dibangun ulang sel demi sel: nilai beberapa kata tetap utuh dan semua baris disejajarkan ke kolom yang sama.</p>

      <h2>PDF mana yang berhasil</h2>
      <p>PDF yang dibuat secara digital — diekspor dari Excel, aplikasi akuntansi, atau internet banking — paling cocok untuk <strong>convert pdf ke excel</strong>, karena hurufnya benar-benar ada. PDF hasil scan adalah foto halaman: tidak ada teks yang bisa diambil, dan jalannya lewat OCR dulu. Tesnya sepuluh detik: coba pilih satu kalimat di file.</p>

      <h2>Kompres pdf ke excel</h2>
      <p>Pencarian <strong>kompres pdf ke excel</strong> berarti mengubah PDF menjadi Excel — itulah halaman ini. Untuk arah sebaliknya, gunakan <a href="/id/excel-ke-pdf/">Excel ke PDF</a>.</p>

      <h2>Rekening koran dan laporan tidak perlu keluar dari perangkat</h2>
      <p>PDF yang paling ingin dijadikan spreadsheet justru yang paling tidak boleh beredar: rekening koran, slip gaji, laporan penjualan. Alat ini memproses file di dalam browser, di perangkat Anda sendiri, dan dokumen tidak disalin ke server mana pun.</p>
    `
  }
];

export const idGuides: LocaleGuide[] = [];
export const idStaticPages: LocaleStaticPage[] = [];
