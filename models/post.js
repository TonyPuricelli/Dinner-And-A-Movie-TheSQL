module.exports = function(sequelize, DataTypes) {
    var UserData = sequelize.define("users", {
      moviedinner_date: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   len: [20]
        // }
      },
      zipcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //len: [1]
      }
    });

    // UserData.associate = function(models) {
    //     // We're saying that a Post should belong to a User
    //     // A Post can't be created without a User due to the foreign key constraint
    //     UserData.belongsTo(models.Author, {
    //       foreignKey: {
    //         allowNull: false
    //       }
    //     });
    //   };
    
    return UserData;
    };