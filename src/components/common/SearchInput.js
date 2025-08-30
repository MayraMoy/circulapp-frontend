// components/common/SearchInput.js - Input de búsqueda mejorado
import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';

const SearchInput = ({
  onSearch,
  placeholder = 'Buscar...',
  debounceMs = 300,
  initialValue = '',
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <TextField
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default SearchInput;
