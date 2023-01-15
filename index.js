const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "subject",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

app.get("/", (req, res) => {
  res.send("Its working Fine-Subject Microservice");
});

app.get("/subjectList", (req, res) => {
  mysqlConnection.query("SELECT * FROM subject_info", (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
        res.json({
            'status' : 200,
            'data' : {
                'data' : rows,
                'message' : 'Successfully Fetched Records'
            }
        })
    }
  });
});

app.post("/subject", (req, res) => {
  const reqBody = req.body;
  mysqlConnection.query(
    "INSERT INTO subject.subject_info (name, books_name) VALUES (?,?);",
    [reqBody.name, reqBody.booksName],
    (err, results, fields) => {
      if(err){
        console.log(err);
        res.send(`There has been an error ${err}`);
      } else {
        res.json({
            'status' : 200,
            'data': {
                'message' : 'Record Inserted Successfully!!',
                'data': results
            }
        })
      }
    }
  );
});

app.get("/subject/:id", (req, res) => {
    const reqParams = req.params;
    mysqlConnection.query(
      "Select * From subject.subject_info where id = ? ;",
      [reqParams.id],
      (err, results, fields) => {
        if(err){
          console.log(err);
          res.send(`There has been an error ${err}`);
        } else {
          res.json({
              'status' : 200,
              'data': {
                  'message' : 'Record Fteched Successfully!!',
                  'data': results
              }
          })
        }
      }
    );
  });
  
app.listen(8082);
