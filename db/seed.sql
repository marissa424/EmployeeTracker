INSERT INTO department(department_name)
VALUES ("Engineering"),
    ("Legal"),
    ("Sales"),
    ("Human Resources"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "90000", 3),
("Salesperson", "60000", 3),
("Lead Engineers", "180000", 1),
("Software Engineer", "100000", 1),
("Account Manager", "160000", 5),
("Accountant", "125000", 5),
("Legal Team Lead", "250000", 2),
("Lawyer", "190000", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jon", "Taylor", 1, null),
("Brooklynn", "Arrington", 2, 1),
("Annika", "Kunz", 3, null),
("Mike", "Lemme", 4, 3),
("Marie", "Jones", 5, null),
("Jerry", "Bask", 6, 5),
("Terri", "Bonnino", 7, null),
("Kali", "Arrington", 8, 7);

SELECT * FROM department;
SELECT * FROM role;

SELECT * FROM employee;