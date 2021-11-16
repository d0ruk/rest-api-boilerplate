const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "tags",
      Array.from({ length: 25 }, () => {
        return {
          name: faker.unique(faker.lorem.word),
          created_at: new Date(),
          updated_at: new Date(),
        };
      }),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tags", null, {});
  },
};
