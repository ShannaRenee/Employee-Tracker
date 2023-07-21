// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
require('console.table');

// Connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker'
},
    console.log('connected to employee_tracker')
);


// Initial list of actions
const actions = [
    {
        type: 'list',
        name: 'selections',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department',
        'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }
];


// Prompt to add a department
const departmentPrompt = [
    {
        type: 'input',
        name: 'department',
        message: 'What department would you like to add?'
    }
];


// Array of department options
let listOfDepartments = ['Sales', 'Accounting', 'Marketing', 'Customer Service', 'IT', 'HR']

// Prompt to add a role
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
        message: 'What department does this role belong to?',
        choices: listOfDepartments
    }
];


// Array of role options
let listOfRoles = ['Systems Administrator II', 'Project Manager', 'Graphic Designer', 'Marketing Manager',
'VP Accounting', 'IT Manager', 'Programmer Analyst II', 'Account Representative I', 'Analog Circuit Design manager',
'Sales Representative', 'Sales Manager', 'engineer']

// Prompt to add an employee
const employeePrompt = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the employees last name?'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is their role?',
        choices: listOfRoles
    },
    {
        type: 'list',
        name: 'managerConfirm',
        message: 'If this employee has a manager, please select a manager, if they do not, please select null.',
        choices: ['Claudie Abotson', 'Kristoforo Windas', 'Jesus Bloxsome', 'NULL']
    }
];


// Array of employees
let employeeNames = ['Jolee Mc Menamin', 'Guy Hebblethwaite', 'Jesus Bloxsome', 'Byrle Pauli', 'Oliviero Berringer', 
'Claudie Abotson', 'Kristoforo Windas', 'Sammy Ruff', 'Gaspar Abbatucci', 'Colman Sapp', 'Faith Shucksmith',
'Dorree MacAlinden', 'Kylie Slee', 'Binnie Hayller', 'Josie Lebbon', 'Andrei Rigolle', 'Ferd Beekmann',
'Ezra Carter', 'Gabrielle Sweynson', 'Tracey Budden']

// Prompt to update an employee role
const updateRole = [
    {
        type: 'list',
        name: 'employeeName',
        message: 'Which employee would you like to update?',
        choices: employeeNames
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is their new role?',
        choices: listOfRoles
    }
];


// Starts up inquirer and brings up list of actions
function init() {
    inquirer.prompt(actions).then((userChoice) => {
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
        } else if (userChoice.selections === 'Add an employee') {
            addEmployee();
        } else if (userChoice.selections === 'Update an employee role') {
            updateEmployeeRole();
        } else if (userChoice.selections === 'Exit') {
            console.log('Bye!!')
            process.exit();
        }
    }
)};

// View all departments
function department() {
    connection.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        init();
    })
}

// View all roles
function role() {
    connection.query('SELECT * FROM role;', function (err, results) {
        console.table(results);
        init();
    })
}

// View all employees
function employees() {
    connection.query('SELECT * FROM employee;', function (err, results) {
        console.table(results);
        init();
    })
}

// Add a department
function addDepartment() {
    inquirer.prompt(departmentPrompt).then((userChoice) => {
        connection.query('INSERT INTO department (name) VALUES (?);', userChoice.department, function (err, results) {
            listOfDepartments.push(userChoice.department);
            console.log(`Added ${userChoice.department} to the database.`);
            init();
        })
    })
}

// Add a role
function addRole() {
    inquirer.prompt(rolePrompt).then((userChoice) => {
        // console.log(userChoice)
        connection.query('SELECT id FROM department WHERE name = (?);', userChoice.department, function (err, results) {
            // console.log(results)
            var department_id = results[0].id;
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [userChoice.role, userChoice.salary, department_id], function (err, results) {
                // console.log(userChoice.role, userChoice.salary, department_id)
                console.log(`Added ${userChoice.role} to the database.`);
                // init();
            })
        })

    })
}

// Add an employee
function addEmployee() {
    inquirer.prompt(employeePrompt).then((userChoice) => {
        connection.query('SELECT id FROM role WHERE title = (?);', userChoice.role, function(err, results) {
           var role_id = results[0].id;
        })
        connection.query('SELECT id FROM employee WHERE ')
        // console.log(userChoice)
        // connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', function (err, results) {
        //     console.table();
        //     init();
        // })
    })
}

// Update employee role
function updateEmployeeRole() {
    inquirer.prompt(updateRole).then((userChoice) => {
        connection.query('SELECT id FROM role WHERE title = (?);', userChoice.role, function(err, results) {
            let role_id = results[0].id;
            let first_name = userChoice.employeeName.split(' ')[0];
            connection.query('UPDATE employee SET role_id = (?) WHERE first_name = (?);', (role_id, first_name), function (err, results) {
                init();
            })
        })
    })
}




init();