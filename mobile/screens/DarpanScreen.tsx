import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect, Text as SvgText, G, Line } from 'react-native-svg';
import axios from 'axios';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Filter,
  FileText,
  ChevronRight,
  Sparkles,
  Info,
  X,
  ExternalLink,
  RefreshCw,
  Award
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_BASE = 'https://dhan-sarthi.onrender.com';

// Fallback holdings dataset with rich DPI & asset metadata
const DEFAULT_HOLDINGS = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    asset_class: 'Direct Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 50,
    avg_price: 3500.0,
    current_price: 3821.0,
    total_value: 191050.0,
    day_change: -2.4,
    sparkline: [3821, 3790, 3750, 3740, 3730, 3710],
    isin: 'INE467B01029',
    stcg: 0,
    ltcg: 16050,
    day_high: 3840.0,
    day_low: 3705.0,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    asset_class: 'Direct Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 100,
    avg_price: 1600.0,
    current_price: 1910.5,
    total_value: 191050.0,
    day_change: -1.8,
    sparkline: [1910.5, 1900, 1890, 1885, 1875, 1860],
    isin: 'INE040A01034',
    stcg: 31050,
    ltcg: 0,
    day_high: 1925.0,
    day_low: 1855.0,
  },
  {
    symbol: 'PPFCF',
    name: 'Parag Parikh Flexi Cap Direct',
    asset_class: 'Mutual Funds',
    broker: 'Groww (CAMS)',
    quantity: 2500.5,
    avg_price: 65.0,
    current_price: 72.4,
    total_value: 181050.0,
    day_change: 0.9,
    sparkline: [70.5, 71.0, 71.2, 71.8, 72.0, 72.4],
    isin: 'INF879O01015',
    stcg: 0,
    ltcg: 18507,
    day_high: 72.6,
    day_low: 70.2,
  },
  {
    symbol: 'UTINIFTY',
    name: 'UTI Nifty 50 Index Fund Direct',
    asset_class: 'Mutual Funds',
    broker: 'Kuvera (KFintech)',
    quantity: 600.0,
    avg_price: 140.0,
    current_price: 148.83,
    total_value: 89300.0,
    day_change: 0.6,
    sparkline: [146.0, 146.8, 147.5, 147.2, 148.0, 148.83],
    isin: 'INF229K01018',
    stcg: 5298,
    ltcg: 0,
    day_high: 149.2,
    day_low: 145.8,
  },
  {
    symbol: 'INCREDBOND',
    name: 'InCred Financial 9.5% Bond',
    asset_class: 'Corporate Bonds',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 1,
    avg_price: 100000.0,
    current_price: 101000.0,
    total_value: 101000.0,
    day_change: 0.2,
    sparkline: [100500, 100600, 100700, 100800, 100900, 101000],
    isin: 'INE972X07012',
    stcg: 0,
    ltcg: 1000,
    day_high: 101100.0,
    day_low: 100400.0,
  },
  {
    symbol: 'NEXUSREIT',
    name: 'Nexus Select Trust REIT',
    asset_class: 'REITs & InvITs',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 300,
    avg_price: 130.0,
    current_price: 133.33,
    total_value: 40000.0,
    day_change: 1.2,
    sparkline: [131.0, 131.5, 132.0, 132.5, 133.0, 133.33],
    isin: 'IN0020230018',
    stcg: 0,
    ltcg: 999,
    day_high: 134.5,
    day_low: 130.8,
  }
];

const TIME_HORIZONS = ['1D', '1W', '1M', '6M', '1Y', 'ALL'];

const CHART_DATA_BY_TIMEFRAME: Record<string, { points: number[]; dates: string[]; gain: string; gainPct: string }> = {
  '1D': {
    points: [745210, 752000, 768000, 772500, 784000, 793450],
    dates: ['09:15', '10:30', '11:45', '13:00', '14:15', '15:30'],
    gain: '+₹48,240',
    gainPct: '+6.47%'
  },
  '1W': {
    points: [764000, 770000, 768500, 779000, 785000, 793450],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'],
    gain: '+₹29,450',
    gainPct: '+3.85%'
  },
  '1M': {
    points: [730000, 742000, 738000, 755000, 772000, 793450],
    dates: ['1 Jul', '8 Jul', '15 Jul', '22 Jul', '29 Jul', '4 Aug'],
    gain: '+₹63,450',
    gainPct: '+8.69%'
  },
  '6M': {
    points: [680000, 705000, 718000, 740000, 765000, 793450],
    dates: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug'],
    gain: '+₹1,13,450',
    gainPct: '+16.68%'
  },
  '1Y': {
    points: [610000, 635000, 660000, 690000, 735000, 793450],
    dates: ['Aug 25', 'Nov 25', 'Feb 26', 'May 26', 'Jul 26', 'Aug 26'],
    gain: '+₹1,83,450',
    gainPct: '+30.07%'
  },
  'ALL': {
    points: [500000, 540000, 590000, 650000, 720000, 793450],
    dates: ['2023', '2024 H1', '2024 H2', '2025 H1', '2025 H2', '2026'],
    gain: '+₹2,93,450',
    gainPct: '+58.69%'
  }
};

export default function DarpanScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState('1D');
  const [activePointIdx, setActivePointIdx] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHolding, setSelectedHolding] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Attempt real DPI consent fetch, fallback gracefully to mock data
    axios.post(`${API_BASE}/api/v1/mock-dpi/aa/consent`, {
      user_id: "user_123",
      fip_ids: ["fip_zerodha", "fip_cams"]
    }).then(res => {
      const handle = res.data.consent_handle;
      return axios.get(`${API_BASE}/api/v1/mock-dpi/aa/fetch-holdings/${handle}`);
    }).then(res => {
      if (res.data && res.data.data) {
        setData(res.data.data);
      } else {
        setData({ summary: { total_net_worth: 793450, todays_gain: 48240, todays_gain_percentage: 6.47 }, holdings: DEFAULT_HOLDINGS });
      }
      setLoading(false);
    }).catch(err => {
      console.log('Backend connection fallback: loading local DPI dataset', err?.message);
      setData({ summary: { total_net_worth: 793450, todays_gain: 48240, todays_gain_percentage: 6.47 }, holdings: DEFAULT_HOLDINGS });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1b3a6b" />
        <Text style={styles.loadingText}>Fetching unified portfolio via Sahamati AA...</Text>
      </View>
    );
  }

  const holdingsList = data?.holdings || DEFAULT_HOLDINGS;

  // Asset Distribution Calculations
  const totalNetWorth = holdingsList.reduce((acc: number, item: any) => acc + item.total_value, 0);

  const assetBreakdown = [
    { label: 'Direct Equity', color: '#1b3a6b', key: 'Direct Equity' },
    { label: 'Mutual Funds', color: '#3b82f6', key: 'Mutual Funds' },
    { label: 'Corporate Bonds', color: '#14b8a6', key: 'Corporate Bonds' },
    { label: 'REITs & InvITs', color: '#f59e0b', key: 'REITs & InvITs' },
  ].map(cat => {
    const val = holdingsList
      .filter((h: any) => h.asset_class === cat.key)
      .reduce((sum: number, h: any) => sum + h.total_value, 0);
    const pct = totalNetWorth > 0 ? (val / totalNetWorth) * 100 : 0;
    return { ...cat, value: val, percentage: pct };
  });

  // Category filtering
  const filteredHoldings = selectedCategory === 'All'
    ? holdingsList
    : holdingsList.filter((h: any) => h.asset_class === selectedCategory);

  // SVG Chart path calculation
  const timeframeInfo = CHART_DATA_BY_TIMEFRAME[selectedHorizon] || CHART_DATA_BY_TIMEFRAME['1D'];
  const chartPoints = timeframeInfo.points;
  const chartDates = timeframeInfo.dates;
  const svgWidth = Math.max(300, SCREEN_WIDTH - 64);
  const svgHeight = 120;

  const minPoint = Math.min(...chartPoints) * 0.97;
  const maxPoint = Math.max(...chartPoints) * 1.03;

  const pointCoords = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * svgWidth;
    const y = svgHeight - ((val - minPoint) / (maxPoint - minPoint)) * (svgHeight - 30) - 15;
    return { x, y, val, date: chartDates[idx] };
  });

  let linePathD = `M ${pointCoords[0].x} ${pointCoords[0].y}`;
  for (let i = 0; i < pointCoords.length - 1; i++) {
    const curr = pointCoords[i];
    const next = pointCoords[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    linePathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const fillAreaD = `${linePathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  const activeCoord = pointCoords[activePointIdx] || pointCoords[pointCoords.length - 1];

  const handleChartTouch = (locationX: number) => {
    if (svgWidth <= 0 || !chartPoints || chartPoints.length === 0) return;
    const clampedX = Math.max(0, Math.min(svgWidth, locationX));
    const ratio = clampedX / svgWidth;
    const nearestIdx = Math.round(ratio * (chartPoints.length - 1));
    const clampedIdx = Math.max(0, Math.min(chartPoints.length - 1, nearestIdx));
    setActivePointIdx(clampedIdx);
  };

  const handleOpenDetail = (holding: any) => {
    setSelectedHolding(holding);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* SEBI Saarthi Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.badgePill}>
            <ShieldCheck color="#ffffff" size={12} />
            <Text style={styles.heroBadgeText}>SEBI REGISTERED DPI</Text>
          </View>
          <Text style={styles.heroBadgeSub}>• Dhan Darpan</Text>
        </View>
        <Text style={styles.heroTitle}>Unified Portfolio Mirror</Text>
        <Text style={styles.heroSub}>Consolidated cross-broker holdings from NSDL, CDSL & CAMS</Text>
      </View>

      <View style={styles.contentPadding}>
        {/* Main Net Worth Header & Interactive Chart Card */}
        <View style={styles.mainNetWorthCard}>
          <View style={styles.netWorthTopRow}>
            <View>
              <Text style={styles.netWorthLabel}>Total Consolidated Net Worth</Text>
              <Text style={styles.netWorthValue}>₹{totalNetWorth.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.aaVerifiedChip}>
              <CheckCircle2 color="#16a34a" size={14} />
              <Text style={styles.aaVerifiedText}>AA Verified</Text>
            </View>
          </View>

          {/* Gain / Loss Badge */}
          <View style={styles.gainRow}>
            <View style={styles.gainBox}>
              <TrendingUp color="#16a34a" size={15} />
              <Text style={styles.gainText}>
                {' '}{timeframeInfo.gain} ({timeframeInfo.gainPct})
              </Text>
            </View>
            <Text style={styles.timeframeSubLabel}>in {selectedHorizon}</Text>
          </View>

          {/* Time Horizon Selector Pills */}
          <View style={styles.timeHorizonContainer}>
            {TIME_HORIZONS.map((horizon) => (
              <TouchableOpacity
                key={horizon}
                style={[
                  styles.horizonPill,
                  selectedHorizon === horizon && styles.horizonPillActive,
                ]}
                onPress={() => {
                  setSelectedHorizon(horizon);
                  setActivePointIdx(CHART_DATA_BY_TIMEFRAME[horizon].points.length - 1);
                }}
              >
                <Text
                  style={[
                    styles.horizonPillText,
                    selectedHorizon === horizon && styles.horizonPillTextActive,
                  ]}
                >
                  {horizon}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Live Values Header */}
          {activeCoord && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6, marginTop: 4 }}>
              <Text style={{ fontSize: 11, color: '#1b3a6b', fontWeight: 'bold' }}>
                ₹{activeCoord.val.toLocaleString('en-IN')}
              </Text>
              <Text style={{ fontSize: 10, color: '#64748b', marginLeft: 4, fontWeight: '500' }}>
                • {activeCoord.date}
              </Text>
            </View>
          )}

          {/* Interactive SVG Trend Chart */}
          <View
            style={styles.chartWrapper}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(evt) => handleChartTouch(evt.nativeEvent.locationX)}
            onResponderMove={(evt) => handleChartTouch(evt.nativeEvent.locationX)}
            onResponderRelease={(evt) => handleChartTouch(evt.nativeEvent.locationX)}
          >
            <Svg width={svgWidth} height={svgHeight}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                  <Stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Invisible Full Width Touch Target */}
              <Rect x={0} y={0} width={svgWidth} height={svgHeight} fill="transparent" />

              {/* Vertical Crosshair Scrubber Line */}
              {activeCoord && (
                <Line
                  x1={activeCoord.x}
                  y1={0}
                  x2={activeCoord.x}
                  y2={svgHeight}
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4, 4"
                />
              )}

              {/* Area Fill */}
              <Path d={fillAreaD} fill="url(#chartGradient)" />

              {/* Main Curve Line */}
              <Path d={linePathD} fill="none" stroke="#3b82f6" strokeWidth="3" />

              {/* Interactive Data Point Touch Triggers */}
              {pointCoords.map((pt, i) => (
                <G key={i} onPress={() => setActivePointIdx(i)}>
                  {/* Expanded 48px touch circle */}
                  <Circle cx={pt.x} cy={pt.y} r={24} fill="transparent" />
                  {i === activePointIdx && (
                    <Circle cx={pt.x} cy={pt.y} r={10} fill="#3b82f6" fillOpacity={0.25} />
                  )}
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === activePointIdx ? 6 : 3.5}
                    fill={i === activePointIdx ? '#ffffff' : '#3b82f6'}
                    stroke={i === activePointIdx ? '#1b3a6b' : '#3b82f6'}
                    strokeWidth={i === activePointIdx ? 3 : 1.5}
                  />
                </G>
              ))}
            </Svg>

            {/* Active Data Point Tooltip Callout */}
            {activeCoord && (
              <View
                pointerEvents="none"
                style={[
                  styles.chartTooltipCallout,
                  {
                    left: Math.min(Math.max(activeCoord.x - 55, 0), svgWidth - 110),
                    top: Math.max(activeCoord.y - 48, 0),
                  },
                ]}
              >
                <Text style={styles.tooltipValText}>₹{activeCoord.val.toLocaleString('en-IN')}</Text>
                <Text style={styles.tooltipDateText}>Time: {activeCoord.date}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Verified Multi-Asset Holdings Header & Category Filter Tabs */}
        <View style={styles.holdingsHeaderRow}>
          <Text style={styles.sectionTitle}>Verified Multi-Asset Holdings</Text>
          <View style={styles.holdingCountBadge}>
            <Text style={styles.holdingCountText}>{filteredHoldings.length} Assets</Text>
          </View>
        </View>

        {/* Holdings Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          {['All', 'Direct Equity', 'Mutual Funds', 'Corporate Bonds', 'REITs & InvITs'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterTab,
                selectedCategory === cat && styles.filterTabActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterTabText, selectedCategory === cat && styles.filterTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Holdings List with Sparklines Placed Below Money & Source Badges */}
        {filteredHoldings.map((h: any, idx: number) => {
          const defaultChanges: Record<string, number> = {
            'TCS': -2.4,
            'HDFCBANK': -1.8,
            'PPFCF': 0.9,
            'UTINIFTY': 0.6,
            'INCREDBOND': 0.2,
            'NEXUSREIT': 1.2
          };

          const rawChange = (typeof h.day_change === 'number' && !isNaN(h.day_change))
            ? h.day_change
            : (defaultChanges[h.symbol] !== undefined ? defaultChanges[h.symbol] : (idx < 2 ? -2.4 : 0.9));

          const isRed = rawChange < 0;
          const isPositive = !isRed;
          const changeVal = Math.abs(rawChange).toFixed(1);

          return (
            <TouchableOpacity
              key={idx}
              style={styles.holdingCardItem}
              onPress={() => handleOpenDetail(h)}
              activeOpacity={0.7}
            >
              <View style={styles.holdingCardLeft}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>{h.symbol.slice(0, 2)}</Text>
                </View>
                <View style={styles.holdingMeta}>
                  <Text style={styles.holdingSymbol}>{h.symbol}</Text>
                  <Text style={styles.holdingName} numberOfLines={1}>{h.name}</Text>
                  <View style={styles.sourceTag}>
                    <ShieldCheck color="#16a34a" size={10} />
                    <Text style={styles.sourceTagText}>{h.broker}</Text>
                  </View>
                </View>
              </View>

              {/* Right Value, Percentage & Sparkline Graph Below Money */}
              <View style={styles.holdingCardRight}>
                <Text style={styles.holdingValue}>₹{h.total_value.toLocaleString('en-IN')}</Text>
                
                {/* Written Percentage Row */}
                <View style={styles.dayChangeRow}>
                  {isPositive ? (
                    <TrendingUp color="#16a34a" size={12} />
                  ) : (
                    <TrendingDown color="#dc2626" size={12} />
                  )}
                  <Text style={[styles.dayChangeText, { color: isPositive ? '#16a34a' : '#dc2626' }]}>
                    {' '}{isPositive ? '+' : '-'}{changeVal}%
                  </Text>
                </View>

                {/* Sparkline Graph Placed Below Money */}
                <View style={{ marginTop: 4 }}>
                  <Svg width={54} height={18}>
                    <Path
                      d={isPositive
                        ? "M 0 14 C 10 14, 16 10, 24 9 C 32 8, 40 4, 54 2"
                        : "M 0 2 C 10 2, 16 6, 24 8 C 32 10, 40 14, 54 16"}
                      fill="none"
                      stroke={isPositive ? '#16a34a' : '#dc2626'}
                      strokeWidth="2.2"
                    />
                  </Svg>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Portfolio Distribution Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrap}>
              <PieChart color="#1b3a6b" size={18} />
            </View>
            <Text style={styles.cardTitle}>Asset Class Distribution</Text>
          </View>

          {/* Multi-Color Segmented Distribution Bar */}
          <View style={styles.distributionBarContainer}>
            {assetBreakdown.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.distributionBarSegment,
                  {
                    backgroundColor: item.color,
                    width: `${Math.max(item.percentage, 2)}%`,
                    borderTopLeftRadius: idx === 0 ? 8 : 0,
                    borderBottomLeftRadius: idx === 0 ? 8 : 0,
                    borderTopRightRadius: idx === assetBreakdown.length - 1 ? 8 : 0,
                    borderBottomRightRadius: idx === assetBreakdown.length - 1 ? 8 : 0,
                  },
                ]}
              />
            ))}
          </View>

          {/* Interactive Legend Chips */}
          <View style={styles.legendGrid}>
            {assetBreakdown.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.legendChip,
                  selectedCategory === item.key && styles.legendChipActive
                ]}
                onPress={() => setSelectedCategory(selectedCategory === item.key ? 'All' : item.key)}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendPct}>{item.percentage.toFixed(1)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Portfolio Health & Risk Intelligence Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrapAmber}>
              <Award color="#d97706" size={18} />
            </View>
            <Text style={styles.cardTitle}>Dhan Darpan Risk & Health Score</Text>
          </View>

          <View style={styles.healthScoreRow}>
            <Text style={styles.healthScoreText}>78</Text>
            <Text style={styles.healthScoreMax}> / 100</Text>
            <View style={styles.healthTagGood}>
              <Text style={styles.healthTagText}>GOOD DIVERSITY</Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <AlertTriangle color="#d97706" size={18} />
            <Text style={styles.warningText}>
              High concentration in Direct Equity (48.2%). Allocating 10–15% to REITs / InvITs or Fixed-Income Bonds can reduce overall volatility by ~14%.
            </Text>
          </View>
        </View>

        {/* Tax & ITR Insights Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrapTeal}>
              <FileText color="#0d9488" size={18} />
            </View>
            <Text style={styles.cardTitle}>Auto Capital Gains & Tax Summary (ITR)</Text>
          </View>

          <View style={styles.taxSummaryGrid}>
            <View style={styles.taxBox}>
              <Text style={styles.taxLabel}>STCG (Realized)</Text>
              <Text style={styles.taxValue}>₹36,348</Text>
              <Text style={styles.taxSub}>Taxable @ 20%</Text>
            </View>
            <View style={styles.taxBox}>
              <Text style={styles.taxLabel}>LTCG (Realized)</Text>
              <Text style={styles.taxValue}>₹36,556</Text>
              <Text style={styles.taxSubGreen}>Below ₹1.25L Exemption</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.exportBtn}>
            <Sparkles color="#ffffff" size={16} />
            <Text style={styles.exportBtnText}>Capital Gains Summary</Text>
          </TouchableOpacity>
        </View>

        {/* DPI Connected Data Sources Footer */}
        <View style={styles.dpiFooterCard}>
          <Text style={styles.dpiFooterTitle}>Connected Sahamati DPI Data Feeds</Text>
          <View style={styles.dpiSourcesRow}>
            {['NSDL', 'CDSL', 'CAMS RTA', 'KFintech'].map((feed, i) => (
              <View key={i} style={styles.dpiBadge}>
                <CheckCircle2 color="#16a34a" size={12} />
                <Text style={styles.dpiBadgeText}>{feed}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Holding Detail Interactive Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedHolding && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalSymbol}>{selectedHolding.symbol}</Text>
                    <Text style={styles.modalName}>{selectedHolding.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                    <X color="#64748b" size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalGrid}>
                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>Asset Class</Text>
                    <Text style={styles.modalStatVal}>{selectedHolding.asset_class}</Text>
                  </View>

                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>Depository / Source</Text>
                    <Text style={styles.modalStatVal}>{selectedHolding.broker}</Text>
                  </View>

                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>Current Value</Text>
                    <Text style={styles.modalStatVal}>₹{selectedHolding.total_value.toLocaleString('en-IN')}</Text>
                  </View>

                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>Units / Quantity</Text>
                    <Text style={styles.modalStatVal}>{selectedHolding.quantity}</Text>
                  </View>

                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>Avg Buy Price</Text>
                    <Text style={styles.modalStatVal}>₹{selectedHolding.avg_price}</Text>
                  </View>

                  <View style={styles.modalStatBox}>
                    <Text style={styles.modalStatLabel}>ISIN Code</Text>
                    <Text style={styles.modalStatVal}>{selectedHolding.isin || 'INE123456789'}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  centered: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },
  heroCard: {
    backgroundColor: '#1b3a6b',
    padding: 24,
    borderBottomRightRadius: 32,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  heroBadgeSub: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  contentPadding: {
    padding: 16,
  },

  /* Main Net Worth Card */
  mainNetWorthCard: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  netWorthTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  netWorthLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  netWorthValue: {
    color: '#1b3a6b',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 2,
  },
  aaVerifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  aaVerifiedText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  gainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  gainBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gainText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '700',
  },
  timeframeSubLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },

  /* Time Horizon Selector */
  timeHorizonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  horizonPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 9,
  },
  horizonPillActive: {
    backgroundColor: '#1b3a6b',
  },
  horizonPillText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  horizonPillTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  /* SVG Chart Wrapper */
  chartWrapper: {
    alignItems: 'center',
    position: 'relative',
    height: 120,
    justifyContent: 'center',
  },
  chartTooltipCallout: {
    position: 'absolute',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  tooltipValText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tooltipDateText: {
    color: '#94a3b8',
    fontSize: 9,
  },

  /* Standard Card */
  card: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconWrap: {
    padding: 6,
    backgroundColor: '#ebf3fa',
    borderRadius: 8,
    marginRight: 8,
  },
  cardIconWrapAmber: {
    padding: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    marginRight: 8,
  },
  cardIconWrapTeal: {
    padding: 6,
    backgroundColor: '#ccfbf1',
    borderRadius: 8,
    marginRight: 8,
  },
  cardTitle: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },

  /* Distribution Bar */
  distributionBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
  },
  distributionBarSegment: {
    height: '100%',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  legendChipActive: {
    borderColor: '#1b3a6b',
    backgroundColor: '#ebf3fa',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  legendPct: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Health Score */
  healthScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  healthScoreText: {
    color: '#d97706',
    fontSize: 32,
    fontWeight: 'bold',
  },
  healthScoreMax: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  healthTagGood: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  healthTagText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: 'bold',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  warningText: {
    color: '#92400e',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },

  /* Tax Summary */
  taxSummaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  taxBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  taxLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  taxValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  taxSub: {
    color: '#0d9488',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  taxSubGreen: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b3a6b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Holdings List Header & Filters */
  holdingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: 17,
    fontWeight: 'bold',
  },
  holdingCountBadge: {
    backgroundColor: '#ebf3fa',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  holdingCountText: {
    color: '#1b3a6b',
    fontSize: 12,
    fontWeight: '700',
  },
  filterScrollView: {
    marginBottom: 12,
  },
  filterTab: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#1b3a6b',
    borderColor: '#1b3a6b',
  },
  filterTabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  /* Holding Card Item */
  holdingCardItem: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  holdingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ebf3fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#1b3a6b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  holdingMeta: {
    flex: 1,
  },
  holdingSymbol: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  holdingName: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  sourceTagText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  sparklineWrap: {
    paddingHorizontal: 8,
  },
  holdingCardRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    color: '#1b3a6b',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dayChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dayChangeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* DPI Footer */
  dpiFooterCard: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  dpiFooterTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  dpiSourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  dpiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dpiBadgeText: {
    color: '#1e293b',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomColor: '#f1f5f9',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  modalSymbol: {
    color: '#1b3a6b',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalName: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  modalStatBox: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  modalStatLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  modalStatVal: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionGyaan: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebf3fa',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalActionGyaanText: {
    color: '#1b3a6b',
    fontSize: 13,
    fontWeight: '700',
  },
  modalActionMarg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b3a6b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalActionMargText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  }
});
