import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { RootState } from '../store';
import api from '../api/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  publisher: string;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        setError('Error fetching book details');
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      const response = await api.post(`/borrowings/borrow/${id}`);
      setSuccessMessage('Book borrowed successfully');
      setBook(prev => prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error borrowing book');
    }
  };

  if (!book) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                ISBN: {book.isbn}
              </Typography>
              <Typography variant="subtitle1">
                Genre: {book.genre}
              </Typography>
              <Typography variant="subtitle1">
                Publisher: {book.publisher}
              </Typography>
              <Typography variant="subtitle1">
                Publication Year: {book.publicationYear}
              </Typography>
              <Typography variant="subtitle1">
                Available Copies: {book.availableCopies} / {book.totalCopies}
              </Typography>
            </Box>

            {user && book.availableCopies > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleBorrow}
                fullWidth
              >
                Borrow Book
              </Button>
            )}

            {book.availableCopies === 0 && (
              <Alert severity="warning">
                No copies available for borrowing
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BookDetails; 