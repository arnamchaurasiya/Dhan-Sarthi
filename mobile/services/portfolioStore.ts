import { DEFAULT_HOLDINGS, DEFAULT_TRANSACTIONS, Holding, Transaction, getPortfolioSummary, getAssetBreakdown } from '../screens/darpan/darpanData';

type Listener = () => void;

class PortfolioStore {
  private holdings: Holding[] = [...DEFAULT_HOLDINGS];
  private transactions: Transaction[] = [...DEFAULT_TRANSACTIONS];
  private listeners: Set<Listener> = new Set();

  public getHoldings(): Holding[] {
    return this.holdings;
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getSummary() {
    return getPortfolioSummary(this.holdings);
  }

  public getAssetBreakdown() {
    return getAssetBreakdown(this.holdings);
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public buyAsset(data: {
    symbol: string;
    name: string;
    price: number;
    units: number;
    amount: number;
    asset_class: string;
    broker?: string;
    sector?: string;
  }) {
    const existingIndex = this.holdings.findIndex(
      (h) => h.symbol.toUpperCase() === data.symbol.toUpperCase()
    );

    const brokerName = data.broker || 'Dhan Sarthi (Direct)';
    const totalSpent = data.amount > 0 ? data.amount : data.price * data.units;
    const unitQty = data.units > 0 ? data.units : (data.price > 0 ? totalSpent / data.price : 1);
    const unitPrice = data.price > 0 ? data.price : totalSpent / unitQty;

    if (existingIndex >= 0) {
      const current = this.holdings[existingIndex];
      const newQty = current.quantity + unitQty;
      const newTotalValue = current.total_value + totalSpent;
      const newAvgPrice = (current.avg_price * current.quantity + totalSpent) / newQty;

      this.holdings[existingIndex] = {
        ...current,
        quantity: Math.round(newQty * 100) / 100,
        avg_price: Math.round(newAvgPrice * 100) / 100,
        total_value: Math.round(newTotalValue * 100) / 100,
        current_price: unitPrice,
      };
    } else {
      const newHolding: Holding = {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        asset_class: data.asset_class,
        broker: brokerName,
        quantity: Math.round(unitQty * 100) / 100,
        avg_price: Math.round(unitPrice * 100) / 100,
        current_price: Math.round(unitPrice * 100) / 100,
        total_value: Math.round(totalSpent * 100) / 100,
        day_change: 1.2,
        sparkline: [unitPrice * 0.95, unitPrice * 0.97, unitPrice * 0.98, unitPrice, unitPrice * 1.01, unitPrice * 1.02],
        isin: `INE${Math.floor(100000000 + Math.random() * 900000000)}`,
        stcg: 0,
        ltcg: 0,
        day_high: Math.round(unitPrice * 1.05 * 100) / 100,
        day_low: Math.round(unitPrice * 0.95 * 100) / 100,
        sector: data.sector || 'Diversified',
        portfolio_weight: 5.0,
      };
      this.holdings = [newHolding, ...this.holdings];
    }

    // Recalculate weights
    const overallValue = this.holdings.reduce((acc, h) => acc + h.total_value, 0);
    this.holdings = this.holdings.map((h) => ({
      ...h,
      portfolio_weight: Math.round((h.total_value / overallValue) * 1000) / 10,
    }));

    // Add new Transaction record
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const monthStr = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newTx: Transaction = {
      id: `txn_${Date.now()}`,
      date: dateStr,
      month: monthStr,
      type: 'BUY',
      asset: data.symbol.toUpperCase(),
      asset_name: data.name,
      platform: brokerName,
      amount: Math.round(totalSpent),
      units: Math.round(unitQty * 100) / 100,
      price: Math.round(unitPrice * 100) / 100,
      fees: Math.round(totalSpent * 0.001),
      asset_class: data.asset_class,
      impact: `Purchased via Dhan Sarthi — Increased ${data.asset_class} allocation`,
    };

    this.transactions = [newTx, ...this.transactions];
    this.notify();
  }
}

export const portfolioStore = new PortfolioStore();
