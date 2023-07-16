const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD,
    database: 'employee_tracker'
});



const prompt =[
    {
        type: 'list',
        name: 'selections',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department',
        'add a role', 'add an employee', 'update an employee role']
    }
];

function init() {
    inquirer.prompt(prompt).then((response) => {
        if (response === 'view all departments') {

        }
    })
};


init();