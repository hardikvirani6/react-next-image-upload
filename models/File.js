import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  // url: {
  //   type: String,
  // },
  createdDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
  },
  type: {
    type: String,
  },
});

export default mongoose.models.file || mongoose.model("file", FileSchema);
