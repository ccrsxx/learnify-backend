/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      isTableHasRecords,
      getCourseChapterIdByName,
      generateRandomCourseMaterial
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course_material', queryInterface)) return;

    const courseMaterials = [
      {
        id: 'c12dd512-0015-43a2-8fb7-004cbfdb6cf8',
        name: 'Kapan Membangun Design System?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Design System'
        ),
        video: 'https://youtu.be/ChdiLQ1iy5o'
      },
      {
        id: 'abd244c7-5f79-4e46-80c9-2c89846f1738',
        name: 'Tools Utama Membuat Design System',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Workflow Membangun Design System'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'c79437fd-cf2f-4f17-9ed7-446811a62669',
        name: 'Syarat Awal Membangun Design System',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Workflow Membangun Design System'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'fcc7dd87-e7cd-4ceb-9e7b-66ffe948fb9f',
        name: 'Menentukan Tema Design',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan UI/UX Design'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f300ac0f-da1d-4337-a200-2d9a31dc4ad1',
        name: 'Membuat Wireframe',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Figma'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'b49c4ac3-1b8e-4aa7-b5f5-1fa229f5c771',
        name: 'Style Guide Prototyping',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Figma'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '21b5879c-1e68-4a6f-bdfc-93747667ca5b',
        name: 'Map Direction Animation',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Prototyping Design'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '79801729-3b0e-4d31-bca6-629b2305ed19',
        name: 'Objectives dan User Story',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Mulai Membuat Animasi Dengan Figma'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'be523b4b-dbd0-4057-a504-a7320e1dfb75',
        name: 'Membuat State',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Mulai Membuat Animasi Dengan Figma'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '8b24ff2c-8ba1-4970-ad5d-cb3e11c9edf7',
        name: 'Apa itu Product?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Memahami Product Management'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'd0c0c841-2ee9-4a30-8529-a9e33daabb42',
        name: 'Apa itu Value?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Value Management'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '33862af4-8b10-4f91-a139-ac4f3e39fd16',
        name: 'Memahami Value Management',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Value Management'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'ec817924-e209-4ff3-883a-16e099c37404',
        name: 'Rencana Pemasaran Produk',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Strategi dan Perencanaan Product Marketing'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f6c240df-6bc6-41f4-ba24-0397b07ef8b7',
        name: 'Taktik Penetapan Harga',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Keterampilan Utama dalam Product Marketing'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '348fa4ab-4313-4147-9190-558f07832318',
        name: 'Kalender Pemasaran Produk',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Keterampilan Utama dalam Product Marketing'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '33eebbce-5b60-4d10-a100-84ad801c538a',
        name: 'Product Life Cycle',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Product Management'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '33cbea88-841d-4f9e-802c-d8793015eb1a',
        name: 'Mengapa Produk Gagal?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Proses Pengembangan Produk'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '78173bb3-6e8c-4044-8553-23db8069c79a',
        name: 'Bagaimana Menemukan Produk Anda',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Proses Pengembangan Produk'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'f9e1d65f-cad5-43ad-b7c2-a4922cc498f9',
        name: 'Set Up API Gateway',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Penjelasan Arsitektur'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '512e586e-8cda-4a84-a952-f4a9a23e6a67',
        name: 'Penjelasan Service Media',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Service Media & Service User'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'e9db87ce-e567-4bda-912f-9087dcd439ec',
        name: 'Penjelasan Service User',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Service Media & Service User'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'b579193f-cb57-4e4f-a09e-2722872a52b9',
        name: 'Tools UI Designer',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar Website'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f514f534-31c3-49df-a451-dc51da335c1c',
        name: 'Persona',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengembangan Website'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'ac56106d-967a-464b-822b-dad4196e4631',
        name: 'Benchmarking',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengembangan Website'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'b1d391da-c9cf-4faf-a2cd-ea2e33ea938a',
        name: 'Apa itu Design Handoff',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Design Things'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '4745cb78-5d82-411c-91ea-24ae2adccb9d',
        name: 'Tools Utama Frontend',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Frontend'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'd578596b-1432-4585-b166-aecd44c0d50b',
        name: 'Frontend Styling',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Frontend'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'e3670ac9-187e-49c3-938c-724545cafc1b',
        name: 'Provider Fundamental',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Hal Dasar'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'f6691a76-e474-48ce-b78b-fbd10094cabd',
        name: 'Memahami Alur Project',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Studi Kasus'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '0c3e80c5-96c9-4a6b-b8d0-1f097676f4f3',
        name: 'Tes & Analisis API',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Studi Kasus'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '503e4101-5225-4419-ab51-d18ff4779810',
        name: 'Apa itu UI/UX',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan UI Design'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '25449801-ff40-40f6-9173-b8c398b68480',
        name: 'Tipografi & Font',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Tahap UI Design'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'df5179cc-d44b-46ce-946d-a0eb22a52800',
        name: 'Grid & Jarak',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Tahap UI Design'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '3054a478-92f2-4e10-adff-99cac72fe05f',
        name: 'Export & Import Assets',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan Flutter'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'ea8e0a26-b379-4ff4-b210-38adbc0399e4',
        name: 'Slicing Onboarding Page',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Slicing Page'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '22ba2dcb-03e0-45c5-9d15-10506e2c9e7b',
        name: 'Slicing Splash Page',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Slicing Page'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: 'fc80bc91-2796-44f9-ab42-7b6848a7c458',
        name: 'Pratinjau Aplikasi',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar Swift'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '6833b070-4ed0-4277-aa6b-c4e33c978f7d',
        name: 'SwiftData',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Desain Aplikasi iOS'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '67363417-3d7f-49c0-9a1d-9da2a10b43cc',
        name: 'Animasi SwiftUI',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Desain Aplikasi iOS'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '24cb0e9e-7d4b-4f03-b36a-041b4aedd38e',
        name: 'Workspace XCode',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan XCode'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'd87511ba-42db-4fb7-8e8a-974f9501c1f7',
        name: 'Membuat Color Pallete',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Memulai Koding'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'ed4e4ee2-87f6-460f-973f-d31b57c719fb',
        name: 'Kustomisasi Font',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Memulai Koding'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '875db7fd-470a-4fc1-b582-ebf5d330c150',
        name: 'Dasar - Dasar Pengujian',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar Unit Test'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '9c611de3-d3c4-4934-afe5-c517ac1c5606',
        name: 'Piramida Pengujian',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Mulai Implementasi Test'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '8f47995d-88de-4d8c-9286-6d1d47f44e05',
        name: 'Menjalankan Tes Unit di XCode',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Mulai Implementasi Test'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '092ae275-9e02-452e-9c22-3a6c3edc2e63',
        name: 'Apa itu SQL?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Pengenalan SQL'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '3fe745b5-c82a-43e3-a1b1-0134e15d8004',
        name: 'Apa itu Database?',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Dasar SQL'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: '72e75e80-29ad-4114-9672-1771e4a20d06',
        name: 'Field & Data Type',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Dasar SQL'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '9f871ed5-b499-46a5-b378-823c60686b7a',
        name: 'Python Vs Anaconda',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Pengenalan Data Science'
        ),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: '1ca4f761-5767-463a-b883-7ab146745240',
        name: 'Probabilitas dan Statistika',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Teori Pemahaman'),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'f3f72c3d-7524-4a0a-8131-c1e2a0e9f238',
        name: 'Jenis - Jenis Plot/Graph',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName('Teori Pemahaman'),
        video: 'https://youtu.be/rd-590n3H6w'
      },
      {
        id: '0eb13fe5-fb4b-43c8-b5d9-6394be8da2c8',
        name: 'Basic Google Spreadsheet',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName('Google Spreadsheet'),
        video: 'https://youtu.be/ixOd42SEUF0'
      },
      {
        id: 'e0071904-530c-4d1d-89b4-31c19ed18446',
        name: 'Mengimpor File  ke Google Spreadsheet',
        order_index: 1,
        course_chapter_id: await getCourseChapterIdByName(
          'Memulai Studi Kasus'
        ),
        video: 'https://youtu.be/DwTkyMJi890'
      },
      {
        id: 'd31badfd-8151-45c0-bca3-9a5a0e103ecb',
        name: 'Mengaambil Data dari Google Spreadsheet',
        order_index: 2,
        course_chapter_id: await getCourseChapterIdByName(
          'Memulai Studi Kasus'
        ),
        video: 'https://youtu.be/rd-590n3H6w'
      }
    ];

    const seedCourseMaterials = courseMaterials.map((material) => ({
      ...generateRandomCourseMaterial(),
      ...material
    }));

    return queryInterface.bulkInsert('course_material', seedCourseMaterials);
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course__material', null, {});
  }
};
