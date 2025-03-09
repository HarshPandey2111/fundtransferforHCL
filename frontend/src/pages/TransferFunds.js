import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
}));

function TransferFunds() {
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({ fromBank: '', toBank: '' });
  const [routes, setRoutes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/banks');
        setBanks(response.data);
      } catch (error) {
        setError('Failed to fetch banks');
      }
    };
    fetchBanks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [fastestRes, cheapestRes] = await Promise.all([
        axios.post('http://localhost:5001/api/banks/fastestroute', formData),
        axios.post('http://localhost:5001/api/banks/cheapestroute', formData),
      ]);
  
      setRoutes({ fastest: fastestRes.data, cheapest: cheapestRes.data });
    } catch (error) {
      setError('Failed to find routes');
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Find Optimal Transfer Routes
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Source Bank (BIC)</InputLabel>
            <Select
              name="fromBank"
              value={formData.fromBank}
              label="Source Bank (BIC)"
              onChange={handleChange}
              required
            >
              {banks.map((bank) => (
                <MenuItem key={bank.bic} value={bank.bic}>
                  {bank.bic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Destination Bank (BIC)</InputLabel>
            <Select
              name="toBank"
              value={formData.toBank}
              label="Destination Bank (BIC)"
              onChange={handleChange}
              required
            >
              {banks.map((bank) => (
                <MenuItem key={bank.bic} value={bank.bic}>
                  {bank.bic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Find Routes
          </Button>
        </form>

        {routes && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Fastest Route</Typography>
              <Typography>Path: {routes.fastest.route}</Typography>
              <Typography>Time: {routes.fastest.time} mins</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Cheapest Route</Typography>
              <Typography>Path: {routes.cheapest.route}</Typography>
              <Typography>Cost: ${routes.cheapest.cost}</Typography>
            </Paper>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </StyledPaper>
    </Container>
  );
}

export default TransferFunds;