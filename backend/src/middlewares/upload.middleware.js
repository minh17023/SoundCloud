import multer from 'multer';

// Multer setup for memory storage (for direct stream to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;
