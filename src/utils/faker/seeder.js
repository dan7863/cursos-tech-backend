import Creator from "./factory/creator.js";
import { RandomUser } from "./factory/objects/user.js";
import { RandomCategory } from "./factory/objects/category.js";
import { RandomLevel } from "./factory/objects/level.js";
import { RandomCourse } from "./factory/objects/course.js";

(async () => {
    // Primera parte: Ejecutar las primeras tres funciones de forma concurrente
    const promises1 = [
        Creator.objectsCreation(RandomUser.tableName, RandomUser.randomObject, 5),
        Creator.objectsCreation(RandomCategory.tableName, RandomCategory.randomObject, 5),
        Creator.objectsCreation(RandomLevel.tableName, RandomLevel.randomObject, 5),
    ];

    await Promise.all(promises1);

    // Segunda parte: Ejecutar la siguiente función después de que las anteriores se completen
    await Creator.objectsAsyncCreation(RandomCourse.tableName, RandomCourse.randomObject, 5);
})();