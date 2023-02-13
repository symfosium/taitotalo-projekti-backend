import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getLastTags = async (req, res) => {
   try {
     const posts = await PostModel.find().limit(5).exec();
 
     const tags = posts
       .map((obj) => obj.tags)
       .flat()
       .slice(0, 5);
 
     res.json(tags);
   } catch (err) {
     console.log(err);
     res.status(500).json({
       message: 'Ei pysty lataa tagit',
     });
   }
 };

 // Getting all posts
 export const getAll = async (req, res) => {
   try {
    // populate - switching on connection with user so we can get info about user
     const posts = await PostModel.find().populate('user').exec();
     res.json(posts);
   } catch (err) {
     console.log(err);
     res.status(500).json({
       message: 'Ei pysty   artikkelit',
     });
   }
 };

 // Getting one post
 export const getOne = async (req, res) => {
   try {
     const postId = req.params.id;
    
     // Find Post and Update it
     PostModel.findOneAndUpdate(
       {
         _id: postId,
       },
       {  
        // Increasing viewcounts of Post
         $inc: { viewsCount: 1 },
       },
       {
         returnDocument: 'after',
       },
       (err, doc) => {
         if (err) {
           console.log(err);
           return res.status(500).json({
             message: 'Ei pysty lataamaan artikkelia',
           });
         }
 
         if (!doc) {
           return res.status(404).json({
             message: 'Artikkeli ei löydetty',
           });
         }
         res.json(doc);
       },
     ).populate('user');
   } catch (err) {
     console.log(err);
     res.status(500).json({
       message: 'Artikkeleja ei pysty ladata',
     });
   }
 };

 // Deleting post
export const remove = async (req, res) => {
   try {
     const postId = req.params.id;
 
     PostModel.findOneAndDelete(
       {
         _id: postId,
       },
       (err, doc) => {
         if (err) {
           console.log(err);
           return res.status(500).json({
             message: 'Artikkelin poistaminen ei onnistui',
           });
         }
 
         if (!doc) {
           return res.status(404).json({
             message: 'Artikkelia ei löydetty',
           });
         }
 
         res.json({
           success: true,
         });
       },
     );
   } catch (err) {
     console.log(err);
     res.status(500).json({
       message: 'Artikkeleja ei pysty saamaan',
     });
   }
};

// Creating Post
export const create = async (req, res) => {
   try {
      const doc = new PostModel({
         title:req.body.title,
         text:req.body.text,
         imageUrl:req.body.imageUrl,
         tags: req.body.tags.split(','),
         user: req.userId,
      });

      // Saving Post to db
      const post = await doc.save();

      res.json(post);
   } catch(err) {
                  // Error for dev
                  console.log(err)
                  // Message for user
                  res.status(500).json({
                     message: 'Artikkelin luominen ei onnistuu',
                  })
         }
   };

   // Updating post
export const update = async (req,res) => {
   try {
      const postId = req.params.id;

      await PostModel.updateOne({
         _id: postId,
      }, {
         title:req.body.title,
         text:req.body.text,
         imageUrl:req.body.imageUrl,
         tags: req.body.tags.split(','),
         user: req.userId,
      }, );

      res.json({
         success: true,
      })
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Artikkelin päivittäminen ei onnistunut',
      })
   }
}    