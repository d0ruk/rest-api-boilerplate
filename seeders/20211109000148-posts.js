const faker = require("faker");
const { random } = require("lodash");

const { getSlug } = require("../dist/util/");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "posts",
      Array.from({ length: 100 }, () => {
        const title = faker.lorem.sentence();

        return {
          title,
          body: faker.lorem.paragraphs(random(1, 3)),
          author_id: random(1, 100),
          published: Boolean(random(0, 1)),
          slug: getSlug(title),
          created_at: new Date(),
          updated_at: new Date(),
        };
      }),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
