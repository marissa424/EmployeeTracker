INSERT INTO department(department_name)
VALUES ("Engineering"),
    ("Legal"),
    ("Sales"),
    ("Human Resources"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", 3),
("Salesperson", "80000", 3),
("Lead Engineers", "150000", 1),
("Software Engineer", "120000", 1),
("Account Manager", "160000", 5),
("Accountant", "110000", 5),
("Legal Team Lead", "225000", 2),
("Lawyer", "180000", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brooklyn", "Costello", 1, null),
("Shantel", "Peterson", 2, 1),
("Annika", "Long", 3, null),
("Beckham", "Clark", 4, 3),
("Danielle", "Kunz", 5, null),
("Cody", "Arrington", 6, 5),
("Billy", "Rizo", 7, null),
("Jack", "Sorenson", 8, 7);

SELECT * FROM department;
SELECT * FROM role;

SELECT * FROM employee;