import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category, File } from './types';

const API_URL = 'http://localhost:5000/api';

const App: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchFiles(selectedCategory);
        } else {
            fetchAllFiles();
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
        }
    };

    const fetchFiles = async (categoryId: string) => {
        try {
            const response = await axios.get(`${API_URL}/files/category/${categoryId}`);
            setFiles(response.data);
        } catch (error) {
            console.error('Помилка при отриманні файлів:', error);
        }
    };

    const fetchAllFiles = async () => {
        try {
            const response = await axios.get(`${API_URL}/files`);
            setFiles(response.data);
        } catch (error) {
            console.error('Помилка при отриманні всіх файлів:', error);
        }
    };

    const handleCategoryCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/categories`, {
                name: newCategoryName,
                path: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
                parent: selectedCategory
            });
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error('Помилка при створенні категорії:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('category', selectedCategory || '');

            try {
                await axios.post(`${API_URL}/files`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (selectedCategory) {
                    fetchFiles(selectedCategory);
                } else {
                    fetchAllFiles();
                }
            } catch (error) {
                console.error('Помилка при завантаженні файлу:', error);
            }
        }
    };

    const copyImageUrl = (file: File) => {
        const url = `${window.location.origin}/${file.path}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">PNG Галерея</h1>
            
            <div className="grid grid-cols-4 gap-4">
                {/* Бокова панель з категоріями */}
                <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Категорії</h2>
                    <form onSubmit={handleCategoryCreate} className="mb-4">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Назва категорії"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Створити категорію
                        </button>
                    </form>
                    
                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full p-2 text-left rounded ${!selectedCategory ? 'bg-gray-200' : ''}`}
                        >
                            Всі файли
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)}
                                className={`w-full p-2 text-left rounded ${selectedCategory === category._id ? 'bg-gray-200' : ''}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Основна область з файлами */}
                <div className="col-span-3">
                    <div className="mb-4">
                        <input
                            type="file"
                            accept=".png"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {files.map((file) => (
                            <div key={file._id} className="relative group">
                                <img
                                    src={`/${file.path}`}
                                    alt={file.name}
                                    className="w-full h-48 object-contain border rounded"
                                    onClick={() => setSelectedFile(file)}
                                />
                                <button
                                    onClick={() => copyImageUrl(file)}
                                    className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Копіювати URL
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App; 