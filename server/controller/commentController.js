const Comment = require("../model/Comment");
const { getUserNameFromJWT } = require("../middleware/auth")

// get all comments posted in the activity by location id
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

// post a comment in the activity
exports.postUserComments = async (req, res) => {
  const comment = req.body;

  comment.author = getUserNameFromJWT(req.cookies.jwt)
  console.log('comment author', comment.author)

  try {
    const result = await Comment.create(comment);
    res.status(200).send("Added comment: " + comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving comment", error: error.message });
  }
};
