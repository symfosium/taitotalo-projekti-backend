import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({post:postId}).populate('user','-passwordHash').exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ei pysty löytämään artikkelit',
    });
  }
};

export const addComment = async (req, res) => {
   try {
      const postId = req.params.id;
      const doc = new CommentModel();
      doc.user = req.userId;   
      doc.text = req.body.text;
      doc.likesCount = 0;
      doc.post = postId;

      const comment = await doc.save();
      comment.populate('user');
      res.json(comment);
   } catch (err) {
     console.log(err);
     res.status(500).json({
       message: 'Artikkeleja ei pysty ladata',
     });
   }
 };
