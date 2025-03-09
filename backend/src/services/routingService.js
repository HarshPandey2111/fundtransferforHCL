class RoutingService {
  constructor(banks, links) {
    if (!banks || !banks.length) {
      throw new Error('No bank data provided');
    }
    if (!links || !links.length) {
      throw new Error('No link data provided');
    }

    this.banks = banks;
    this.links = links;
    this.graph = this.buildGraph();
    
    console.log(`Routing service initialized with ${banks.length} banks and ${links.length} links`);
  }

  buildGraph() {
    const graph = new Map();


    this.banks.forEach(bank => {
      graph.set(bank.bic, new Map());
    });


    let linkCount = 0;
    this.links.forEach(link => {
      if (graph.has(link.fromBic) && graph.has(link.toBic)) {
        graph.get(link.fromBic).set(link.toBic, {
          time: link.time,
          cost: this.getBankCharge(link.toBic)
        });
        linkCount++;
      } else {
        console.warn(`Invalid link: ${link.fromBic} -> ${link.toBic}`);
      }
    });

    console.log(`Graph built with ${graph.size} nodes and ${linkCount} edges`);
    return graph;
  }

  getBankCharge(bic) {
    const bank = this.banks.find(b => b.bic === bic);
    if (!bank) {
      console.warn(`Bank charge not found for BIC: ${bic}`);
      return Infinity;
    }
    return bank.charge;
  }

  validateBanks(start, end) {
    if (!this.graph.has(start)) {
      throw new Error(`Invalid source bank: ${start}`);
    }
    if (!this.graph.has(end)) {
      throw new Error(`Invalid destination bank: ${end}`);
    }
  }

  findShortestPath(start, end, metric = 'time') {
    this.validateBanks(start, end);

    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();


    this.graph.forEach((_, node) => {
      distances.set(node, Infinity);
      unvisited.add(node);
    });
    distances.set(start, 0);

    while (unvisited.size > 0) {

      let current = null;
      let minDistance = Infinity;
      unvisited.forEach(node => {
        if (distances.get(node) < minDistance) {
          minDistance = distances.get(node);
          current = node;
        }
      });

      if (current === null || current === end) break;

      unvisited.delete(current);


      this.graph.get(current).forEach((value, neighbor) => {
        if (!unvisited.has(neighbor)) return;
        
        const alt = distances.get(current) + (metric === 'time' ? value.time : value.cost);
        if (alt < distances.get(neighbor)) {
          distances.set(neighbor, alt);
          previous.set(neighbor, current);
        }
      });
    }


    const path = [];
    let current = end;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    if (path.length <= 1 || path[0] !== start || path[path.length - 1] !== end) {
      throw new Error(`No valid route found from ${start} to ${end}`);
    }

    return {
      path: path,
      [metric]: distances.get(end)
    };
  }

  findFastestRoute(start, end) {
    try {
      return this.findShortestPath(start, end, 'time');
    } catch (error) {
      console.error('Error finding fastest route:', error.message);
      throw error;
    }
  }

  findCheapestRoute(start, end) {
    try {
      return this.findShortestPath(start, end, 'cost');
    } catch (error) {
      console.error('Error finding cheapest route:', error.message);
      throw error;
    }
  }
}

module.exports = RoutingService; 