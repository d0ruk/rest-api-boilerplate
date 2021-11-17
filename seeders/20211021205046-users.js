const faker = require("faker");
const config = require("config");

const { hashWithSalt } = require("../dist/util/");

const { name, password: _password, email } = config.get("app.admin");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [hash, salt] = await hashWithSalt(_password);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name,
          email,
          password: hash.toString("hex"),
          salt,
          role: 0,
        },
      ].concat(
        Array.from({ length: 99 }, () => ({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: hash.toString("hex"),
          salt,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      )
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
