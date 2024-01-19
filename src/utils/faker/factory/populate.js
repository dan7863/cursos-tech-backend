import pool from "../../../database/connection.js";

export default class Populator{

    static async insert(tableName, randomObjects, keys){
        try{
            const formattedData = randomObjects.map(obj => {
                const values = Object.values(obj).map(value => typeof value === 'string' ? `'${value}'` : value);
                return `(${values.join(', ')})`;
            }).join(', ');
            
            const formattedKeys = keys.join(', ');
            const [query] = await pool.query(`INSERT INTO ${tableName} (${formattedKeys}) VALUES ${formattedData}`);
            
            console.log(query);
        } catch(error){
            console.log(error);
            // return res.status(500).json({
            //     message: 'Something goes wrong'
            // });
        }
    }
}

