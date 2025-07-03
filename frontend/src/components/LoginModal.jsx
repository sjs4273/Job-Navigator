import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SocialLoginButton from './SocialLoginButton';

export default function LoginModal({ open, onClose, setUserInfo }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          backgroundColor: theme.palette.background.paper,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 12, top: 12 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 0, pb: 3 }}>
        <Box textAlign="center" mb={2} mt={9}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            소셜 로그인
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            다양한 소셜 계정으로 로그인할 수 있어요. <br />
            로그인 후 모든 기능을 이용해보세요!
          </Typography>
        </Box>

        {/* ✅ onClose 전달 추가 */}
        <SocialLoginButton setUserInfo={setUserInfo} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
