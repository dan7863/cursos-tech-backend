import pool from "../database/connection.js";

import {
  CategoryNames,
  CourseNames,
  LevelNames,
  UserNames,
} from "../config/names.js";

export default class CourseModel {

  static async getCoursesCards(limit, offset) {
    try {
      const [total_rows] = await pool.query(`SELECT count(id) as total FROM ??`, [CourseNames.database_table_name]);
      const [rows] = await pool.query(
        `SELECT co.title as title, image_url as image, ca.name as category_name, 
        le.name as level_name, co.price as price, us.name as user_name 
        FROM ?? as co 
        INNER JOIN ?? as ca ON co.category_id = ca.id 
        INNER JOIN ?? as le ON co.level_id = le.id 
        INNER JOIN ?? as us ON co.user_id = us.id
        ORDER BY co.id
        LIMIT ? 
        OFFSET ?`,
        [
          CourseNames.database_table_name,
          CategoryNames.database_table_name,
          LevelNames.database_table_name,
          UserNames.database_table_name,
          limit,
          offset
        ]
      );  

      return { success: true, status: 200, values: {total: total_rows[0].total, rows} };
    } catch (error) {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      return { success: false, status: error.statusCode, message: error };
    }
  }
}
