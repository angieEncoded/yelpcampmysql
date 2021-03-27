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

  static deleteAll() {
    return db.execute("delete from campgrounds");
  }
  static selectCampgroundByID(id) {
    return db.execute("select from campgrounds where id = ?", [id]);
  }
};
