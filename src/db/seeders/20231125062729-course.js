/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      getAdminUserId,
      isTableHasRecords,
      getCategoryIdByName,
      generateRandomCourse
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course', queryInterface)) return;

    const userAdminId = await getAdminUserId();

    const courses = [
      {
        id: 'c63a172f-4eb1-44b2-8c90-66336b016d8f',
        name: 'Intro to Design System',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('UI/UX Design'),
        description: `Design system adalah kumpulan komponen design, code, ataupun dokumentasi yang dapat digunakan sebagai panduan utama yang memunginkan designer serta developer memiliki lebih banyak kontrol atas berbagai platform.

        Dengan hadirnya design system, dapat menjaga konsistensi tampilan user interface dan meningkatkan user experience menjadi lebih baik. Disisi bisnis, design system sangat berguna dalam menghemat waktu dan biaya ketika mengembangkan suatu produk.

        Bersama mentor terpercaya, kita akan mempelajari design system dari mulai manfaat, alur kerja pembuatannya, tools yang digunakan, hingga pada akhirnya, kita akan membuat MVP dari design system. Selain itu, mentor juga akan menjelaskan berbagai resource yang dibutuhkan untuk mencari inspirasi mengenai design system.
        
        Kelas ini sesuai untuk Anda yang ingin memahami apa itu design system. Tidak hanya ditujukan untuk UI/UX Designer ataupun Developer, kelas ini sangat sesuai untuk stakeholder lain agar dapat memudahkan tim dalam bekerja sama.

        Yuk segera daftar dan kami tunggu di kelas ya!`,
        intro_video: 'https://youtu.be/ixOd42SEUF0',
        target_audience: [
          'Anda yang ingin memahami poin penting design system',
          'Anda yang ingin latihan membangun design system',
          'Anda yang ingin mengembangkan Startup'
        ],
        onboarding_text:
          'Mari temukan esensi desain sistem dan bagaimana hal itu menciptakan konsistensi yang kuat dalam setiap elemen. Lalu, nikmati perjalanan visual yang membimbing Anda melalui palet warna yang dirancang dengan hati-hati, tipografi yang memukau, dan ikon-ikon yang memberi sentuhan unik pada setiap tata letak.'
      },
      {
        id: '5db0a017-6041-4d9a-8f44-5fca03d5378a',
        name: 'Product Management Fundamentals',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Product Management'),
        description: `Sebuah artikel berita baru-baru ini menyebut Manajer Produk sebagai peran terpenting ke-4 dalam perusahaan saat ini, menjadikan manajemen produk sebagai salah satu pekerjaan terpanas di pasar. Namun, kebanyakan orang tidak mengetahui apa yang sebenarnya dilakukan oleh Manajer Produk. 
          
          Apakah peran tersebut membutuhkan keterampilan teknis atau keterampilan bisnis? Dan apa yang dimaksud dengan peran yang menuntut empati yang tinggi terhadap pelanggan? Kursus e-learning dari Institute of Product Leadership ini adalah kursus dasar yang mengungkap peran tersebut.
          
          Dimulai dari dasar-dasar "Apa itu produk?", kurikulum kursus ini memperkenalkan siswa pada proses pembuatan produk dan keterampilan serta kerangka kerja seperti Analisis Pasar, Perencanaan Strategis, Perencanaan Produk, Masuk ke Pasar, dan Pemberdayaan Penjualan yang diperlukan untuk merancang, meluncurkan, dan memelihara produk.
          
          Siswa juga akan diperkenalkan dengan peran dan jenjang karier seorang Manajer Produk dan konteks bisnis, teknologi, dan pelanggan yang perlu dikuasai seseorang untuk menjadi Manajer Produk yang baik.
          
          Meskipun tidak diperlukan pengetahuan sebelumnya, apresiasi atau pengalaman langsung tentang bagaimana perusahaan produk dan layanan beroperasi akan sangat membantu.`,
        intro_video: 'https://youtu.be/HYfG_uCOlhc',
        target_audience: [
          'Anda yang ingin bekerja dalam peran Manajemen Produk',
          'Anda yang ingin memahami tentang Manajemen Produk',
          'Anda yang ingin menjadi seorang Profesional di Industri Jasa dan Produk'
        ],
        onboarding_text:
          'Anda akan memulai perjalanan menuju pemahaman yang mendalam tentang dasar-dasar manajemen produk. Dengan desain yang ramah pengguna dan panduan yang jelas, kami akan membimbing Anda melalui konsep-konsep kunci, praktik terbaik, dan alat yang diperlukan untuk menjadi seorang ahli dalam mengelola produk.'
      },
      {
        id: '0d7925a7-0c68-4c25-9c9a-c1f346bdc9fc',
        name: 'Web Development Microservice: Website Kelas Online',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development'),
        description: `Microservice adalah salah satu arsitektur pada Website Development yang digunakan oleh banyak Developer dan perusahaan IT dalam mengembangkan suatu Website. Tujuannya adalah agar Website tersebut lebih stabil dan mudah diperbaiki pada setiap service-nya jika adanya suatu bug pada service tersebut.
          
          Projek yang dibangun adalah website untuk belajar online (kelas digital) untuk siapa saja yang ingin upgrade skill dalam dunia IT atau juga self-improvement. Dimulai dari slicing design website dari Figma menggunakan React JavaScript Framework dan dibantu juga dengan Tailwind CSS.
          
          Setelah itu kita akan coba menggunakan API (per service) yang telah kita buat menggunakan Laravel dan Express JS. Jika kamu tertarik untuk belajar web development lebih dalam silakan bergabung di kelas ini dan kami akan mengarahkan dengan secara terstruktur dan rapih.
          
          Silakan bergabung dan kami tunggu di kelas. Kelas ini menggunakan tools NextJS versi 9.`,
        intro_video: 'https://youtu.be/6hIUgd6WuFw',
        target_audience: [
          'Cocok untuk yang ingin membangun website kelas online',
          'Cocok untuk yang ingin belajar menerapkan arsitektur microservice pada aplikasi',
          'Diperuntukkan bagi yang ingin menjadi fullstack developer pada bahasa pemrograman javascript'
        ],
        onboarding_text:
          'Ikuti proyek praktis yang dirancang khusus untuk memberi Anda pengalaman langsung dalam mengimplementasikan microservice. Dengan demikian, Anda dapat mengaplikasikan pengetahuan yang telah Anda pelajari secara langsung. Selamat mengeksplorasi dunia yang menarik dan dinamis dari pengembangan web dengan arsitektur microservice!'
      },
      {
        id: '14b3347c-bc8a-4cee-b2fd-b41764c3db10',
        name: 'Full-Stack Web Developer',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development'),
        description: `Penguasaan front end (user interface) dan back end (business logic) pada saat membangun website adalah hal utama bagi seorang Full Stack Web Developer. Bahkan, akan lebih baik jika didukung oleh skill UI/UX Design dan System Administration agar keseluruhan sistem web dapat berjalan dengan baik.
          
          Di kelas ini, mentor kami akan menjelaskan UX design, UI design, dan pengembangan web menggunakan Bootstrap dan Laravel secara terperinci. Kelas ini cocok bagi Anda yang sedang bingung menentukan spesialisasi karir di bidang teknologi. Banyak ilmu yang bisa didapatkan dan bisa menjadi bekal untuk menjadi developer yang handal. Kelas ini menggunakan tools Laravel 6 dan PHP ≥ 7.2.
          
          Setelah menyelesaikan kelas ini, Anda dapat lebih fokus memilih bidang sesuai dengan minat dan kemampuan. Segera daftar dan kami tunggu di kelas!`,
        intro_video: 'https://youtu.be/6hXoBeIQd-o',
        target_audience: [
          'Anda yang ingin mempelajari Prototype',
          'Anda yang ingin menguasai pengembangan web',
          'Anda yang ingin mempelajari backend Laravel'
        ],
        onboarding_text:
          'Nikmati navigasi yang ramah pengguna, video tutorial interaktif, dan sumber daya bermanfaat untuk memahami konsep fundamental, bahasa pemrograman, dan framework yang relevan dalam pengembangan web. Melalui langkah-langkah yang terstruktur, Anda akan belajar cara mengembangkan aplikasi web yang responsif, aman, dan dapat berskala.'
      },
      {
        id: 'f3102f7e-9916-4ff8-a50c-60048f7b634c',
        name: 'Flutter Developer: Provider State Management',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development'),
        description: `Pada pengembangan aplikasi, kita tidak akan terlepas dari proses penyimpanan data. Namun, dalam menjaga sebuah data agar dapat mudah digunakan kapan pun diperlukan proses dalam jangka waktu yang lama.
          
          Sejak 2019, Flutter SDK telah digunakan oleh banyak perusahaan besar dunia semisal Tencent, Alibaba Group dan BMW. Melalui Flutter, kita dapat mengakses library yang tersedia agar dapat mengelola data atau state pada aplikasi secara efektif.
          
          Pada kelas ini, kita akan belajar bagaimana mengimplementasikan State Management dengan menggunakan Provider agar state dapat tersimpan, maintainable dan mudah digunakan kembali di mana pun dan kapan pun saat dibutuhkan. Flutter memberikan kemudahan kepada para developer agar dapat dengan mudah mengelola state sesuai dengan keinginan mereka.
          
          Pada case study, kita akan membangun sebuah aplikasi pencarian kerja IT secara online dan mengelola datanya menggunakan State Management. Kelas ini sangat tepat untuk dipelajari bagi Anda yang ingin memperdalam ilmu mengenai State Management. Silahkan bergabung dan kami tunggu di kelas, ya!`,
        intro_video: 'https://youtu.be/eSrXU5vrgaI',
        target_audience: [
          'Anda yang ingin membangun aplikasi mobile menggunakan API',
          'Anda yang ingin memperdalam State Management Provider pada Flutter',
          'Anda yang ingin memiliki portfolio yang menjual'
        ],
        onboarding_text:
          'Dengan desain yang bersih dan interaktif, Anda akan dihadapkan pada tantangan pengkodean yang menarik, memperdalam pemahaman Anda tentang Provider dan bagaimana mengimplementasikannya dalam proyek Flutter Anda. Temukan manfaat dari manajemen status yang efisien, serta cara mengoptimalkan kinerja aplikasi Anda dengan baik.'
      },
      {
        id: 'b4863ea2-0fb8-46ca-97e7-ee8a817b7f70',
        name: 'Learn Flutter & Adobe XD: Build a Complete Mobile App',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development'),
        description: `Faktor pertama yang menjadi alasan pengguna menggunakan aplikasi e-commerce adalah tampilan antarmuka (UI) yang menarik. UI yang dirancang dengan baik dapat menanamkan kepercayaan pada produk yang ditawarkan, yang nantinya berpengaruh penting terhadap kelancaran bisnis produk tersebut. Kelas ini akan membahas proses pengembangan UI pada sisi Front-End secara lengkap, dari mendesain UI dengan Adobe XD sampai slicing desain ke Flutter.
          
          Melalui case study “E-Commerce Story”, Adobe XD digunakan untuk membangun komponen UI (icon, tipografi, gambar, warna, dll) menjadi sebuah aplikasi utuh. Dengan Adobe XD, kita bisa menghasilkan high quality design sekaligus prototype guna memeriksa apakah interaksi dan navigasi pilihan kita sudah dirasa sesuai untuk dipakai secara nyata.
          
          Setelah desain selesai dibuat, proses berlanjut pada tahapan slicing design asset ke Flutter SDK. Slicing dilakukan untuk menulis coding dalam satu basis kode dengan beragam Widget praktis seperti Scaffold, Drawer, hingga Navigator.
          
          Kelas ini cocok bagi Anda yang ingin mendalami desain aplikasi berskala besar. Bila menemukan kendala selama belajar, silakan berkonsultasi dengan para Mentor ahli kami di grup konsultasi. Segera daftar dan kami tunggu di kelas, ya!`,
        intro_video: 'https://youtu.be/JVJc4k6xjTM',
        target_audience: [
          'Anda yang ingin mempelajari proses Design to Code',
          'Anda yang ingin mempelajari Slicing UI ke Flutter',
          'Anda yang ingin memiliki portofolio yang menjual'
        ],
        onboarding_text:
          'Temukan keajaiban desain dengan Adobe XD, di mana Anda dapat merancang antarmuka pengguna yang menarik dan responsif tanpa batas. Lalu, beralihlah ke Flutter. Dengan gabungan kekuatan kedua platform ini, Anda akan mampu membangun aplikasi seluler yang tidak hanya estetis, tetapi juga berkinerja tinggi.'
      },
      {
        id: '65d6891c-8369-4241-bf8c-18ae3fc0939f',
        name: 'SwiftUI & iOS Engineer: The Complete App Development Bootcamp',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('IOS Development'),
        description: `Di era digital, berbagai perusahaan berlomba untuk mengembangkan situs web dan aplikasi yang user friendly dan responsif. Oleh karena itu, berbagai pekerjaan seputar design dan development sangat dibutuhkan saat ini. Jika kamu menyukai bagaimana melakukan slicing UI ke dalam UI/UX Development, profesi Junior UI/UX Developer atau yang lebih dikenal dengan UI Engineer akan menjadi profesi yang ideal untukmu.
          
          Melalui kelas ini, kamu akan berperan sebagai UI Engineer untuk melakukan slicing Food App design dari Figma menggunakan aplikasi Xcode, development tools untuk aplikasi berbasis iOS. Nantinya, mentor tidak hanya akan memberikan panduan untuk melakukan slicing, namun juga akan ada challange untuk kamu melakukan slicing sendiri. Namun jangan khawatir, di akhir kelas kamu bisa mencocokan bagiamana cara kamu dan mentor dalam melakukan slicing page tersebut.
          
          Silahkan bergabung untuk upgrade skill slicing kamu dan mendapatkan sertifikat resminya setelah kamu menyelesaikan kelas. Okay people with the spirit of learning semoga bermanfaat dan kami tunggu di kelas ya!`,
        intro_video: 'https://youtu.be/yk_p1bi6Oyw',
        target_audience: [
          'Anda yang ingin meningkatkan skill slicing User Interface',
          'Anda yang ingin mempelajari lebih dalam tools Xcode',
          'Anda yang ingin mempunyai real world project untuk portfolio'
        ],
        onboarding_text:
          'Menyambut peserta kursus ke dunia pengembangan aplikasi iOS dengan menggunakan teknologi terkini seperti SwiftUI. Halaman ini dirancang secara elegan dan responsif, memberikan gambaran singkat tentang kurikulum yang komprehensif dan menyeluruh.'
      },
      {
        id: 'bfd0ab17-01f8-4572-bc78-347c635ecf38',
        name: 'SQL for Beginners: Learn SQL using MySQL and Database Design',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Data Science'),
        description: `Charles Bachman menciptakan database agar data memiliki tampilan yang mudah dipahami dan tentunya dapat dikelola oleh banyak pengguna. Data yang tersusun rapi melalui Database Management System (DBMS), dapat memudahkan kebutuhan kita dalam pengembangan aplikasi. Dengan menguasai DBMS, kita dapat dengan mudah mencari atau mengubah data sesuai kebutuhan, mengolah big data, hingga mempercepat kinerja aplikasi secara efisien.
          
          Pada kelas ini, Mentor akan menjelaskan database management dengan MySQL. Kita akan mulai dengan pengenalan dasar-dasar database (data, DBMS, SQL) dan storage engine pada DBMS. Pada software MySQL, kita akan membangun database “Flying” dimulai dari menyiapkan tabel, mengatur field dan mengisi tipe data.
          
          Selain itu juga kita menggunakan TablePlus karena bahasa query lebih fleksibel dan hasil database mudah dipahami melalui tampilan yang user friendly. Kelas ini menggunakan tools XAMPP, Beekeeper Studio, Dbeaver, Mamp, Table Plus dan MySQL 5.7.
          
          Kelas ini cocok bagi Anda yang ingin mendalami database management dalam pengembangan aplikasi. Mentor ahli kami pun siap membantumu melalui grup konsultasi. Silakan daftar dan sampai jumpa di kelas!`,
        intro_video: 'https://youtu.be/CQDcJ07sMNg',
        target_audience: [
          'Anda yang ingin mempelajari MySQL',
          'Anda yang ingin mengelola big data secara efisien',
          'Anda yang ingin mempelajari DBMS'
        ],
        onboarding_text:
          'Anda akan memulai perjalanan mengagumkan Anda dalam dunia SQL dan desain database. Dengan panduan interaktif dan mudah dipahami, kami akan membantu Anda memahami dasar-dasar SQL menggunakan MySQL, salah satu sistem manajemen basis data paling populer.'
      }
    ];

    const seedCourses = courses.map((category) => ({
      ...generateRandomCourse(),
      ...category
    }));

    return queryInterface.bulkInsert('course', seedCourses);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course', null, {});
  }
};
