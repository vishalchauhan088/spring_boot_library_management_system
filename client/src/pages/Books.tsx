import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books/search', {
        params: {
          title: searchTerm,
        },
      });
      setBooks(response.data.content);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      await api.post(`/books/${bookId}/borrow`);
      toast.success('Book borrowed successfully');
      fetchBooks(); // Refresh the book list
    } catch (error) {
      toast.error('Failed to borrow book');
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(timeoutId);
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
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search books"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
        />
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
                  Available: {book.availableCopies} / {book.totalCopies}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleBorrow(book.id)}
                  disabled={book.availableCopies === 0}
                >
                  {book.availableCopies > 0 ? 'Borrow' : 'Not Available'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No books found
        </Typography>
      )}
    </Container>
  );
};

export default Books; 