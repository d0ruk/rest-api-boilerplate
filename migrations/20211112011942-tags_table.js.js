module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "tags",
      {
        id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
        created_at: {
          type: Sequelize.DATE(3),
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
        },
        updated_at: {
          type: Sequelize.DATE(3),
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"
          ),
        },
        deleted_at: Sequelize.DATE(3),
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["name"],
          },
        ],
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tags");
  },
};
