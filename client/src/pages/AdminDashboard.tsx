import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

interface Borrowing {
  id: number;
  user: {
    username: string;
  };
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

const AdminDashboard = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/borrowings');
      setBorrowings(response.data.content);
    } catch (error) {
      setError('Error fetching borrowings');
    }
  };

  const handleReturn = async (borrowingId: number) => {
    try {
      await api.post(`/borrowings/return/${borrowingId}`);
      setSuccess('Book returned successfully');
      fetchBorrowings();
    } catch (error) {
      setError('Error returning book');
    }
  };

  const handleAddBook = async () => {
    try {
      await api.post('/books', newBook);
      setSuccess('Book added successfully');
      setOpenDialog(false);
      setNewBook({});
    } catch (error) {
      setError('Error adding book');
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Book Borrowings</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
              >
                Add New Book
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Book</TableCell>
                    <TableCell>Borrow Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowings.map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell>{borrowing.user.username}</TableCell>
                      <TableCell>{borrowing.book.title}</TableCell>
                      <TableCell>{new Date(borrowing.borrowDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(borrowing.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{borrowing.status}</TableCell>
                      <TableCell>
                        {borrowing.status === 'BORROWED' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleReturn(borrowing.id)}
                          >
                            Mark as Returned
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newBook.title || ''}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Author"
              value={newBook.author || ''}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="ISBN"
              value={newBook.isbn || ''}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newBook.description || ''}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Genre"
              value={newBook.genre || ''}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Copies"
              type="number"
              value={newBook.totalCopies || ''}
              onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value), availableCopies: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBook} variant="contained" color="primary">
            Add Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 