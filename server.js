const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io").listen(http);

var corsOptions = {
  origin: "http://localhost:8091"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
    let listStudents = [];
    //const emitFetchStudents = (socket) => socket.broadcast.emit("fetchStudents", listStudents);
    const emitFetchStudents = () => io.emit("fetchStudents", listStudents);
    io.on("connection", socket => {
        // New user visitted the frontend page, we send list of students to him/her
        emitFetchStudents();
    
        // Recieved an addNewStudent event
        socket.on("addNewStudent", ({ studentName, gender, age, result }) => {
            const newStudent = { studentName, gender, age, result };
            listStudents.push(newStudent);
            emitFetchStudents();
        });
    
        // Received clearAllStudents event
        socket.on("clearAllStudents", () => {
            listStudents = [];
            emitFetchStudents();
        });
    
        // Received removeStudent event
        socket.on("removeStudent", ({ studentIndex }) => {
            listStudents = listStudents.filter((student, idx) => idx !== studentIndex);
            emitFetchStudents();
        });
    });
});

require("./app/routes/student.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8090;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});