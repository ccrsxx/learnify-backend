/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const {
      getUserIdByAdmin,
      isTableHasRecords,
      getCourseMaterialIdByName,
      generateRandomCourseMaterialStatus
    } = await import('../../libs/seed.js');

    if (await isTableHasRecords('course_material_status', queryInterface))
      return;

    const userAdminId = await getUserIdByAdmin();

    const courseMaterialStatuses = [
      {
        id: '3cc57925-35ce-4299-ac49-7aebe2868cc8',
        completed: true,
        user_id: userAdminId,
        course_material_id: await getCourseMaterialIdByName(
          'Kapan Membangun Design System?'
        )
      },
      {
        id: '160d292b-23c0-4276-8343-a107b3a83a2f',
        completed: true,
        user_id: userAdminId,
        course_material_id: await getCourseMaterialIdByName(
          'Tools Utama Membuat Design System'
        )
      },
      {
        id: '41915caf-486b-4158-b1f7-6730c5a6a62c',
        completed: false,
        user_id: userAdminId,
        course_material_id: await getCourseMaterialIdByName(
          'Syarat Awal Membangun Design System'
        )
      },
      {
        id: '9c5b9596-3c85-443f-9414-6718a8b037cd',
        completed: true,
        user_id: userAdminId,
        course_material_id: await getCourseMaterialIdByName('Apa itu Product?')
      }
    ];

    const seedCourseMaterialStatuses = courseMaterialStatuses.map(
      (material) => ({
        ...generateRandomCourseMaterialStatus(),
        ...material
      })
    );

    return queryInterface.bulkInsert(
      'course_material_status',
      seedCourseMaterialStatuses
    );
  },

  async down(queryInterface, _Sequelize) {
    // @ts-ignore
    return queryInterface.bulkDelete('course_material_status', null, {});
  }
};
