// module.exports = function (sequelize, DataTypes) {
//     var User = sequelize.define("User", {
//       moviedinner_date: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           len: [20]
//         }
//       },
//       zipcode: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         len: [5]
//       }
//     });
//     return User;
//   };

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
      },
      movietitle: {
        type: DataTypes.STRING,
        len: [100]
      },
      theater: {
        type: DataTypes.STRING,
        len: [100]
      },
      restaurantname: {
        type: DataTypes.STRING,
        len: [100]
      },
      restaurantcategory: {
        type: DataTypes.STRING,
        len: [100]
      }

    });
    return User;
  };
