import VideoModel from '../models/VideoModel.js';

export const uploadVideo = async (req, res) => {
  try {
    const doc = new VideoModel(req.body);
    const video = await doc.save();
    res.json(video);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Fail to create a videovideo',
    });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find().populate('user').exec();
    res.json(videos);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Can`t get videovideos',
    });
  }
};

export const updateViews = async (req, res) => {
  try {
    const videoId = req.params.id;
    await VideoModel.updateOne(
      {
        _id: videoId,
      },
      {
        views: req.body.views,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { userId } = req.body;
    const video = await VideoModel.findById(videoId);
    const isLiked = video.likes.get(userId);

    if (isLiked) {
      video.likes.delete(userId);
    } else {
      video.likes.set(userId, true);
    }

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      {
        _id: videoId,
      },
      { likes: video.likes },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
