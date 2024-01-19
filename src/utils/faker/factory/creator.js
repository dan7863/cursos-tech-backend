import { faker } from '@faker-js/faker';
import Populator from './populate.js';

export default class Creator{

    static objectsCreation(tableName, randomObject, count){
        const randomObj = randomObject();
        const keys = Object.keys(randomObj);

        const objects = faker.helpers.multiple(randomObject, {
            count
        });

       
        Populator.insert(tableName, objects, keys);
    }
}