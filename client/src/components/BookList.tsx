import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, LibraryBooks as LibraryBooksIcon } from '@mui/icons-material';
import BookSearch from './BookSearch';

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

interface BookListProps {
  books: Book[];
  loading: boolean;
  isAdmin?: boolean;
  onSearch: (searchParams: any) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onBorrow?: (bookId: number) => void;
  onViewHistory?: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  loading,
  isAdmin = false,
  onSearch,
  onEdit,
  onDelete,
  onBorrow,
  onViewHistory
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <BookSearch onSearch={onSearch} />
      
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
                {isAdmin ? (
                  <>
                    {onEdit && (
                      <IconButton size="small" color="primary" onClick={() => onEdit(book)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" color="error" onClick={() => onDelete(book.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {onViewHistory && (
                      <IconButton size="small" color="info" onClick={() => onViewHistory(book)}>
                        <LibraryBooksIcon />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <>
                    {onBorrow && book.availableCopies > 0 && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onBorrow(book.id)}
                      >
                        Borrow
                      </Button>
                    )}
                    {book.availableCopies === 0 && (
                      <Typography variant="body2" color="error">
                        Not Available
                      </Typography>
                    )}
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No books available
        </Typography>
      )}
    </>
  );
};

export default BookList; 