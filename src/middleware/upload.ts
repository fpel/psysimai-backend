import multer from 'multer';
// import path from 'path';
import os from 'os';

const storage = multer.diskStorage({
	destination: os.tmpdir(), // salva em diretório temporário
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

export const upload = multer({ storage });
