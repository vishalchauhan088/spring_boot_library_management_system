import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
}

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  isbn: '',
  genre: '',
  publisher: '',
  publicationYear: new Date().getFullYear(),
  totalCopies: 1,
  availableCopies: 1,
  description: '',
};

const ManageBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.content);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        publisher: book.publisher,
        publicationYear: book.publicationYear,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        description: book.description,
      });
      setEditingBookId(book.id);
    } else {
      setFormData(initialFormData);
      setEditingBookId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setEditingBookId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'publicationYear' || name === 'totalCopies' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const bookData = {
        ...formData,
        availableCopies: editingBookId ? formData.availableCopies : formData.totalCopies // Set availableCopies equal to totalCopies for new books
      };

      if (editingBookId) {
        await api.put(`/books/${editingBookId}`, bookData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', bookData);
        toast.success('Book added successfully');
      }
      handleCloseDialog();
      fetchBooks();
    } catch (error: any) {
      console.error('Error submitting book:', error);
      const errorMessage = error.response?.data?.message || 
                          (editingBookId ? 'Failed to update book' : 'Failed to add book');
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${bookId}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error: any) {
        console.error('Error deleting book:', error);
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Manage Books
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Book
        </Button>
      </Box>

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Author: {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN: {book.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {book.genre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publisher: {book.publisher}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {book.publicationYear}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available: {book.availableCopies} / {book.totalCopies}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(book)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(book.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBookId ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Publication Year"
              name="publicationYear"
              type="number"
              value={formData.publicationYear}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Total Copies"
              name="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Available Copies"
              name="availableCopies"
              type="number"
              value={formData.availableCopies}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBookId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {books.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No books available
        </Typography>
      )}
    </Container>
  );
};

export default ManageBooks; 