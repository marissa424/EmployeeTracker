const updateEmployee = () => {
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
                    console.log(employeeObj)
                    if (employeeObj[i].name == response.employee) {

                        employeeId = employeeObj[i].employee_id;
                    }
                };
                console.log(employeeId)

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

module.exports = addDepartment()