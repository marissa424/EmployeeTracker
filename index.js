const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

// query to see all departments
const viewAllDepartments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, results) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve(console.table(cTable.getTable(results)))
            }
        })
    })
}

const viewAllRoles = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT role.id, role.title, role.salary, department.department_name FROM role JOIN department ON department.id = role.department_id;`, (err, results) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve(console.table(cTable.getTable(results)))
            }
        })
    })
}

const viewAllEmployees = () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
                FROM employee 
                    JOIN role 
                        ON role.id = employee.role_id
                    JOIN department
                        ON department.id = role.department_id
                    LEFT JOIN employee as manager
                        ON employee.manager_id = manager.employee_id;`

        db.query(query, (err, results) => {
            if (err) {

                console.error(err)
                reject(err)
            } else {
                let departmentTable = cTable.getTable(results)
                resolve(console.table(departmentTable))
            }
        })
    })
}

const addDepartment = () => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: 'newDepartment',
                    type: 'input',
                    message: 'Enter the name of your new department'
                }
            ]).then((response) => {
                let add_department = `INSERT INTO department (department_name) VALUES ("${response.newDepartment}")`;
                db.execute(add_department, async (err, results) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log("added new department")
                        await viewAllDepartments()
                        resolve()
                    }
                })

            })

    });
}

const addRole = (departmentObj, departments) => {
    console.log(departments)
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the title of the new role'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the salary of the new role'
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'Enter the department of the new role',
                    choices: departments
                }
            ]).then((response) => {
                // match department name with id
                let department_id;

                for (let i = 0; i < departmentObj.length; i++) {
                    if (departmentObj[i].department_name == response.department) {
                        department_id = departmentObj[i].id;
                    }
                };

                let add_department = `INSERT INTO role (title, salary, department_id) VALUES ("${response.title}", "${response.salary}", "${department_id}")`;
                db.execute(add_department, async (err, results) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log("Added new role")
                        await viewAllRoles()
                        resolve()

                    }

                });

            });
    })
}

const addEmployee = (roleObj, titles, employeeObj, names) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: "Enter your employee's first name"
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: "Enter your employee's last name"
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is their role?',
                    choices: titles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Please select your employee's manager",
                    choices: names
                },
            ]).then((response) => {

                // find manager id
                let managerId;

                for (let i = 0; i < employeeObj.length; i++) {
                    if (employeeObj[i].name == response.manager) {
                        managerId = employeeObj[i].employee_id;
                    }
                };

                let add_employee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstName}", "${response.lastName}", "${getRoleId(roleObj, response)}", "${managerId}")`;
                db.execute(add_employee, async (err, results) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log("Added new role")
                        await viewAllEmployees()
                        resolve()

                    }
                });
            })
    })
}

const updateEmployee = (roleObj, titles, employeeObj, names) => {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "choose and employee to update",
                    choices: names
                },
                {
                    name: "role",
                    type: "list",
                    message: "choose a new role",
                    choices: titles
                }
            ]).then((response) => {
                let employeeId
                for (let i = 0; i < employeeObj.length; i++) {
                    if (employeeObj[i].name == response.employee) {
                        employeeId = employeeObj[i].employee_id;
                    }
                };

                db.execute(`UPDATE employee SET role_id = "${getRoleId(roleObj, response)}" WHERE employee_id = ${employeeId}`, async (err, result) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } else {
                        console.log("Updated employee")
                        await viewAllEmployees()
                        resolve(err)
                    }
                })
            })
    })
}

const getDepartments = () => {
    return new Promise((resolve, reject) => {
        // get list of departments
        let departments = [];
        let departmentObj;
        db.query("Select * FROM department", (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                departmentObj = result;

                for (let i = 0; i < result.length; i++) {
                    departments.push(result[i].department_name);
                }

                resolve([departmentObj, departments])
            }
        });
    })

}

const getEmployees = () => {
    return new Promise((resolve, reject) => {
        let employeeObj;
        let names = [];
        db.query(`SELECT employee.employee_id, CONCAT(employee.first_name, ' ', employee.last_name) AS name
        FROM employee;`, (err, result) => {
            if (err) {
                console.error(err);
                reject(err)
            } else {
                employeeObj = result;
                for (let i = 0; i < result.length; i++) {
                    names.push(result[i].name);
                }
                resolve([employeeObj, names])
            }
        });
    })


}

const getRoles = () => {
    return new Promise((resolve, reject) => {
        let roleObj;
        let titles = [];
        db.query(`SELECT role.title, role.id
                FROM role;`, (err, result) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                roleObj = result;

                for (let i = 0; i < result.length; i++) {
                    titles.push(result[i].title);
                }

                resolve([roleObj, titles])
            }
        });
    })
}

const getRoleId = (roleObj, response) => {
    // find role id
    let roleId;
    for (let i = 0; i < roleObj.length; i++) {
        if (roleObj[i].title == response.role) {
            roleId = roleObj[i].id;
        }
    };
    return roleId
}

const returnMenu = () => {
    inquirer
        .prompt([
            {
                name: 'nextSteps',
                type: 'list',
                message: 'Would you like to continue?',
                choices: ["Yes", "No"]
            }
        ]).then((response) => {
            if (response.nextSteps == "Yes") {
                prompt()
            } else {
                console.log("Goodbye!")
                process.exit(0)
            }
        })
}

const db = mysql.createConnection(
    { 
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);



const prompt = () => {
    inquirer
        .prompt([
            {
                name: 'username',
                type: 'list',
                message: 'Select what you would like to do:',
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]

            }
        ]).then(async (response) => {

            // grabs current data from server
            let [departmentObj, departments] = await getDepartments();
            let [employeeObj, names] = await getEmployees();
            let [roleObj, titles] = await getRoles();

            switch (response.username) {
                case "view all departments":
                    console.log("view departments")
                    await viewAllDepartments()

                    break;
                case "view all roles":
                    console.log("view roles")
                    await viewAllRoles()

                    break;
                case "view all employees":
                    console.log("view employees")

                    await viewAllEmployees()

                    break;
                case "add a department":

                    await addDepartment()

                    break;
                case "add a role":

                    await addRole(departmentObj, departments)

                    break;
                case "add an employee":

                    await addEmployee(roleObj, titles, employeeObj, names)
                    break;

                case "update an employee role":

                    await updateEmployee(roleObj, titles, employeeObj, names)
                    break;
            }

        }).then(() => {
            returnMenu()
        })
}

prompt()
