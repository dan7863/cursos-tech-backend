import pool from "../database/connection.js";

import {
  CategoryNames,
  CourseNames,
  LevelNames,
  UserNames,
} from "../config/names.js";

export default class CourseModel {
  static async getCourses() {
    try {
      const [rows] = await pool.query(
        `SELECT co.title, ca.name, le.name, co.price, us.name  FROM ?? as co
            INNER JOIN ?? as ca
            ON co.category_id = ca.id
            INNER JOIN ?? as le
            ON co.level_id = le.id
            INER JOIN ?? as us
            ON co.user_id = us.id;`,
        [
          CourseNames.database_table_name,
          CategoryNames.database_table_name,
          LevelNames.database_table_name,
          UserNames.database_table_name,
        ]
      );
      res.json(rows);
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
  }
}
