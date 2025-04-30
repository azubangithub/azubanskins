export interface Category {
    _id: string;
    name: string;
    path: string;
    parent: string | null;
}

export interface File {
    _id: string;
    name: string;
    path: string;
    category: Category;
    uploadDate: string;
} 