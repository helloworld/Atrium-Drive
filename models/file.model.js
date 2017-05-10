let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const FileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true
    },
    filetype: {
      type: String,
      required: true
    },
    url: {
      type: String, 
      required: true, 
    },
    created_at: Date,
    user_id: Schema.Types.ObjectId
  },
  schemaOptions
);

module.exports = mongoose.model("File", FileSchema);
