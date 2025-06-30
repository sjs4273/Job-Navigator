import { Card, CardContent, Typography } from '@mui/material';

export default function MyBookmarkCard({ job }) {
  const post = job.job_post; // Bookmark 객체 안에 실제 job 정보

  return (
    <Card sx={{ mb: 2, p: 1.5, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.company} · {post.location}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          📅 마감: {post.due_date_text || '미정'}
        </Typography>
      </CardContent>
    </Card>
  );
}
