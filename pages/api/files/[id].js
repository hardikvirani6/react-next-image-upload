import dbConnect from "../../../lib/dbConnect";
import file from "../../../models/File";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const files = await file.findById(id);
        if (!files) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: files });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const files = await file.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!files) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: files });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedFile = await file.deleteOne({ _id: id });
        if (!deletedFile) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
