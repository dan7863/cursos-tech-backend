import CourseModel from "../models/courses.js";


export default class CourseController{

    static getCoursesCards = async (req, res) => {
        const { limit, offset } =  CourseController.getPagination(req.query);
        const result = await CourseModel.getCoursesCards(limit, offset);
        res.status(result.status).json(result.success ? result.values : {message: result.message})
    }
    
    static getPagination = (query) => {
        let page = 1;
        let limit = 5;
        if(query.page){
            page = parseInt(query.page);
        }

        if(query.limit){
            limit = parseInt(query.limit);
        }

        let offset = Math.abs((page - 1) * limit);

        return {
            page,
            limit,
            offset
        };
    };
      

}