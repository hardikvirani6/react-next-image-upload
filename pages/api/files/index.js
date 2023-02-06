import dbConnect from "../../../lib/dbConnect";
import file from "../../../models/File";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const files = await file.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: files });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const files = await file.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: files });
      } catch (error) {
        console.log("error api :>> ", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
