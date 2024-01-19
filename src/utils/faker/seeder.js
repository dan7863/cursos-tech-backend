import Creator from "./factory/creator.js";
import { RandomUser } from "./factory/objects/user.js";
import { RandomCategory } from "./factory/objects/category.js";
import { RandomLevel } from "./factory/objects/level.js";
import { RandomCourse } from "./factory/objects/course.js";

(() => {
        Creator.objectsCreation(RandomUser.tableName, RandomUser.randomObject, 5);
        Creator.objectsCreation(RandomCategory.tableName, RandomCategory.randomObject, 5);
        Creator.objectsCreation(RandomLevel.tableName, RandomLevel.randomObject, 5);
        RandomCourse.randomObject();
    }
)();