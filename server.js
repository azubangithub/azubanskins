const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Створюємо папку для завантажень, якщо вона не існує
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Налаштування multer для завантаження файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const categoryPath = path.join(uploadDir, req.body.category || '');
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath, { recursive: true });
        }
        cb(null, categoryPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/azubanskins', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Схеми для MongoDB
const categorySchema = new mongoose.Schema({
    name: String,
    path: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
});

const fileSchema = new mongoose.Schema({
    name: String,
    path: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    uploadDate: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);
const File = mongoose.model('File', fileSchema);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API для категорій
app.post('/api/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().populate('parent');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API для файлів
app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            name: req.file.originalname,
            path: req.file.path,
            category: req.body.category
        });
        await file.save();
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files', async (req, res) => {
    try {
        const files = await File.find().populate('category');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files/category/:categoryId', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        const subcategories = await Category.find({ parent: category._id });
        const categoryIds = [category._id, ...subcategories.map(c => c._id)];
        
        const files = await File.find({ category: { $in: categoryIds } }).populate('category');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
}); 