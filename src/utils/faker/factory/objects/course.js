import {CategoryNames, CourseNames, LevelNames, UserNames} from "../../../../config/names.js";
import { faker } from '@faker-js/faker';
import pool from "../../../../database/connection.js";

export class RandomCourse{

    static tableName = CourseNames.database_table_name;

    static async queries(){
        const [rows] = await pool.query("SELECT id FROM ??", [CategoryNames.database_table_name]);
        const [rows2] = await pool.query("SELECT id FROM ??", [LevelNames.database_table_name]);
        const [rows3] = await pool.query("SELECT id FROM ??", [UserNames.database_table_name]);

        return [ rows, rows2, rows3 ];
    }

    static randomObject() {
        return new Promise(async (resolve, reject) => {
            try {
                const results = await RandomCourse.queries();
                const [rows, rows2, rows3] = results;
    
                const rowsValues = rows.map(queryObject => queryObject.id);
                const rows2Values = rows2.map(queryObject => queryObject.id);
                const rows3Values = rows3.map(queryObject => queryObject.id);
                console.log(rowsValues);
                const randomObject = {
                    title: faker.lorem.slug(),
                    image_url: faker.image.url(),
                    category_id: faker.helpers.arrayElement(rowsValues),
                    level_id: faker.helpers.arrayElement(rows2Values),
                    user_id: faker.helpers.arrayElement(rows3Values),
                    price: faker.number.int({ max: 5000 }),
                };
    
                resolve(randomObject);
            } catch (error) {
                console.error(error);
                reject(error); // Rechazar la promesa para manejar el error a nivel del llamador si es necesario
            }
        });
    }
    
}

