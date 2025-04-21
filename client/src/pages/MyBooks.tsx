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
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface BorrowedBook {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  borrowDate: string;
  dueDate: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

const MyBooks = () => {
  const [borrowings, setBorrowings] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/borrowings/my');
      setBorrowings(response.data.content);
    } catch (error) {
      toast.error('Failed to fetch borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowingId: number) => {
    try {
      await api.post(`/borrowings/return/${borrowingId}`);
      toast.success('Book returned successfully');
      fetchBorrowings();
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
      <Typography variant="h4" component="h1" gutterBottom>
        My Borrowed Books
      </Typography>

      <Grid container spacing={3}>
        {borrowings.map((borrowing) => (
          <Grid item xs={12} sm={6} md={4} key={borrowing.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {borrowing.book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Author: {borrowing.book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN: {borrowing.book.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Borrowed: {formatDate(borrowing.borrowDate)}
                </Typography>
                <Typography
                  variant="body2"
                  color={borrowing.status === 'OVERDUE' ? 'error' : 'text.secondary'}
                >
                  Due: {formatDate(borrowing.dueDate)}
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    borrowing.status === 'OVERDUE'
                      ? 'error'
                      : borrowing.status === 'RETURNED'
                      ? 'success'
                      : 'text.secondary'
                  }
                >
                  Status: {borrowing.status}
                </Typography>
              </CardContent>
              <CardActions>
                {borrowing.status === 'BORROWED' && isAdmin && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleReturn(borrowing.id)}
                  >
                    Return Book
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {borrowings.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't borrowed any books yet
        </Typography>
      )}
    </Container>
  );
};

export default MyBooks; 