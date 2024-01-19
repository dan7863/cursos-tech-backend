import { UserNames } from "../../../../config/names.js";
import { faker } from '@faker-js/faker';

export class RandomUser{

    static tableName = UserNames.database_table_name;

    static randomObject(){
        return {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            active: true
        }
    }
}