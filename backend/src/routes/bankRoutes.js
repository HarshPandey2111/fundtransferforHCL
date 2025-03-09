const express = require('express');
const router = express.Router();
const { loadBanksData, loadLinksData } = require('../utils/csvLoader');
const RoutingService = require('../services/routingService');

let routingService = null;


(async () => {
  try {
    const banks = await loadBanksData();
    const links = await loadLinksData();
    routingService = new RoutingService(banks, links);
    console.log('Routing service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize routing service:', error);
  }
})();


router.get('/', async (req, res) => {
  try {
    const banks = await loadBanksData();
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/fastestroute', async (req, res) => {
  try {
    const { fromBank, toBank } = req.body;
    
    if (!routingService) {
      return res.status(500).json({ message: 'Routing service not initialized' });
    }

    const result = routingService.findFastestRoute(fromBank, toBank);
    
    if (!result.path.length) {
      return res.status(404).json({ message: 'No route found' });
    }

    res.json({
      route: result.path.join(' -> '),
      time: result.time
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cheapest route
router.post('/cheapestroute', async (req, res) => {
  try {
    const { fromBank, toBank } = req.body;
    
    if (!routingService) {
      return res.status(500).json({ message: 'Routing service not initialized' });
    }

    const result = routingService.findCheapestRoute(fromBank, toBank);
    
    if (!result.path.length) {
      return res.status(404).json({ message: 'No route found' });
    }

    res.json({
      route: result.path.join(' -> '),
      cost: result.cost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 