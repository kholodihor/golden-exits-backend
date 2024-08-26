import PostModel from '../models/PostModel.js';
import CommentModel from '../models/CommentModel.js';

export const create = async (req, res) => {
  try {
    const post = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      comments: [],
      likes: {},
      user: req.userId,
    });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fail to create post',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Can`t get a post',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOne(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Can`t return a post',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Can`t find a post',
          });
        }

        res.status(200).json(doc);
      }
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Can`t find posts',
    });
  }
};

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
            message: 'Fail to delete a post',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Can`t find a post',
          });
        }

        res.status(200).json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Can`t get posts',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        comments: [],
        likes: {},
      }
    );
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fail to update a post',
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const post = await PostModel.findById(postId);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return CommentModel.findById(comment).populate('user');
      })
    );
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong...' });
  }
};
