const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "bcg3emcubwg8s5qcxrhe-mysql.services.clever-cloud.com",
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
  const { name, emp_id, department, dob, gender, designation, salary } =
    req.body;

  if (
    !name ||
    !emp_id ||
    !department ||
    !dob ||
    !gender ||
    !designation ||
    !salary
  ) {
    return res.status(400).send("Incomplete form data");
  }

  if (name.length > 30) {
    return res.status(400).send("Employee name should be within 30 characters");
  }

  if (salary.toString().length > 8) {
    return res.status(400).send("Salary should be within 8 digits");
  }

  const sql =
    "INSERT INTO employees (name, emp_id, department, dob, gender, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [name, emp_id, department, dob, gender, designation, salary],
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
