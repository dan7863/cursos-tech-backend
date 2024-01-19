import {CategoryNames, LevelNames, UserNames} from "../../../../config/names.js";
import { faker } from '@faker-js/faker';
import pool from "../../../../database/connection.js";

export class RandomCourse{

    static tableName = CategoryNames.database_table_name;
    static rows;
    static rows2;
    static rows3;
    
    static async queries(){
        const [rows] = await pool.query("SELECT GROUP_CONCAT(DISTINCT id) FROM ??", [CategoryNames.database_table_name]);
        const [rows2] = await pool.query("SELECT GROUP_CONCAT(DISTINCT id) FROM ??", [LevelNames.database_table_name]);
        const [rows3] = await pool.query("SELECT GROUP_CONCAT(DISTINCT id) FROM ??", [UserNames.database_table_name]);

        this.rows = rows;
        this.rows2 = rows2;
        this.rows3 = rows3;
    }

    static randomObject(){
        
        console.log(this.rows);
        return {
            title: faker.string.alpha(),
        }
    }
}

