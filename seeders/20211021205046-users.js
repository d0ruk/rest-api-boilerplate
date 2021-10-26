const faker = require("faker");

const { hashWithSalt } = require("../dist/util/");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [hash, salt] = await hashWithSalt("12345");

    await queryInterface.bulkInsert(
      "users",
      Array.from({ length: 100 }, () => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hash.toString("hex"),
        salt,
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
