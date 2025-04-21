import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  availableCopies: number;
  totalCopies: number;
}

interface SearchParams {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publicationYear: string;
  availableOnly: boolean;
  page: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    title: '',
    author: '',
    genre: '',
    publisher: '',
    publicationYear: '',
    availableOnly: false,
    page: 1,
  });

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await axios.get(`http://localhost:8080/api/books/search?${params.toString()}`);
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
    }));
  };

  const handleGenreChange = (e: SelectChangeEvent<string>) => {
    setSearchParams(prev => ({
      ...prev,
      genre: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: value,
    }));
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Library Books
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search by Title"
              name="title"
              value={searchParams.title}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search by Author"
              name="author"
              value={searchParams.author}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={searchParams.genre}
                label="Genre"
                onChange={handleGenreChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography color="text.secondary">
                  by {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {book.genre}
                </Typography>
                <Typography variant="body2">
                  Available: {book.availableCopies} / {book.totalCopies}
                </Typography>
                <Button
                  component={Link}
                  to={`/books/${book.id}`}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={searchParams.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default BookList; 