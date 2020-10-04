const db = require("../models");
const Student = db.students;

// Create and Save a new Student
exports.create = (req, res) => {
    // Create a Student
    const student = new Student({
        studentName: req.body.studentName,
        gender: req.body.gender,
        age: req.body.age,
        result: req.body.result
    });
    // Save Student in the database
    student
    .save(student)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the Student."
        });
    });
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
    Student.find(condition)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving students."
        });
    });
};

// Find a single Student with an id
exports.findOne = (req, res) => {
  
};

// Update a Student by the id in the request
exports.update = (req, res) => {
  
};

// Delete a Student with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Student.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
        });
      } else {
        res.send({
          message: "Student was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id
      });
    });
};

// Delete all Student from the database.
exports.deleteAll = (req, res) => {
    Student.deleteMany({})
    .then(data => {
        res.send({
            message: `${data.deletedCount} Students were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all students."
        });
    });
};

// Find all published Student
exports.findAllPublished = (req, res) => {
  
};