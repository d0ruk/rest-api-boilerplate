module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("users", "role", { type: Sequelize.TINYINT });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("users", "role");
  },
};
