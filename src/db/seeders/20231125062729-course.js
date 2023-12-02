/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      getUserIdByAdmin,
      isTableHasRecords,
      getCategoryIdByName,
      generateRandomCourse
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course', queryInterface)) return;

    const userAdminId = await getUserIdByAdmin();

    const courses = [
      {
        id: 'c63a172f-4eb1-44b2-8c90-66336b016d8f',
        name: 'Intro to Design System',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('UI/UX Design'),
        intro_video: 'https://youtu.be/ixOd42SEUF0',
        target_audience: [
          'Anda yang ingin memahami poin penting design system',
          'Anda yang ingin latihan membangun design system',
          'Anda yang ingin mengembangkan Startup'
        ]
      },
      {
        id: '1c67c849-9b9a-40a5-8042-53f584352d3d',
        name: 'UI/UX Design Website Design With Figma',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('UI/UX Design'),
        intro_video: 'https://youtu.be/DwTkyMJi890',
        target_audience: [
          'Anda yang mau belajar UI/UX design dari 0',
          'Anda yang ingin membangun portofolio yang up to date',
          'Anda yang ingin berkarir menjadi UI/UX Designer'
        ]
      },
      {
        id: 'a0ccc48a-e8b3-43b4-bdd0-c2bedefec899',
        name: 'Mastering Figma: Website UI Animation Design',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('UI/UX Design'),
        intro_video: 'https://youtu.be/rd-590n3H6w',
        target_audience: [
          'Anda yang ingin membuat sebuah Prototype',
          'Anda yang ingin validasi ide bisnis melalui Design Proccess',
          'Anda yang ingin melakukan Usability-Testing'
        ]
      },
      {
        id: '5db0a017-6041-4d9a-8f44-5fca03d5378a',
        name: 'Product Management Fundamentals',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Product Management'),
        intro_video: 'https://youtu.be/HYfG_uCOlhc',
        target_audience: [
          'Anda yang ingin bekerja dalam peran Manajemen Produk',
          'Anda yang ingin memahami tentang Manajemen Produk',
          'Anda yang ingin menjadi seorang Profesional di Industri Jasa dan Produk'
        ]
      },
      {
        id: '858c99b9-b366-418d-baa4-ff43bf8b9a4d',
        name: 'Product Management Marketing',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Product Management'),
        intro_video: 'https://youtu.be/DmxXl1k0X5g',
        target_audience: [
          'Anda yang ingin beralih ke bidang Manajemen Produk',
          'Anda yang ingin meningkatkan keterampilan dan pemahaman tentang Manajemen Produk',
          'Anda yang ingin menjadi pengusaha disiplin dalam Manajemen Produk'
        ]
      },
      {
        id: '1faa2b15-92c9-41f7-b46c-7747d42c2045',
        name: 'The Concise Product Management Course',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Product Management'),
        intro_video: 'https://youtu.be/1eJzLj9OE0Q',
        target_audience: [
          'Cocok untuk seorang Manajer Produk yang ingin sukses dalam pekerjaannya',
          'Cocok untuk seorang yang ingin beralih ke karier Manajemen Produk',
          'Cocok untuk seorang Pengusaha yang ingin mempelajari bagaimana proses membangun sebuah Produk yang baik'
        ]
      },
      {
        id: '0d7925a7-0c68-4c25-9c9a-c1f346bdc9fc',
        name: 'Web Development Microservice: Website Kelas Online',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development'),
        intro_video: 'https://youtu.be/6hIUgd6WuFw',
        target_audience: [
          'Cocok untuk yang ingin membangun website kelas online',
          'Diperuntukkan bagi yang ingin menjadi fullstack developer pada bahasa pemrograman javascript'
        ]
      },
      {
        id: '14b3347c-bc8a-4cee-b2fd-b41764c3db10',
        name: 'Full-Stack Web Developer',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development'),
        intro_video: 'https://youtu.be/6hXoBeIQd-o',
        target_audience: [
          'Anda yang ingin mempelajari Prototype',
          'Anda yang ingin menguasai pengembangan web',
          'Anda yang ingin mempelajari backend Laravel'
        ]
      },
      {
        id: '69345e73-76ad-409f-a0fe-98b7f23160ab',
        name: 'Full-Stack Web Designer: Handoff dan Front-End',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Web Development'),
        intro_video: 'https://youtu.be/HVmmrTBdiFY',
        target_audience: [
          'Cocok untuk yang ingin belajar proses design ke code',
          'Cocok untuk yang sedang belajar membuat Prototype'
        ]
      },
      {
        id: 'f3102f7e-9916-4ff8-a50c-60048f7b634c',
        name: 'Flutter Developer: Provider State Management',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development'),
        intro_video: 'https://youtu.be/eSrXU5vrgaI',
        target_audience: [
          'Anda yang ingin membangun aplikasi mobile menggunakan API',
          'Anda yang ingin memperdalam State Management Provider pada Flutter',
          'Anda yang ingin memiliki portfolio yang menjual'
        ]
      },
      {
        id: 'b4863ea2-0fb8-46ca-97e7-ee8a817b7f70',
        name: 'Learn Flutter & Adobe XD: Build a Complete Mobile App',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development'),
        intro_video: 'https://youtu.be/JVJc4k6xjTM',
        target_audience: [
          'Anda yang ingin mempelajari proses Design to Code',
          'Anda yang ingin mempelajari Slicing UI ke Flutter',
          'Anda yang ingin memiliki portofolio yang menjual'
        ]
      },
      {
        id: '650c5f2b-6aaf-4891-8b0d-1afe25ee9887',
        name: 'Full-Stack Laravel Flutter: Build e-Wallet Mobile Apps',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Android Development'),
        intro_video: 'https://youtu.be/Sl0YBFJuvSU',
        target_audience: [
          'Anda yang ingin memperdalam Flutter dan Laravel',
          'Anda yang ingin berkarir sebagai Mobile Developer',
          'Anda yang ingin membangun aplikasi E-Wallet'
        ]
      },
      {
        id: 'c3964d15-6932-4dff-aaae-84bed19707b1',
        name: 'iOS Development using Swift UI',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('IOS Development'),
        intro_video: 'https://youtu.be/t2s863UWF2I',
        target_audience: [
          'Anda yang ingin bisa menggunakan Swift',
          'Anda yang ingin membangun aplikasi iOS',
          'Anda yang ingin berkarir menjadi iOS Developer'
        ]
      },
      {
        id: '65d6891c-8369-4241-bf8c-18ae3fc0939f',
        name: 'SwiftUI & iOS Engineer: The Complete App Development Bootcamp',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('IOS Development'),
        intro_video: 'https://youtu.be/yk_p1bi6Oyw',
        target_audience: [
          'Anda yang ingin meningkatkan skill slicing User Interface',
          'Anda yang ingin mempelajari lebih dalam tools Xcode',
          'Anda yang ingin mempunyai real world project untuk portfolio'
        ]
      },
      {
        id: '7a3ce435-b86f-4dbf-9ada-81f008ab8c67',
        name: 'Unit Testing Swift Mobile App',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('IOS Development'),
        intro_video: 'https://youtu.be/BruzjxVsneM',
        target_audience: [
          'Cocok untuk seorang pemula yang tidak memiliki pengalaman mengenai Unit Testing',
          'Cocok untuk anda yang ingin mempelajari cara menulis Unit Test dan UI Test dengan baik'
        ]
      },
      {
        id: 'bfd0ab17-01f8-4572-bc78-347c635ecf38',
        name: 'SQL for Beginners: Learn SQL using MySQL and Database Design',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Data Science'),
        intro_video: 'https://youtu.be/CQDcJ07sMNg',
        target_audience: [
          'Anda yang ingin mempelajari MySQL',
          'Anda yang ingin mengelola big data secara efisien',
          'Anda yang ingin mempelajari DBMS'
        ]
      },
      {
        id: '249ab7ed-e204-4869-addd-e11ca3db7f97',
        name: 'Statistics for Data Science and Business Analysis',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Data Science'),
        intro_video: 'https://youtu.be/ChdiLQ1iy5o',
        target_audience: [
          'Anda yang ingin mempelajari Data Analisis',
          'Anda yang ingin membuat Visualisasi Data',
          'Anda yang ingin mempelajari Probabilitas dan Statistika'
        ]
      },
      {
        id: 'c7f48c4f-50e7-4e3f-bf0a-f31ec1a74c1c',
        name: 'Basic Spreadsheets For Data Analysis',
        user_id: userAdminId,
        course_category_id: await getCategoryIdByName('Data Science'),
        intro_video: 'https://youtu.be/iQwND8dlCdM',
        target_audience: [
          'Anda yang ingin meningkatkan skill dalam Organize Data',
          'Anda yang ingin mempelajari terkait Data, Grafik dan Statistic',
          'Anda yang ingin berkarir di bidang Data Analyst'
        ]
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
