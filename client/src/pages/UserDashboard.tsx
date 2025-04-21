import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { RootState } from '../store';
import api from '../api/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
}

interface Borrowing {
  id: number;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

const UserDashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await api.get('/borrowings/user');
        setBorrowings(response.data.content);
      } catch (error) {
        setError('Error fetching your borrowings');
      }
    };

    fetchBorrowings();
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Borrowed Books
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Borrow Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowings.map((borrowing) => (
                    <TableRow 
                      key={borrowing.id}
                      sx={{
                        backgroundColor: 
                          borrowing.status === 'OVERDUE' ? 'error.light' :
                          borrowing.status === 'RETURNED' ? 'success.light' :
                          'inherit'
                      }}
                    >
                      <TableCell>{borrowing.book.title}</TableCell>
                      <TableCell>{borrowing.book.author}</TableCell>
                      <TableCell>{new Date(borrowing.borrowDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(borrowing.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{borrowing.status}</TableCell>
                    </TableRow>
                  ))}
                  {borrowings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        You haven't borrowed any books yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 