const db = require("../util/database");
module.exports = class Review {
  constructor(id, rating, details, campground_id, username) {
    this.id = id;
    this.rating = rating;
    this.details = details;
    this.campground_id = campground_id;
    this.username = username;
  }

  save() {
    return db.execute(
      "insert into reviews (id, rating, details, campground_id, username) values (?,?,?,?,?)",
      [this.id, this.rating, this.details, this.campground_id, this.username]
    );
  }

  //   update() {
  //     return db.execute(
  //       "update reviews set rating=?, details=?, campground_id=? where id = ?",
  //       [this.rating, this.details, this.campground_id, this.id]
  //     );
  //   }

  //   static deleteById(id) {
  //     return db.execute("delete from reviews where id = ?", [id]);
  //   }

  //   static getReviewByID(id) {
  //     return db.execute(
  //       "select id, rating, details, campground_id from reviews where id = ?",
  //       [id]
  //     );
  //   }
};
