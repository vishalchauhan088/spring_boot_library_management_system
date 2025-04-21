import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Pagination } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import BookList from '../components/BookList';
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

interface SearchParams {
  query?: string;
  genre?: string;
  author?: string;
  publisher?: string;
  yearFrom?: number;
  yearTo?: number;
  available?: boolean;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchBooks = async (params: SearchParams = {}, pageNumber = 0) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (params.query) queryParams.append('query', params.query);
      if (params.genre) queryParams.append('genre', params.genre);
      if (params.author) queryParams.append('author', params.author);
      if (params.publisher) queryParams.append('publisher', params.publisher);
      if (params.yearFrom) queryParams.append('yearFrom', params.yearFrom.toString());
      if (params.yearTo) queryParams.append('yearTo', params.yearTo.toString());
      if (params.available) queryParams.append('available', params.available.toString());
      
      // Add pagination parameters
      queryParams.append('page', pageNumber.toString());
      queryParams.append('size', '9');
      queryParams.append('sort', 'title,asc');

      const response = await api.get(`/books/search?${queryParams.toString()}`);
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(pageNumber);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    fetchBooks(params, 0);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    fetchBooks(searchParams, value - 1);
  };

  const handleBorrow = async (bookId: number) => {
    try {
      await api.post(`/books/${bookId}/borrow`);
      toast.success('Book borrowed successfully');
      fetchBooks(searchParams, page); // Refresh the current page
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Books
        </Typography>
      </Box>

      <BookList
        books={books}
        loading={loading}
        isAdmin={false}
        onSearch={handleSearch}
        onBorrow={handleBorrow}
      />

      {books.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4} mb={4}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Books; 