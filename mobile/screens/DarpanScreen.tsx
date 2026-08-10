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
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect, Text as SvgText, G, Line } from 'react-native-svg';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
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
  ChevronRight,
  Info,
  X,
  ExternalLink,
  RefreshCw,
  Award,
  User,
  LogOut,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_BASE = 'https://dhan-sarthi.onrender.com';

// Fallback holdings dataset with rich DPI & asset metadata
const DEFAULT_HOLDINGS = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    asset_class: 'Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 50,
    avg_price: 3500.0,
    current_price: 4364.0,
    total_value: 218200.0,
    day_change: -2.4,
    sparkline: [4364, 4320, 4290, 4280, 4250, 4210],
    isin: 'INE467B01029',
    stcg: 0,
    ltcg: 43200,
    day_high: 4400.0,
    day_low: 4200.0,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    asset_class: 'Equity',
    broker: 'Zerodha (CDSL)',
    quantity: 100,
    avg_price: 1600.0,
    current_price: 2181.97,
    total_value: 218197.0,
    day_change: -1.8,
    sparkline: [2181.97, 2170, 2150, 2140, 2120, 2100],
    isin: 'INE040A01034',
    stcg: 58197,
    ltcg: 0,
    day_high: 2200.0,
    day_low: 2090.0,
  },
  {
    symbol: 'PPFCF',
    name: 'Parag Parikh Flexi Cap Direct',
    asset_class: 'Mutual Funds',
    broker: 'Groww (CAMS)',
    quantity: 2500.5,
    avg_price: 45.0,
    current_price: 51.99,
    total_value: 130000.0,
    day_change: 0.9,
    sparkline: [50.5, 51.0, 51.2, 51.5, 51.8, 51.99],
    isin: 'INF879O01015',
    stcg: 0,
    ltcg: 17477,
    day_high: 52.2,
    day_low: 50.1,
  },
  {
    symbol: 'UTINIFTY',
    name: 'UTI Nifty 50 Index Fund Direct',
    asset_class: 'Mutual Funds',
    broker: 'Kuvera (KFintech)',
    quantity: 450.0,
    avg_price: 140.0,
    current_price: 151.91,
    total_value: 68362.0,
    day_change: 0.6,
    sparkline: [149.0, 149.8, 150.5, 151.2, 151.5, 151.91],
    isin: 'INF229K01018',
    stcg: 5362,
    ltcg: 0,
    day_high: 152.5,
    day_low: 148.5,
  },
  {
    symbol: 'INCREDBOND',
    name: 'InCred Financial 9.5% Bond',
    asset_class: 'Fixed Income',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 1,
    avg_price: 75000.0,
    current_price: 79345.0,
    total_value: 79345.0,
    day_change: 0.2,
    sparkline: [78500, 78700, 78900, 79100, 79250, 79345],
    isin: 'INE972X07012',
    stcg: 0,
    ltcg: 4345,
    day_high: 79500.0,
    day_low: 78400.0,
  },
  {
    symbol: 'SGB2030',
    name: 'Sovereign Gold Bonds (SGB 2030)',
    asset_class: 'Gold',
    broker: 'RBI Retail Direct',
    quantity: 8,
    avg_price: 6500.0,
    current_price: 6942.6,
    total_value: 55541.0,
    day_change: 0.8,
    sparkline: [6800, 6830, 6870, 6900, 6920, 6942.6],
    isin: 'IN0020210098',
    stcg: 0,
    ltcg: 3541,
    day_high: 6980.0,
    day_low: 6790.0,
  },
  {
    symbol: 'NEXUSREIT',
    name: 'Nexus Select Trust REIT',
    asset_class: 'REITs',
    broker: 'Dhan Sarthi (Direct)',
    quantity: 180,
    avg_price: 125.0,
    current_price: 132.25,
    total_value: 23805.0,
    day_change: 1.2,
    sparkline: [129.0, 130.0, 130.8, 131.5, 132.0, 132.25],
    isin: 'IN0020230018',
    stcg: 0,
    ltcg: 1305,
    day_high: 133.5,
    day_low: 128.8,
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
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState('1D');
  const [activePointIdx, setActivePointIdx] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHolding, setSelectedHolding] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

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

  // Robust asset category mapper checking symbol, asset_class, category, and type
  const mapAssetCategory = (h: any) => {
    const rawClass = (h?.asset_class || h?.category || h?.type || '').toString().toLowerCase();
    const sym = (h?.symbol || '').toString().toUpperCase();
    if (sym === 'TCS' || sym === 'HDFCBANK' || rawClass.includes('equity') || rawClass.includes('stock')) return 'Equity';
    if (sym.includes('PPFCF') || sym.includes('UTI') || rawClass.includes('mutual') || rawClass.includes('fund')) return 'Mutual Funds';
    if (sym.includes('BOND') || rawClass.includes('bond') || rawClass.includes('debt') || rawClass.includes('income')) return 'Fixed Income';
    if (sym.includes('SGB') || sym.includes('GOLD') || rawClass.includes('gold') || rawClass.includes('sgb')) return 'Gold';
    if (sym.includes('REIT') || rawClass.includes('reit') || rawClass.includes('invit') || rawClass.includes('estate')) return 'REITs';
    return 'Equity';
  };

  const TARGET_CATEGORIES = [
    { label: 'Equity', color: '#1b3a6b', key: 'Equity', targetPct: 55 },
    { label: 'Mutual Funds', color: '#2563eb', key: 'Mutual Funds', targetPct: 25 },
    { label: 'Fixed Income', color: '#14b8a6', key: 'Fixed Income', targetPct: 10 },
    { label: 'Gold', color: '#eab308', key: 'Gold', targetPct: 7 },
    { label: 'REITs', color: '#f97316', key: 'REITs', targetPct: 3 },
  ];

  const catSums: Record<string, number> = { Equity: 0, 'Mutual Funds': 0, 'Fixed Income': 0, Gold: 0, REITs: 0 };
  holdingsList.forEach((h: any) => {
    const c = mapAssetCategory(h);
    catSums[c] = (catSums[c] || 0) + (Number(h.total_value) || 0);
  });

  const totalSum = Object.values(catSums).reduce((a, b) => a + b, 0);

  const assetBreakdown = TARGET_CATEGORIES.map(cat => {
    let pct = 0;
    if (totalSum > 0 && catSums[cat.key] > 0) {
      pct = (catSums[cat.key] / totalSum) * 100;
    } else {
      pct = cat.targetPct;
    }
    return {
      ...cat,
      value: catSums[cat.key] > 0 ? catSums[cat.key] : (cat.targetPct * (totalNetWorth || 793450) / 100),
      percentage: pct,
    };
  });

  // Category filtering
  const filteredHoldings = selectedCategory === 'All'
    ? holdingsList
    : holdingsList.filter((h: any) => mapAssetCategory(h) === selectedCategory);

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
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.badgePill}>
              <ShieldCheck color="#ffffff" size={12} />
              <Text style={styles.heroBadgeText}>SEBI REGISTERED DPI</Text>
            </View>
            <Text style={styles.heroBadgeSub}>• Dhan Darpan</Text>
          </View>

          {/* USER PROFILE BUTTON */}
          <TouchableOpacity
            style={styles.userProfileBtn}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <User color="#1b3a6b" size={13} />
            </View>
            <Text style={styles.profileNameText}>Arnam</Text>
            <ChevronRight color="rgba(255,255,255,0.7)" size={12} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView} contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 4, alignItems: 'center' }}>
          {['All', 'Equity', 'Mutual Funds', 'Fixed Income', 'Gold', 'REITs'].map((cat) => (
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

        {/* Portfolio Distribution Section with Top-Bottom Orientation */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrap}>
              <PieChart color="#1b3a6b" size={18} />
            </View>
            <Text style={styles.cardTitle}>Asset Class Distribution</Text>
          </View>

          <View style={{ alignItems: 'center', marginTop: 12 }}>
            {/* Top Side: SVG Donut Pie Chart Centered */}
            <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
              <Svg width={180} height={180} viewBox="0 0 180 180">
                {(() => {
                  const validSlices = assetBreakdown.filter(a => a.percentage > 0);

                  if (validSlices.length === 1) {
                    const single = validSlices[0];
                    return (
                      <Circle
                        cx={90}
                        cy={90}
                        r={64}
                        fill="none"
                        stroke={single.color}
                        strokeWidth={26}
                      />
                    );
                  }

                  const totalPct = assetBreakdown.reduce((sum, a) => sum + a.percentage, 0) || 100;
                  let accumulatedAngle = -Math.PI / 2;
                  const cx = 90;
                  const cy = 90;
                  const outerR = 78;
                  const innerR = 48;

                  return assetBreakdown.map((item, idx) => {
                    const slicePct = item.percentage > 0 ? item.percentage : 0;
                    if (slicePct <= 0) return null;

                    const ratio = slicePct / totalPct;
                    const angle = ratio * 2 * Math.PI;

                    const startAngle = accumulatedAngle;
                    const endAngle = accumulatedAngle + angle;
                    accumulatedAngle = endAngle;

                    const gap = 0.025;
                    const adjStart = startAngle + gap;
                    const adjEnd = endAngle - gap;

                    const x1 = (cx + outerR * Math.cos(adjStart)).toFixed(2);
                    const y1 = (cy + outerR * Math.sin(adjStart)).toFixed(2);
                    const x2 = (cx + outerR * Math.cos(adjEnd)).toFixed(2);
                    const y2 = (cy + outerR * Math.sin(adjEnd)).toFixed(2);

                    const x3 = (cx + innerR * Math.cos(adjEnd)).toFixed(2);
                    const y3 = (cy + innerR * Math.sin(adjEnd)).toFixed(2);
                    const x4 = (cx + innerR * Math.cos(adjStart)).toFixed(2);
                    const y4 = (cy + innerR * Math.sin(adjStart)).toFixed(2);

                    const largeArcFlag = angle > Math.PI ? 1 : 0;

                    const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

                    const isSelected = selectedCategory === item.key;

                    return (
                      <Path
                        key={idx}
                        d={d}
                        fill={item.color}
                        opacity={selectedCategory === 'All' || isSelected ? 1 : 0.35}
                        onPress={() => setSelectedCategory(selectedCategory === item.key ? 'All' : item.key)}
                      />
                    );
                  });
                })()}
              </Svg>

              {/* Donut Center Metrics Overlay */}
              <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1b3a6b', textAlign: 'center' }}>
                  ₹{((totalNetWorth || 793450) / 100000).toFixed(1)} L
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#64748b', textAlign: 'center', marginTop: 2 }}>
                  Portfolio Mix
                </Text>
              </View>
            </View>

            {/* Bottom Side: Full Width Description / Legend List */}
            <View style={{ width: '100%', marginTop: 12 }}>
              {assetBreakdown.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.legendChip,
                    {
                      marginBottom: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 12,
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: selectedCategory === item.key ? '#1b3a6b' : '#e2e8f0'
                    },
                    selectedCategory === item.key && styles.legendChipActive
                  ]}
                  onPress={() => setSelectedCategory(selectedCategory === item.key ? 'All' : item.key)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.legendDot, { backgroundColor: item.color, width: 10, height: 10, borderRadius: 5, marginRight: 8 }]} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>
                      {item.label}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', marginRight: 10 }}>
                      ₹{item.value.toLocaleString('en-IN')}
                    </Text>
                    <View style={{ backgroundColor: item.color + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: item.color }}>
                        {item.percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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

      {/* USER PROFILE MODAL */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.profileAvatarLarge}>
                  <User color="#1b3a6b" size={22} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.profileModalTitle}>Arnam Chaurasiya</Text>
                  <View style={styles.verifiedBadgeRow}>
                    <CheckCircle2 color="#16a34a" size={12} />
                    <Text style={styles.verifiedBadgeText}>SEBI DPI Verified Investor</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.modalCloseBtn}>
                <X color="#64748b" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetailsContainer}>
              <View style={styles.profileDetailRow}>
                <Text style={styles.profileDetailLabel}>DPI Handle ID</Text>
                <Text style={styles.profileDetailVal}>DPI-2026-88910</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileDetailLabel}>Account Aggregator</Text>
                <View style={styles.activePillGreen}>
                  <CheckCircle2 color="#16a34a" size={12} />
                  <Text style={styles.activePillGreenText}>Sahamati AA Active</Text>
                </View>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileDetailLabel}>eKYC Status</Text>
                <View style={styles.activePillGreen}>
                  <ShieldCheck color="#16a34a" size={12} />
                  <Text style={styles.activePillGreenText}>SEBI KRA Verified</Text>
                </View>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileDetailLabel}>Investor Risk Profile</Text>
                <Text style={styles.profileDetailVal}>Aggressive Growth (85/100)</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileDetailLabel}>Linked FIP Accounts</Text>
                <Text style={styles.profileDetailVal}>Zerodha, CAMS, RBI Direct</Text>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.profileModalActions}>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  if (navigation) {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Auth' }],
                    });
                  }
                }}
              >
                <LogOut color="#dc2626" size={16} />
                <Text style={styles.logoutBtnText}>Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeProfileBtn}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.closeProfileBtnText}>Close Profile</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 22,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  profileNameText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  profileAvatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ebf3fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  profileModalTitle: {
    color: '#1b3a6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifiedBadgeText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileDetailsContainer: {
    marginVertical: 8,
  },
  profileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileDetailLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  profileDetailVal: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  activePillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activePillGreenText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  profileModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeProfileBtn: {
    flex: 1,
    backgroundColor: '#1b3a6b',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeProfileBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
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
    paddingBottom: 100,
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
    flexGrow: 0,
  },
  filterTab: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
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
