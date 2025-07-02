// 📄 components/TabNavigation.jsx
import React from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import { User, Target, BookOpen } from 'lucide-react';

const tabs = [
  { id: 'skill-gap', label: '스킬 갭 분석', icon: <Target size={18} /> },
  { id: 'position-fit', label: '포지션 적합도', icon: <User size={18} /> },
  { id: 'roadmap', label: '학습 로드맵', icon: <BookOpen size={18} /> }
];

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
        aria-label="resume tab navigation"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Box display="flex" alignItems="center">
                {tab.icon}
                <span style={{ marginLeft: 6 }}>{tab.label}</span>
              </Box>
            }
            sx={{ textTransform: 'none', minHeight: 48, minWidth: 100 }}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default TabNavigation;
