import {CategoryNames} from "../../../../config/names.js";
import { faker } from '@faker-js/faker';

export class RandomCategory{

    static tableName = CategoryNames.database_table_name;

    static randomObject(){
        return {
            name: faker.commerce.productName(),
        }
    }
}