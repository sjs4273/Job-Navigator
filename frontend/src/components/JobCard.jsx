// components/JobCard.jsx
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Collapse,
  Divider,
  Chip,
  Stack,
  IconButton,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LoginRequiredDialog from '../components/LoginRequiredDialog';

function JobCard({ job, bookmarkIds = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (Array.isArray(bookmarkIds)) {
      setIsBookmarked(bookmarkIds.includes(job.id));
    }
  }, [bookmarkIds, job.id]);

  const handleBookmark = async () => {
    if (!token) {
      setOpenLoginDialog(true);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      if (isBookmarked) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks/${job.id}`,
          {
            method: 'DELETE',
            headers,
          }
        );
        if (!res.ok) throw new Error('삭제 실패');
        setIsBookmarked(false);
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ job_post_id: job.id }),
          }
        );
        if (!res.ok) throw new Error('추가 실패');
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('❌ 즐겨찾기 오류:', err);
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          p: 2,
          mb: 2,
          position: 'relative',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CardContent
            sx={{ flex: 1, paddingRight: 1, minWidth: 0, cursor: 'pointer' }}
            onClick={() => setExpanded(!expanded)}
          >
            <Typography variant="h6" fontWeight="bold" noWrap={!expanded}>
              {job.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {job.company} · {job.location}
            </Typography>
            <Typography variant="body2" mt={1} color="text.secondary">
              📅 마감: {job.due_date_text || '미정'}
            </Typography>
          </CardContent>

          <IconButton
            onClick={handleBookmark}
            sx={{ position: 'absolute', bottom: 12, right: 15 }}
          >
            {isBookmarked ? (
              <FavoriteIcon sx={{ color: '#6EA8FE' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: 'gray' }} />
            )}
          </IconButton>

          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 15,
              color: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 1 }} />
          <CardContent>
            <Typography variant="body2" gutterBottom>
              <strong>직무:</strong> {job.job_type || '정보 없음'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>경력:</strong> {job.experience || '무관'}
            </Typography>
            {Array.isArray(job.tech_stack) && job.tech_stack.length > 0 && (
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>기술 스택:</strong>
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {job.tech_stack.map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech.trim()}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </>
            )}
          </CardContent>
        </Collapse>
      </Card>

      {/* ✅ 로그인 필요 Snackbar 추가 */}
      {/* 로그인 요구 Dialog */}
      <LoginRequiredDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
      />
    </>
  );
}

export default JobCard;
