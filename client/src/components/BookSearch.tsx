import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';

interface BookSearchProps {
  onSearch: (searchParams: any) => void;
}

interface SearchParams {
  query: string;
  genre: string;
  author: string;
  publisher: string;
  yearFrom: string;
  yearTo: string;
  available: boolean;
}

const initialSearchParams: SearchParams = {
  query: '',
  genre: '',
  author: '',
  publisher: '',
  yearFrom: '',
  yearTo: '',
  available: false,
};

const BookSearch: React.FC<BookSearchProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = {
      ...searchParams,
      yearFrom: searchParams.yearFrom ? parseInt(searchParams.yearFrom) : null,
      yearTo: searchParams.yearTo ? parseInt(searchParams.yearTo) : null,
    };
    onSearch(params);
  };

  const handleReset = () => {
    setSearchParams(initialSearchParams);
    onSearch(initialSearchParams);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            name="query"
            value={searchParams.query}
            onChange={handleInputChange}
            placeholder="Search books by title, author, ISBN, genre..."
            size="small"
          />
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ ml: 1 }}
            color={showFilters ? 'primary' : 'default'}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                name="genre"
                label="Genre"
                value={searchParams.genre}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                name="author"
                label="Author"
                value={searchParams.author}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                name="publisher"
                label="Publisher"
                value={searchParams.publisher}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  name="yearFrom"
                  label="Year From"
                  type="number"
                  value={searchParams.yearFrom}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                />
                <TextField
                  name="yearTo"
                  label="Year To"
                  type="number"
                  value={searchParams.yearTo}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="available"
                    checked={searchParams.available}
                    onChange={handleInputChange}
                  />
                }
                label="Show only available books"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleReset} variant="outlined">
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Apply Filters
            </Button>
          </Box>
        </Collapse>
      </form>
    </Paper>
  );
};

export default BookSearch; 