// components/LoginRequiredDialog.jsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function LoginRequiredDialog({ open, onClose }) {
  return (
    <Dialog
  open={open}
  onClose={onClose}
  maxWidth={false}
  fullWidth
  PaperProps={{
    sx: {
      width: '75vw',     // 🔹 모바일 기준 너비
      maxWidth: 350,     // 🔹 데스크탑 기준 최대 너비
    },
  }}
>
      <Box sx={{ position: 'relative', p: 2, pt: 1.5 }}>
        <IconButton
          onClick={onClose}
          edge="start"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="body2" fontSize="1.1rem" mt={0.5}>
            로그인 후 이용가능한 서비스입니다.
          </Typography>
          <Typography variant="body2" fontSize="1.1rem" mt={0.5}>
            로그인 하시겠습니까?
          </Typography>
        </Box>
      </Box>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={() => {
            onClose();
            window.location.href = '/login';
          }}
          variant="contained"
          size="medium"
  sx={{ minWidth: '100px' }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
