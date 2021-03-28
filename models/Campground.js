const db = require("../util/database");
console.log(process.env.USER);
module.exports = class Campground {
  constructor(id, title, price, description, location) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.location = location;
  }

  save() {
    return db.execute(
      "insert into campgrounds (id,title,price, description,location) values (?,?,?,?,?)",
      [this.id, this.title, this.price, this.description, this.location]
    );
  }

  update() {
    return db.execute(
      "update campgrounds set title = ?, price = ?, description = ?, location = ? where id = ?",
      [this.title, this.price, this.description, this.location, this.id]
    );
  }

  static deleteAll() {
    return db.execute("delete from campgrounds");
  }

  static deleteById(id) {
    return db.execute("delete from campgrounds where id = ?", [id]);
  }

  static getAllCampgrounds() {
    return db.execute(
      "select id, title, price, description, location from campgrounds"
    );
  }
  static getCampgroundByID(id) {
    return db.execute(
      "select id, title, price, description, location from campgrounds where id = ?",
      [id]
    );
  }
};
