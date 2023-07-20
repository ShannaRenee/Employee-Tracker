const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
require('console.table');
const Query = require('./constructors');

let listOfDepartments = ['Sales', 'Accounting', 'Marketing', 'Customer Service', 'IT', 'HR']

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker'
},
    console.log('connected to employee_tracker')
);



const choices = [
    {
        type: 'list',
        name: 'selections',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department',
        'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }
];

const departmentPrompt = [
    {
        type: 'input',
        name: 'department',
        message: 'What department would you like to add?'
    }
];

const rolePrompt = [
    {
        type: 'input',
        name: 'role',
        message: 'What role would you like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of this role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'What department does this role belong too?',
        choices: listOfDepartments
    }
];



function init() {
    inquirer.prompt(choices).then((userChoice) => {
        if (userChoice.selections === 'View all departments') {
            department();
        } else if (userChoice.selections === 'View all roles') {
            role();
        } else if (userChoice.selections === 'View all employees') {
            employees();
        } else if (userChoice.selections === 'Add a department') {
            addDepartment();
        } else if (userChoice.selections === 'Add a role') {
            addRole();
        } else if (userChoice.selections === 'Add an Employee') {
            addEmployee();
        } else if (userChoice.selections === 'Update an employee role') {
            updateEmployeeRole();
        } else if (userChoice.selections === 'Exit') {

        }
    }
    )}


function department() {
    connection.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        init();
    })
}

function role() {
    connection.query('SELECT * FROM role;', function (err, results) {
        console.table(results);
        init();
    })
}

function employees() {
    connection.query('SELECT * FROM employee;', function (err, results) {
        console.table(results);
        init();
    })
}

function addDepartment() {
    inquirer.prompt(departmentPrompt).then((userChoice) => {
        connection.query('INSERT INTO department (name) VALUES (?);', userChoice.department, function (err, results) {
            listOfDepartments.push(userChoice.department);
            console.log(`Added ${userChoice.department} to the database.`);
            init();
        })
    })
}

function addRole() {
    inquirer.prompt(rolePrompt).then((userChoice) => {
        connection.query('INSERT INTO role (title, salary, department_id) VALUES (?);', (userChoice.role, userChoice.salary, userChoice.department), function (err, results) {
            console.log(`Added ${userChoice.role} to the database.`);
            init();
        })
    })
}

function addEmployee() {
    inquirer.prompt(departmentPrompt).then((userChoice) => {
        // console.log(userChoice.department)
        connection.query('INSERT INTO department (name) VALUES (?);', userChoice.department, function (err, results) {
            console.table();
            init();
        })
    })
}





init();