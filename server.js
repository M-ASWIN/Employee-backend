const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host:"bcg3emcubwg8s5qcxrhe-mysql.services.clever-cloud.com",
  user: "uklr3awgh5mfp8zm",
  password: "D9xXue5VOPE8ljCOg9Bz",
  database: "bcg3emcubwg8s5qcxrhe",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

app.post("/api/employees", (req, res) => {
  const { name, emp_id, department, dob, doj, gender, designation, salary } =
    req.body;
  const empdob = new Date(dob);
  const empdoj = new Date(doj);
  const currentDate = new Date();
  if (
    !name ||
    !emp_id ||
    !department ||
    !dob ||
    !doj ||
    !gender ||
    !designation ||
    !salary
  ) {
    return res.status(400).send("Incomplete form data");
  }
  if (name.length > 30) {
    return res.status(400).send("Employee name should be within 30 characters");
  }

  if (salary.length > 8) {
    return res.status(400).send("Salary should be within 8 digits");
  }
  const salary2 = Number(salary);
  if (salary2 < 10000 || salary2 > 9999999) {
    return res.status(400).send("Salary should be within 10000 and 9999999");
  }
  const thresholdDate = new Date("2005-01-01");
  const thresholdDate2 = new Date("1960-01-01");
  if (empdob > thresholdDate) {
    return res
      .status(400)
      .send("Date of Birth must be on or before January 1, 2005");
  }
  if (empdob < thresholdDate2) {
    return res
      .status(400)
      .send("Date of Birth must be on or after January 1, 1960");
  }

  const thresholdDate4 = new Date("2000-01-01");
  if (empdoj > currentDate) {
    return res
      .status(400)
      .send(
        `Date of Join must be on or before ${currentDate.toLocaleDateString()}`
      );
  }
  if (empdoj < thresholdDate4) {
    return res
      .status(400)
      .send("Date of Birth must be on or after January 1, 2000");
  }
  const joinage = empdoj.getFullYear() - empdob.getFullYear();
  if (joinage < 18) {
    return res.status(400).send("you can't join the job before 18 years");
  }
  const sql =
    "INSERT INTO employees (name, emp_id, department, dob, doj, gender, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [name, emp_id, department, dob, doj, gender, designation, salary],
    (err, result) => {
      if (err) {
        console.error("Error inserting employee data: " + err.message);
        return res.status(500).send("Failed to insert employee data");
      }
      console.log("Employee data inserted: ", result);
      return res.status(200).send("Employee data submitted successfully");
    }
  );
});

  app.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from employees where emp_id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) console.log(err);
    return res.json({ Status: true, Result: result });
  });
  });

  app.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employees";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
