const { Int32, Double } = require("mongodb");

module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
          studentName: String,
          gender: String,
          age: Number,
            result: String
        }
    );
    
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Student = mongoose.model("student", schema);
    return Student;
  };