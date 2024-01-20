import { faker } from '@faker-js/faker';
import Populator from './populate.js';

export default class Creator{

    static objectsCreation(tableName, randomObject, count){
        const randomObj = randomObject();
        // console.log(randomObj);
        const keys = Object.keys(randomObj);

        const objects = faker.helpers.multiple(randomObject, {
            count
        });

        // console.log(objects);
        Populator.insert(tableName, objects, keys);
    }

    static async objectsAsyncCreation(tableName, randomObject, count) {
        try {
            const keys = Object.keys(await randomObject());
    
            const objects = [];
            for (let i = 0; i < count; i++) {
                const obj = await randomObject();
                objects.push(obj);
            }
    
            console.log(objects);
            Populator.insert(tableName, objects, keys);
        } catch (error) {
            console.error(error);
        }
    }
    
    
}