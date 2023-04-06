const Comment = require("../model/Comment");

exports.getUserComments = async (req, res) => {
  const { LOCATION_ID } = req.params;

  try {
    const comments = await Comment.find({ location_id: LOCATION_ID });
    res.status(200).send(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

exports.postUserComments = async (req, res) => {
  const comment = req.body;

  try {
    const result = await Comment.create(comment);
    res.status(200).send("Added comment: " + comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving comment", error: error.message });
  }
};
