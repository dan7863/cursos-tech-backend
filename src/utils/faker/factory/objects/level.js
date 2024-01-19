import {LevelNames} from "../../../../config/names.js";
import { faker } from '@faker-js/faker';

export class RandomLevel{

    static tableName = LevelNames.database_table_name;

    static randomObject(){
        return {
            name: faker.commerce.productName(),
        }
    }
}