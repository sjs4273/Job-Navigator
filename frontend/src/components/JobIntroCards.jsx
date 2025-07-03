// 📄 components/JobIntroCardsRotating.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { roles } from '../mock/roadingCardMock';

export default function JobIntroCardsRotating() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 2500); // ✅ 2.5초 간격

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={roles[currentIndex].title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ width: 320, minHeight: 140, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {roles[currentIndex].title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {roles[currentIndex].description}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
