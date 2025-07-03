import { Stack, IconButton, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageGroup = Math.floor((currentPage - 1) / 5);
  const startPage = pageGroup * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <Stack direction="row" spacing={1} justifyContent="center" mt={5} mb={5}>
      {startPage > 1 && (
        <IconButton
          onClick={() => onPageChange(startPage - 1)}
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          sx={{
            minWidth: 36,
            height: 36,
            px: 0,
            borderRadius: '10px',
            backgroundColor: page === currentPage ? '#007BFF' : '#eee',
            color: page === currentPage ? '#fff' : '#555',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            '&:hover': {
              backgroundColor: page === currentPage ? '#0066cc' : '#ddd',
            },
            boxShadow:
              page === currentPage ? '0px 2px 6px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <IconButton
          onClick={() => onPageChange(endPage + 1)}
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Stack>
  );
}

export default Pagination;
