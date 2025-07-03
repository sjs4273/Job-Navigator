// 📄 components/AnimatedStepper.jsx
import { Stepper, Step, StepLabel, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { steps } from '../mock/roadingCardMock';

export default function AnimatedStepper() {
  const [activeStep, setActiveStep] = useState(0); // 현재 단계 진행 중
  const [completedSteps, setCompletedSteps] = useState([]); // 체크된 단계들

  const stepDelays = [2000, 3000, 4000, 5000]; // 단계별 시간(ms)

  useEffect(() => {
    if (activeStep < 4) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, activeStep]);
        setActiveStep((prev) => prev + 1);
      }, stepDelays[activeStep]);

      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box sx={{ width: '80%', maxWidth: 800 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const isCompleted = completedSteps.includes(index);
              const isLoading =
                (!isCompleted && index === activeStep) || (index === 4 && activeStep === 4);

              return (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={
                      isLoading
                        ? () => <CircularProgress size={20} color="primary" />
                        : undefined
                    }
                    StepIconProps={{
                      style: {
                        color: isCompleted ? '#1976d2' : '#bbb',
                        transition: 'color 0.3s',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Box>
    </motion.div>
  );
}
