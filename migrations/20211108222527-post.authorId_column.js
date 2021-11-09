module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("posts", "author_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "author_id");
  },
};
