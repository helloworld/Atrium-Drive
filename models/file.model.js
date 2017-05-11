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
    description: {
      type: String,
    },
    user_id: Schema.Types.ObjectId
  },
  schemaOptions
);


fileSchema.virtual('icon').get(function() {
    var extension_icon_map = {
      "txt": "file text", 
      "zip": "file archive outline", 
      "doc":  "file word outline",
      "docx": "file word outline",
      "ppt": "file powerpoint outline",
      "pptx": "file powerpoint outline",
      "png": "file image outline",
      "jpeg": "file image outline",
      "pdf": "file pdf outline",
    }
    let ext = this.get("filetype");
    let icon = extension_icon_map[ext] ? extension_icon_map[ext] : "file outline";
    return icon;
});

fileSchema.virtual('readable-date').get(function() {
    let date = moment(this.get("createdAt"));
    return date.calendar();
});



module.exports = mongoose.model("File", fileSchema);
