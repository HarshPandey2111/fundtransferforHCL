import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledIcon = styled('div')(({ theme }) => ({
  fontSize: 48,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
}));

const features = [
  {
    title: 'Transfer Funds',
    description: 'Send money to other banks with optimal routes for cost and time.',
    icon: <SwapHorizIcon fontSize="large" color="primary" />,
    path: '/transfer',
  },
  {
    title: 'Transaction History',
    description: 'View your past transactions and their status.',
    icon: <HistoryIcon fontSize="large" color="primary" />,
    path: '/history',
  },
  {
    title: 'Account Balance',
    description: 'Check your current account balance and recent activities.',
    icon: <AccountBalanceIcon fontSize="large" color="primary" />,
    path: '/dashboard',
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Fund Transfer System
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <StyledIcon>{feature.icon}</StyledIcon>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {feature.description}
              </Typography>
              <Button variant="contained" onClick={() => navigate(feature.path)}>
                Go to {feature.title}
              </Button>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
