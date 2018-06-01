module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
      moviedinner_date: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [10]
        }
      },
      zipcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        len: [5]
      }
    });
    return User;
  };