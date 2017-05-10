let mongoose = require("mongoose");
let moment = require("moment");

let Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const fileSchema = new Schema(
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
    icon: {
      type: String, 
      required: true, 
    },
    user_id: Schema.Types.ObjectId
  },
  schemaOptions
);

fileSchema.virtual('readable-date').get(function() {
    let date = moment(this.get("createdAt"));
    return date.calendar();
});

module.exports = mongoose.model("File", fileSchema);
