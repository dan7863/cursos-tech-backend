import pool from "../database/connection.js";

import { UserNames } from "../config/names.js";

const getUsers = async (req, res) => {
    try{
        const [rows] = await pool.query("SELECT * FROM ??", [UserNames.database_table_name]);
        res.json(rows);
    } catch(error){
        return res.status(500).json({
            message: error
        });
    }
};

const getUser = async (req, res) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM ? WHERE id = ?`, [req.params.id]);
        
        if(rows.length <= 0) return res.status(404).json({
            message: 'User not found'
        });
        
        res.json(rows[0]);
    } catch(error){
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

const createUser = async (req, res) => {
    try{
        const {name, salary} = req.body;
    
        const [rows] = await pool.query(`INSERT INTO ?? (name, salary) VALUES (?, ?)`, [name, salary]);
        
        res.status(201).send({
            id: rows.insertId,
            name,
            salary
        });
    } catch(error){
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, salary} = req.body;
    const [result] = await pool.query(`UPDATE ? SET name = ?, salary = ? WHERE id = ?`, [name, salary, id]);
    
    try{
        if(result.affectedRows === 0) return res.status(404).json({
            message: 'User not found'
        });
    
        const [rows] = await pool.query(`SELECT * FROM ? WHERE id = ?`, [id]);
        
        res.json(rows[0]);
    } catch(error){
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
 
};

const partialUpdateUser = async (req, res) => {
    const {id} = req.params;
    const {name, salary} = req.body;
    const [result] = await pool.query(`UPDATE ? SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?`, [name, salary, id]);
    
    try{
        if(result.affectedRows === 0) return res.status(404).json({
            message: 'User not found'
        });

        const [rows] = await pool.query(`SELECT * FROM ? WHERE id = ?`, [id]);
        
        res.json(rows[0]);
    } catch(error){
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

const deleteUser = async (req, res) => {
    try{
        const [result] = await pool.query(`DELETE FROM ? WHERE id = ?`, [req.params.id]);
    
        if(result.affectedRows <= 0) return res.status(404).json({
            message: 'User not found'
        })
    
        res.sendStatus(204);
    } catch(error){
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

const UserModel = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    partialUpdateUser,
    deleteUser
};

export default UserModel;