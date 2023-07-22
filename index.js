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

// Initializing an array of department options
const listOfDepartments = []
// Query to populate Departments array
connection.query('SELECT name FROM department;', function(err, results) {
    if (err) {
        console.log(err)
    }
    for (i = 0; i < results.length; i++) {
        listOfDepartments.push(results[i].name)
    }
});

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


// Initialize empty array of roles
let listOfRoles = []
// Query to populate roles array
connection.query('SELECT title FROM role;', function(err, results) {
    if (err) {
        console.log(err)
    }
    for (i = 0; i < results.length; i++) {
        listOfRoles.push(results[i].title);
    }
});


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


// Initialize empty array of employees
const employeeNames = []
// Query to populate employeeNames array
connection.query('SELECT first_name, last_name FROM employee;', function(err, results) {
    if (err) {
        console.log(err)
    }
    for (i = 0; i < results.length; i++) {
        let full_name = results[i].first_name.concat(' ', results[i].last_name);
        employeeNames.push(full_name);
    }
});

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
    inquirer
    .prompt(actions)
    .then((userChoice) => {
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
        if (err) {
            console.log(err)
        }
        console.table(results)
        init();

    })
}

// View all roles
function role() {
    connection.query('SELECT * FROM role JOIN department ON role.id = department.id;', function (err, results) {
        if (err) {
            console.log(err)
        }
        console.table(results);
        init();
    })
}

// View all employees
function employees() {
    connection.query('SELECT * FROM employee INNER JOIN role ON employee.id = role.id INNER JOIN department ON role.id = department.id;',
     function (err, results) {
        if (err) {
            console.log(err)
        }
        console.table(results);
        init();
    })
}

// Add a department
function addDepartment() {
    inquirer
    .prompt(departmentPrompt)
    .then((userChoice) => {
        connection.query('INSERT INTO department (name) VALUES (?);', userChoice.department, function (err, results) {
            if (err) {
                console.log(err)
            }
            console.log(`Added ${userChoice.department} to the database.`);
            init();
        })
    })
}

// Add a role
function addRole() {
    inquirer
    .prompt(rolePrompt)
    .then((userChoice) => {
        // getting department id from database
        connection.query('SELECT id FROM department WHERE name = (?);', userChoice.department, function (err, results) {
            if (err) {
                console.log(err)
            }
            let department_id = results[0].id;
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [userChoice.role, userChoice.salary, department_id], function (err, results) {
                if (err) {
                    console.log(err)
                }
                console.log(`Added ${userChoice.role} to the database.`);
                init();
            })
        })

    })
}

// Add an employee
function addEmployee() {
    inquirer
    .prompt(employeePrompt)
    .then((userChoice) => {
        // getting role id from database
        connection.query('SELECT id FROM role WHERE title = (?);', userChoice.role, function(err, results) {
            if (err) {
                console.log(err)
            }
           var role_id = results[0].id;
           let first_name = userChoice.managerConfirm.split(' ')[0];
        // getting manager id from database
           connection.query('SELECT id FROM employee WHERE first_name = (?);', first_name, function(err, results) {
               if (err) {
                   console.log(err)
                }
                let manager_id = results[0].id;
                connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', 
                [userChoice.first_name, userChoice.last_name, role_id, manager_id], function (err, results) {
                    if (err) {
                        console.log(err)
                    }
                    console.log('Employee added to database');
                    init();
                })
            })
        })
    })
}

// Update employee role
function updateEmployeeRole() {
    inquirer
    .prompt(updateRole)
    .then((userChoice) => {
        connection.query('SELECT id FROM role WHERE title = (?);', userChoice.role, function(err, results) {
            if (err) {
                console.log(err)
            }
            let role_id = results[0].id;
            let first_name = userChoice.employeeName.split(' ')[0];
            connection.query('UPDATE employee SET role_id = (?) WHERE first_name = (?);', (role_id, first_name), function (err, results) {
                if (err) {
                    console.log(err)
                }
                console.log(`${first_name}'s role updated to ${userChoice.role} in the database.`);
                init();
            })
        })
    })
}



init();