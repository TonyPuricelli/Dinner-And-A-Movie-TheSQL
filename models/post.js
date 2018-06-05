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
    
    return UserData;
    };