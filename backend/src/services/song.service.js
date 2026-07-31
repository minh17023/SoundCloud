import Song from '../models/song.model.js';
import supabase from '../config/supabase.js';

export const uploadSong = async (audioFile, imageFile, title, artist, genre, userId) => {
  if (!supabase) {
    throw new Error('Supabase credentials not configured for storage.');
  }

  // Upload Audio
  const audioExt = audioFile.originalname.split('.').pop();
  const audioName = `${Date.now()}-audio-${Math.random().toString(36).substring(7)}.${audioExt}`;
  const audioPath = `songs/${audioName}`;

  const { error: audioError } = await supabase.storage
    .from('audio-files')
    .upload(audioPath, audioFile.buffer, { contentType: audioFile.mimetype });

  if (audioError) throw new Error(`Audio upload failed: ${audioError.message}`);

  const { data: audioUrlData } = supabase.storage.from('audio-files').getPublicUrl(audioPath);
  const audioUrl = audioUrlData.publicUrl;

  // Upload Image (Optional)
  let imageUrl = null;
  if (imageFile) {
    const imgExt = imageFile.originalname.split('.').pop();
    const imgName = `${Date.now()}-img-${Math.random().toString(36).substring(7)}.${imgExt}`;
    const imgPath = `covers/${imgName}`;

    const { error: imgError } = await supabase.storage
      .from('image-files')
      .upload(imgPath, imageFile.buffer, { contentType: imageFile.mimetype });

    if (imgError) throw new Error(`Image upload failed: ${imgError.message}`);
    
    const { data: imgUrlData } = supabase.storage.from('image-files').getPublicUrl(imgPath);
    imageUrl = imgUrlData.publicUrl;
  }

  // Save to database
  const newSong = await Song.create({
    title,
    artist,
    genre,
    audio_url: audioUrl,
    cover_image: imageUrl,
    user_id: userId,
  });

  return newSong;
};

export const getSongs = async () => {
  return await Song.findAll({
    order: [['createdAt', 'DESC']],
    include: ['uploader']
  });
};

export const getSongById = async (id) => {
  return await Song.findByPk(id, {
    include: [
      { association: 'uploader', attributes: ['id', 'username', 'avatar'] }
    ]
  });
};
