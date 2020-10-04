const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io").listen(http);

// To adapt with heroku deployment
const PORT = process.env.PORT || 8090;
//const PORT = 8090;

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");


    let listStudents = [];
    //const emitFetchStudents = (socket) => socket.broadcast.emit("fetchStudents", listStudents);
    const emitFetchStudents = () => {
      db.students.find({}, function (err, result) {
        io.emit("fetchStudents", result);
      });
    }

    io.on("connection", socket => {
      // New user visitted the frontend page, we send list of students to him/her
      emitFetchStudents();

      // Recieved an addNewStudent event
      socket.on("addNewStudent", ({ studentName, gender, age, result }) => {
        var objNewStudent = { studentName: studentName, gender: gender, age: age[0], result: result };
        db.students.create(objNewStudent).then(() => {
          emitFetchStudents();
        }
        );
      });

      // Received clearAllStudents event
      socket.on("clearAllStudents", () => {
        db.students.deleteMany({})
          .then(data => {
            emitFetchStudents();
          });
      });

      // Received removeStudent event
      socket.on("removeStudent", ({ id }) => {
        db.students.findByIdAndRemove(id).then(() => {
          emitFetchStudents();
        });
      });
    });



  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
  });



http.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});