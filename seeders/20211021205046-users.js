const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      Array.from({ length: 100 }, () => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: "12345",
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
