module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("users", "salt", { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("users", "salt");
  },
};
