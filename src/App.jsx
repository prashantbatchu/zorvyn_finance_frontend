import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const monthlyData = [
  { name: 'Jan', income: 8200,  expenses: 3100, profit: 5100 },
  { name: 'Feb', income: 9400,  expenses: 2900, profit: 6500 },
  { name: 'Mar', income: 7800,  expenses: 3400, profit: 4400 },
  { name: 'Apr', income: 11200, expenses: 2700, profit: 8500 },
  { name: 'May', income: 10400, expenses: 3200, profit: 7200 },
  { name: 'Jun', income: 13100, expenses: 2800, profit: 10300 },
  { name: 'Jul', income: 12000, expenses: 3500, profit: 8500 },
  { name: 'Aug', income: 14200, expenses: 3100, profit: 11100 },
  { name: 'Sep', income: 11800, expenses: 3800, profit: 8000 },
  { name: 'Oct', income: 15200, expenses: 2900, profit: 12300 },
  { name: 'Nov', income: 13900, expenses: 3150, profit: 10750 },
  { name: 'Dec', income: 16400, expenses: 3600, profit: 12800 },
];

const weeklyData = [
  { name: 'Mon', income: 1200, expenses: 400, profit: 800 },
  { name: 'Tue', income: 1800, expenses: 600, profit: 1200 },
  { name: 'Wed', income: 1400, expenses: 500, profit: 900 },
  { name: 'Thu', income: 2200, expenses: 700, profit: 1500 },
  { name: 'Fri', income: 1900, expenses: 450, profit: 1450 },
  { name: 'Sat', income: 900,  expenses: 300, profit: 600 },
  { name: 'Sun', income: 700,  expenses: 200, profit: 500 },
];

const allocations = [
  { name: 'Equities', value: 42, color: '#00D4AA' },
  { name: 'Bonds',    value: 28, color: '#3B82F6' },
  { name: 'Real Est', value: 18, color: '#F59E0B' },
  { name: 'Cash',     value: 12, color: '#F43F5E' },
];

const transactions = [
  { id: 1,  name: 'Stripe Inc.',    cat: 'Revenue',        amount: 5000,  date: 'Today, 09:41',    type: 'income' },
  { id: 2,  name: 'Amazon AWS',     cat: 'Infrastructure', amount: -340,  date: 'Today, 08:22',    type: 'expense' },
  { id: 3,  name: 'Consulting Fee', cat: 'Services',       amount: 1800,  date: 'Yesterday',       type: 'income' },
  { id: 4,  name: 'Figma',          cat: 'Design Tools',   amount: -45,   date: 'Yesterday',       type: 'expense' },
  { id: 5,  name: 'GitHub',         cat: 'Dev Tools',      amount: -21,   date: '2 days ago',      type: 'expense' },
  { id: 6,  name: 'Client Invoice', cat: 'Revenue',        amount: 3200,  date: '3 days ago',      type: 'income' },
  { id: 7,  name: 'Uber Eats',      cat: 'Transport',      amount: -38,   date: '3 days ago',      type: 'expense' },
  { id: 8,  name: 'Dividend',       cat: 'Investment',     amount: 420,   date: '5 days ago',      type: 'income' },
];

const stocks = [
  { sym: 'AAPL', price: 189.23, chg: 1.4,   sparkline: [182,185,183,187,186,188,189] },
  { sym: 'MSFT', price: 415.50, chg: 0.8,   sparkline: [408,410,412,409,413,414,415] },
  { sym: 'BTC',  price: 67200,  chg: -2.1,  sparkline: [69000,68500,68000,67800,67500,67300,67200] },
  { sym: 'ETH',  price: 3520,   chg: 3.2,   sparkline: [3400,3420,3460,3480,3510,3490,3520] },
  { sym: 'NVDA', price: 875.00, chg: 4.6,   sparkline: [835,845,850,860,855,870,875] },
];

const navItems = [
  { id: 'overview',     label: 'Overview',     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'transactions', label: 'Transactions', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'analytics',    label: 'Analytics',    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'wallets',      label: 'Wallets',      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'reports',      label: 'Reports',      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'settings',     label: 'Settings',     icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];




const AnalyticsPage = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
    <div className="chart-panel" style={S.panel}>
      <h3 style={S.panelTitle}>Market Volatility vs Portfolio</h3>
      <div style={{ height: 400, marginTop: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid stroke="#0F1928" vertical={false} />
            <XAxis dataKey="name" stroke="#2D3F55" fontSize={10} />
            <YAxis stroke="#2D3F55" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="stepAfter" dataKey="profit" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div style={S.panel}>
      <h3 style={S.panelTitle}>Live Market Watch</h3>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {stocks.map(s => (
          <div key={s.sym} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#111827', borderRadius: 12, border: '1px solid #1E2A3A' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{s.sym}</div>
              <div style={{ fontSize: 10, color: s.chg > 0 ? '#00D4AA' : '#F43F5E' }}>{s.chg > 0 ? '↑' : '↓'} {s.chg}%</div>
            </div>
            <Sparkline data={s.sparkline} color={s.chg > 0 ? '#00D4AA' : '#F43F5E'} />
            <div style={{ textAlign: 'right', fontWeight: 800, fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              ${s.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


const TransactionsPage = ({ txns, setTxns, searchTerm }) => {
  const filtered = txns.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const deleteTx = (id) => setTxns(prev => prev.filter(t => t.id !== id));

  return (
    <div className="bottom-panel" style={S.panel}>
      <div style={S.panelHeader}>
        <h3 style={S.panelTitle}>Complete Transaction Ledger</h3>
        <div style={{fontSize: 10, color: '#4A5568'}}>Showing {filtered.length} entries</div>
      </div>
      
      <div style={{ marginTop: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1E2A3A', color: '#4A5568', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <th style={{ padding: '12px 8px' }}>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => (
              <tr key={tx.id} className="tx-row" style={{ borderBottom: '1px solid #0F1928', fontSize: 13 }}>
                <td style={{ padding: '16px 8px', fontWeight: 700 }}>{tx.name}</td>
                <td><span style={S.badge(tx.type)}>{tx.cat}</span></td>
                <td style={{ color: '#4A5568', fontSize: 11, fontFamily: 'JetBrains Mono' }}>{tx.date}</td>
                <td style={{ fontWeight: 800, color: tx.type === 'income' ? '#00D4AA' : '#E8EDF5' }}>
                  {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}
                </td>
                <td>
                  <button onClick={() => deleteTx(tx.id)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0D1220', border: '1px solid #1E2A3A', borderRadius: 10, padding: '10px 14px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
      <p style={{ color: '#4A5568', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '2px 0' }}>{p.name}: ${p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

// ─── SPARKLINE ───────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, up }) => (
  <ResponsiveContainer width={72} height={28}>
    <LineChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  </ResponsiveContainer>
);

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  return <span>{prefix}{formatted}{suffix}</span>;
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const NewTransactionModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', amount: '', cat: 'Revenue', type: 'income' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.amount) return;
    onAdd({ id: Date.now(), name: form.name, cat: form.cat, amount: form.type === 'income' ? +form.amount : -Math.abs(+form.amount), date: 'Just now', type: form.type });
    onClose();
  };
  const inp = { background: '#111827', border: '1px solid #1E2A3A', borderRadius: 10, padding: '10px 14px', color: '#E8EDF5', fontSize: 13, width: '100%', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" };
  const lbl = { fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A5568', marginBottom: 6, display: 'block' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#0D1220', border: '1px solid #1E2A3A', borderRadius: 20, padding: 32, width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>New Transaction</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4A5568', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={lbl}>Merchant / Description</label><input name="name" value={form.name} onChange={handle} placeholder="e.g. Stripe Inc." style={inp} /></div>
          <div><label style={lbl}>Amount (USD)</label><input name="amount" type="number" value={form.amount} onChange={handle} placeholder="0.00" style={inp} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Category</label>
              <select name="cat" value={form.cat} onChange={handle} style={inp}>
                {['Revenue','Infrastructure','Services','Design Tools','Dev Tools','Transport','Investment'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Type</label>
              <select name="type" value={form.type} onChange={handle} style={inp}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <button onClick={submit} style={{ background: 'linear-gradient(135deg,#00D4AA,#3B82F6)', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', letterSpacing: '0.06em', marginTop: 4 }}>
            ADD TRANSACTION
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const container = useRef();
  const [activeNav, setActiveNav] = useState('overview');
  const [role, setRole] = useState('Admin');
  const [period, setPeriod] = useState('monthly');
  const [txns, setTxns] = useState(transactions);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clock, setClock] = useState('');
  const [chartTab, setChartTab] = useState('area');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.sidebar-shell', { x: -60, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.topbar-shell', { y: -30, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .from('.kpi-card', { y: 40, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.chart-panel', { y: 30, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.bottom-panel', { y: 30, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }, { scope: container });

  const chartData = period === 'monthly' ? monthlyData : weeklyData;
  const filteredTxns = txns.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.cat.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalIncome  = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));

  const S = {
    shell: { display: 'flex', height: '100vh', background: '#080C14', color: '#E8EDF5', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden' },

    // SIDEBAR
    sidebar: { width: sidebarOpen ? 220 : 72, background: '#0D1220', borderRight: '1px solid #1E2A3A', display: 'flex', flexDirection: 'column', padding: '24px 0', transition: 'width .3s ease', overflow: 'hidden', flexShrink: 0 },
    logoWrap: { display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 32px', overflow: 'hidden' },
    logoMark: { width: 34, height: 34, background: 'linear-gradient(135deg,#00D4AA,#3B82F6)', borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoText: { fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', cursor: 'pointer',
      transition: 'all .2s', position: 'relative', fontSize: 13, fontWeight: 600,
      color: active ? '#00D4AA' : '#4A5568', background: active ? 'rgba(0,212,170,.06)' : 'transparent',
      borderLeft: active ? '2px solid #00D4AA' : '2px solid transparent', whiteSpace: 'nowrap', overflow: 'hidden',
    }),
    sidebarFooter: { marginTop: 'auto', padding: '20px', borderTop: '1px solid #1E2A3A' },
    avatarRow: { display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' },
    avatar: { width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,212,170,.3),rgba(59,130,246,.3))', border: '1px solid #00D4AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#00D4AA', flexShrink: 0 },
    roleSwitch: { background: 'rgba(0,212,170,.1)', border: '1px solid rgba(0,212,170,.2)', borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 700, color: '#00D4AA', cursor: 'pointer', letterSpacing: '0.1em', whiteSpace: 'nowrap' },

    // MAIN
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid #1E2A3A', background: '#080C14', flexShrink: 0 },

    // CONTENT
    content: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 70 },
    kpiCard: (accent) => ({ background: '#0D1220', border: '1px solid #1E2A3A', borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', borderTop: `2px solid ${accent}`, transition: 'border-color .2s, transform .2s', cursor: 'default' }),
    kpiLabel: { fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A5568', marginBottom: 10 },
    kpiValue: { fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'JetBrains Mono', monospace" },
    kpiBadge: (up) => ({ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 8, fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", background: up ? 'rgba(16,185,129,.1)' : 'rgba(244,63,94,.1)', color: up ? '#10B981' : '#F43F5E' }),

    chartRow: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, marginBottom: 24 },
    panel: { background: '#0D1220', border: '1px solid #1E2A3A', borderRadius: 14, padding: '22px 24px' },
    panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    panelTitle: { fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' },
    panelSub: { fontSize: 10, color: '#4A5568', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" },

    bottomRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 },

    // TX
    txRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #0F1928', cursor: 'pointer', transition: '.15s' },
    txIcon: (type) => ({ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: type === 'income' ? 'rgba(0,212,170,.12)' : 'rgba(244,63,94,.1)', color: type === 'income' ? '#00D4AA' : '#F43F5E' }),

    // TABS
    tabs: { display: 'flex', gap: 2, background: '#111827', borderRadius: 8, padding: 3 },
    tab: (active) => ({ fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 6, cursor: 'pointer', color: active ? '#E8EDF5' : '#4A5568', background: active ? '#1E2A3A' : 'transparent', transition: '.15s', letterSpacing: '0.06em' }),

    badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: color === 'income' ? 'rgba(0,212,170,.1)' : 'rgba(244,63,94,.1)', color: color === 'income' ? '#00D4AA' : '#F43F5E' }),
  };

  const kpiCards = [
    { label: 'Total Equity',    value: 142500, prefix: ' ', accent: '#00D4AA', chg: '+12.4%', up: true  },
    { label: 'Monthly Revenue', value: totalIncome, prefix: '', accent: '#3B82F6', chg: '+8.1%', up: true  },
    { label: 'Monthly Expenses',value: totalExpense, prefix: ' ', accent: '#F43F5E', chg: '-5.2%', up: false },
    { label: 'Net Position',    value: totalIncome - totalExpense, prefix: ' ', accent: '#F59E0B', chg: '+3.7%', up: true  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{overflow:hidden;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1E2A3A;border-radius:4px;}
        .kpi-card:hover{transform:translateY(-3px);border-color:#2D3F55 !important;}
        .nav-item:hover{background:rgba(255,255,255,.03) !important;color:#E8EDF5 !important;}
        .tx-row:hover{background:#0F1928 !important;}
        .ptab:hover{color:#E8EDF5;}
        input::placeholder{color:#2D3F55;}
        select{appearance:none;}
      `}</style>

      {showModal && <NewTransactionModal onClose={() => setShowModal(false)} onAdd={tx => setTxns(p => [tx, ...p])} />}

      <div ref={container} style={S.shell}>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar-shell" style={S.sidebar}>
          <div style={S.logoWrap}>
            <div style={S.logoMark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            {sidebarOpen && <span style={S.logoText}>VELOCITY</span>}
          </div>

          <div style={{ padding: '0 12px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#2D3F55', textTransform: 'uppercase' }}>
            {sidebarOpen ? 'Workspace' : ''}
          </div>

          {navItems.slice(0, 5).map(item => (
            <div key={item.id} className="nav-item" style={S.navItem(activeNav === item.id)} onClick={() => setActiveNav(item.id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}

          <div style={{ margin: '12px 12px 0', padding: '8px 0', borderTop: '1px solid #1E2A3A' }} />
          <div style={{ padding: '0 12px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#2D3F55', textTransform: 'uppercase' }}>
            {sidebarOpen ? 'System' : ''}
          </div>
          {navItems.slice(5).map(item => (
            <div key={item.id} className="nav-item" style={S.navItem(activeNav === item.id)} onClick={() => setActiveNav(item.id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}

          <div style={S.sidebarFooter}>
            <div style={S.avatarRow}>
              <div style={S.avatar}>P</div>
              {sidebarOpen && (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Prashant</p>
                  <p style={{ fontSize: 10, color: '#4A5568' }}>{role}</p>
                </div>
              )}
              {sidebarOpen && (
                <button style={S.roleSwitch} onClick={() => setRole(r => r === 'Admin' ? 'Viewer' : 'Admin')}>
                  {role === 'Admin' ? 'ADMIN' : 'VIEW'}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={S.main}>

          {/* TOPBAR */}
          <div className="topbar-shell" style={S.topbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => setSidebarOpen(o => !o)} style={{ background: '#111827', border: '1px solid #1E2A3A', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <h1 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {activeNav === 'overview' ? 'Financial Overview' : navItems.find(n => n.id === activeNav)?.label}
                </h1>
                <p style={{ fontSize: 10, color: '#4A5568', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ background: '#111827', border: '1px solid #1E2A3A', borderRadius: 10, padding: '8px 12px 8px 28px', color: '#E8EDF5', fontSize: 12, outline: 'none', width: 220, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>

              {/* Clock */}
              <div style={{ background: '#111827', border: '1px solid #1E2A3A', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#4A5568' }}>
                {clock}
              </div>

              {/* Notification */}
              <div style={{ position: 'relative', width: 34, height: 34, background: '#111827', border: '1px solid #1E2A3A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: '#F43F5E', border: '1.5px solid #080C14' }} />
              </div>

              {/* New TX button (Admin only) */}
              {role === 'Admin' && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{ background: 'linear-gradient(135deg,#00D4AA,#3B82F6)', border: 'none', borderRadius: 10, padding: '9px 18px', color: '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}
                >
                  + NEW TX
                </button>
              )}
            </div>
          </div>

          {/* CONTENT */}
          {/* ... inside your main content div ... */}
            <div style={S.content}>
              {activeNav === 'overview' && (
                <>
                  <div style={S.kpiGrid}>
                                {kpiCards.map((k, i) => (
                                  <div key={i} className="kpi-card" style={S.kpiCard(k.accent)}>
                                    <div style={S.kpiLabel}>{k.label}</div>
                                    <div style={S.kpiValue}>
                                      <AnimatedNumber value={k.value} prefix={k.prefix} />
                                    </div>
                                    <div style={S.kpiBadge(k.up)}>
                                      {k.up ? '↑' : '↓'} {k.chg}
                                    </div>
                                    {/* Background glow */}
                                    <div style={{ position: 'absolute', top: 14, right: 16, width: 36, height: 36, borderRadius: 9, background: `${k.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: k.accent, opacity: 0.8 }} />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* CHART + ALLOCATION ROW */}
                              <div style={S.chartRow}>

                                {/* Main Chart Panel */}
                                <div className="chart-panel" style={S.panel}>
                                  <div style={S.panelHeader}>
                                    <div>
                                      <div style={S.panelTitle}>Capital Flow</div>
                                      <div style={S.panelSub}>Income · Expenses · Profit</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                      {/* Chart type */}
                                      <div style={S.tabs}>
                                        {['area', 'bar'].map(t => (
                                          <div key={t} className="ptab" style={S.tab(chartTab === t)} onClick={() => setChartTab(t)}>{t.toUpperCase()}</div>
                                        ))}
                                      </div>
                                      {/* Period */}
                                      <div style={S.tabs}>
                                        {[['weekly', '7D'], ['monthly', '12M']].map(([v, l]) => (
                                          <div key={v} className="ptab" style={S.tab(period === v)} onClick={() => setPeriod(v)}>{l}</div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Legend */}
                                  <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                                    {[['Income', '#00D4AA'], ['Expenses', '#F43F5E'], ['Profit', '#3B82F6']].map(([l, c]) => (
                                      <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4A5568' }}>
                                        <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                                      </span>
                                    ))}
                                  </div>

                                  <div style={{ height: 320 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      {chartTab === 'area' ? (
                                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                          <defs>
                                            {[['income','#00D4AA'], ['expenses','#F43F5E'], ['profit','#3B82F6']].map(([k, c]) => (
                                              <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                                                <stop offset="95%" stopColor={c} stopOpacity={0} />
                                              </linearGradient>
                                            ))}
                                          </defs>
                                          <CartesianGrid stroke="#0F1928" vertical={false} />
                                          <XAxis dataKey="name" stroke="#2D3F55" fontSize={10} tickLine={false} axisLine={false} />
                                          <YAxis stroke="#2D3F55" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${Math.round(v/1000)}k`} />
                                          <Tooltip content={<CustomTooltip />} />
                                          <Area type="monotone" dataKey="income"   stroke="#00D4AA" fill="url(#g-income)"   strokeWidth={2} dot={false} name="Income" />
                                          <Area type="monotone" dataKey="expenses" stroke="#F43F5E" fill="url(#g-expenses)" strokeWidth={2} dot={false} name="Expenses" />
                                          <Area type="monotone" dataKey="profit"   stroke="#3B82F6" fill="url(#g-profit)"   strokeWidth={2} dot={false} name="Profit" />
                                        </AreaChart>
                                      ) : (
                                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={6} barGap={2}>
                                          <CartesianGrid stroke="#0F1928" vertical={false} />
                                          <XAxis dataKey="name" stroke="#2D3F55" fontSize={10} tickLine={false} axisLine={false} />
                                          <YAxis stroke="#2D3F55" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${Math.round(v/1000)}k`} />
                                          <Tooltip content={<CustomTooltip />} />
                                          <Bar dataKey="income"   fill="#00D4AA" radius={[3,3,0,0]} name="Income" />
                                          <Bar dataKey="expenses" fill="#F43F5E" radius={[3,3,0,0]} name="Expenses" />
                                          <Bar dataKey="profit"   fill="#3B82F6" radius={[3,3,0,0]} name="Profit" />
                                        </BarChart>
                                      )}
                                    </ResponsiveContainer>
                                  </div>
                                </div>

                                {/* Allocation Panel */}
                                <div className="chart-panel" style={S.panel}>
                                  <div style={S.panelHeader}>
                                    <div>
                                      <div style={S.panelTitle}>Asset Allocation</div>
                                      <div style={S.panelSub}>Portfolio breakdown</div>
                                    </div>
                                  </div>

                                  <div style={{ height: 140, position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie data={allocations} innerRadius={44} outerRadius={62} dataKey="value" paddingAngle={3} strokeWidth={0}>
                                          {allocations.map((a, i) => <Cell key={i} fill={a.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0D1220', border: '1px solid #1E2A3A', borderRadius: 8, fontSize: 11 }} />
                                      </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center label */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>$142k</div>
                                      <div style={{ fontSize: 9, color: '#4A5568', letterSpacing: '0.1em' }}>TOTAL</div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                                    {allocations.map(a => (
                                      <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>{a.name}</span>
                                        <div style={{ flex: 1.5, height: 3, background: '#1E2A3A', borderRadius: 2, overflow: 'hidden' }}>
                                          <div style={{ width: `${a.value}%`, height: '100%', background: a.color, borderRadius: 2 }} />
                                        </div>
                                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: '#4A5568', width: 30, textAlign: 'right' }}>{a.value}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* BOTTOM ROW */}
                              <div style={S.bottomRow}>

                                {/* Transactions */}
                                <div className="bottom-panel" style={{ ...S.panel, gridColumn: 'span 2' }}>
                                  <div style={S.panelHeader}>
                                    <div>
                                      <div style={S.panelTitle}>Recent Transactions</div>
                                      <div style={S.panelSub}>{filteredTxns.length} entries · filtered</div>
                                    </div>
                                    <span style={{ fontSize: 10, color: '#3B82F6', cursor: 'pointer', fontWeight: 700 }}>View all →</span>
                                  </div>
                                  <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                                    {filteredTxns.map(tx => (
                                      <div key={tx.id} className="tx-row" style={S.txRow}>
                                        <div style={S.txIcon(tx.type)}>{tx.name[0]}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</p>
                                          <p style={{ fontSize: 9, color: '#4A5568', marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>{tx.cat}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: tx.type === 'income' ? '#00D4AA' : '#F43F5E' }}>
                                            {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                                          </p>
                                          <p style={{ fontSize: 9, color: '#2D3F55', marginTop: 2 }}>{tx.date}</p>
                                        </div>
                                        <div style={{ marginLeft: 12, flexShrink: 0 }}>
                                          <span style={S.badge(tx.type)}>{tx.type}</span>
                                        </div>
                                      </div>
                                    ))}
                                    {filteredTxns.length === 0 && (
                                      <p style={{ textAlign: 'center', color: '#2D3F55', fontSize: 12, padding: '24px 0', fontFamily: "'JetBrains Mono', monospace" }}>No results found</p>
                                    )}
                                  </div>
                                </div>

                                {/* Market Watch */}
                                <div className="bottom-panel" style={S.panel}>
                                  <div style={S.panelHeader}>
                                    <div>
                                      <div style={S.panelTitle}>Market Watch</div>
                                      <div style={S.panelSub}>{clock}</div>
                                    </div>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,.2)', animation: 'pulse 2s infinite' }} />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {stocks.map(s => (
                                      <div key={s.sym} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", width: 38, color: '#E8EDF5' }}>{s.sym}</span>
                                        <Sparkline data={s.sparkline} color={s.chg >= 0 ? '#00D4AA' : '#F43F5E'} up={s.chg >= 0} />
                                        <span style={{ flex: 1, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', color: '#E8EDF5' }}>
                                          {s.price >= 1000 ? `$${(s.price/1000).toFixed(1)}k` : `$${s.price}`}
                                        </span>
                                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", width: 44, textAlign: 'right', color: s.chg >= 0 ? '#10B981' : '#F43F5E' }}>
                                          {s.chg >= 0 ? '+' : ''}{s.chg}%
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>
                </>
              )}

              {activeNav === 'transactions' && (
    <div className="chart-panel" style={S.panel}>
      <div style={S.panelHeader}>
        <h3 style={S.panelTitle}>Transaction Ledger</h3>
        <span style={S.panelSub}>{filteredTxns.length} records found</span>
      </div>
      <div style={{ marginTop: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1E2A3A', color: '#4A5568', fontSize: 10, textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>Entity</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              {role === 'Admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTxns.map(tx => (
              <tr key={tx.id} className="tx-row" style={{ borderBottom: '1px solid #0F1928' }}>
                <td style={{ padding: '16px 12px', fontSize: 13, fontWeight: 700 }}>{tx.name}</td>
                <td><span style={S.badge(tx.type)}>{tx.cat}</span></td>
                <td style={{ fontSize: 11, color: '#4A5568', fontFamily: 'JetBrains Mono' }}>{tx.date}</td>
                <td style={{ fontSize: 13, fontWeight: 800, color: tx.amount > 0 ? '#00D4AA' : '#E8EDF5' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </td>
                {role === 'Admin' && (
                  <td>
                    <button 
                      onClick={() => setTxns(prev => prev.filter(t => t.id !== tx.id))}
                      style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 10, fontWeight: 800 }}
                    >
                      DELETE
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

              {activeNav === 'analytics' && (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Market Analysis</h3>
        <div style={{ height: 350, marginTop: 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#0F1928" vertical={false} />
              <XAxis dataKey="name" stroke="#2D3F55" fontSize={10} />
              <YAxis stroke="#2D3F55" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Watchlist</h3>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stocks.map(s => (
            <div key={s.sym} style={{ padding: 12, background: '#111827', borderRadius: 12, border: '1px solid #1E2A3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 12 }}>{s.sym}</div>
                <div style={{ fontSize: 10, color: s.chg > 0 ? '#00D4AA' : '#F43F5E' }}>{s.chg}%</div>
              </div>
              <Sparkline data={s.sparkline} color={s.chg > 0 ? '#00D4AA' : '#F43F5E'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

              {activeNav === 'wallets' && (
                <div style={S.panel}>
                  <h3 style={S.panelTitle}>Secure Wallets</h3>
                  <p style={{ color: '#4A5568', fontSize: 12, marginTop: 10 }}>Connect your hardware wallet to view balances.</p>
                  {/* Add static cards representing different banks or crypto wallets here */}
                </div>
              )}

              {/* REPORTS PAGE */}
{activeNav === 'reports' && (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
    
    {/* Monthly Summary Card */}
    <div style={S.panel} className="chart-panel">
      <div style={S.panelHeader}>
        <h3 style={S.panelTitle}>Monthly Performance Report</h3>
        <button style={{ ...S.roleSwitch, padding: '6px 12px' }}>Download PDF</button>
      </div>
      <div style={{ marginTop: 20 }}>
        {monthlyData.slice(-5).map((month, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #0F1928' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{month.name} 2026</div>
              <div style={{ fontSize: 10, color: '#4A5568' }}>{transactions.length} Transactions processed</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#00D4AA' }}>+${month.profit.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: '#F43F5E' }}>-${month.expenses.toLocaleString()} exp.</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Export & Categories Card */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={S.panel}>
        <h3 style={S.panelTitle}>Quick Export</h3>
        <p style={{ fontSize: 11, color: '#4A5568', margin: '8px 0 20px' }}>Generate a CSV of your financial activity for external tools.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button style={{ background: '#111827', border: '1px solid #1E2A3A', color: '#E8EDF5', padding: '12px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>CSV EXPORT</button>
          <button style={{ background: '#111827', border: '1px solid #1E2A3A', color: '#E8EDF5', padding: '12px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>JSON DATA</button>
        </div>
      </div>

      <div style={S.panel}>
        <h3 style={S.panelTitle}>Category Breakdown</h3>
        <div style={{ marginTop: 15 }}>
          {['Revenue', 'Infrastructure', 'Services'].map(cat => {
            const val = Math.abs(txns.filter(t => t.cat === cat).reduce((s, t) => s + t.amount, 0));
            const percentage = Math.min((val / totalIncome) * 100, 100);
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: '#4A5568', fontWeight: 600 }}>{cat}</span>
                  <span style={{ fontWeight: 800 }}>${val.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: 4, background: '#111827', borderRadius: 2 }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #00D4AA, #3B82F6)', borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}
{/* SETTINGS PAGE */}
{activeNav === 'settings' && (
  <div style={{ maxWidth: 800, margin: '0 auto' }}>
    <div style={S.panel} className="chart-panel">
      <div style={{ borderBottom: '1px solid #1E2A3A', paddingBottom: 20, marginBottom: 24 }}>
        <h3 style={S.panelTitle}>Account Settings</h3>
        <p style={S.panelSub}>Manage your profile and security preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Profile Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#E8EDF5' }}>Profile Information</h4>
            <p style={{ fontSize: 11, color: '#4A5568', marginTop: 4 }}>This will be displayed on your public profile.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ ...S.avatar, width: 64, height: 64, fontSize: 24 }}>P</div>
              <button style={{ ...S.roleSwitch, padding: '8px 16px' }}>Change Avatar</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Full Name</label>
                <input style={{ ...S.inp, width: '100%', background: '#111827' }} defaultValue="Prashant" />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Email Address</label>
                <input style={{ ...S.inp, width: '100%', background: '#111827' }} defaultValue="prashant@iiest.ac.in" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: '#1E2A3A' }} />

        {/* Security Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#E8EDF5' }}>Security</h4>
            <p style={{ fontSize: 11, color: '#4A5568', marginTop: 4 }}>Keep your account secure with 2FA.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#111827', borderRadius: 12, border: '1px solid #1E2A3A' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>Two-Factor Authentication</p>
                <p style={{ fontSize: 11, color: '#4A5568' }}>Add an extra layer of security to your account.</p>
              </div>
              <div style={{ width: 40, height: 20, background: '#00D4AA', borderRadius: 20, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 14, height: 14, background: '#fff', borderRadius: '50%', position: 'absolute', right: 3, top: 3 }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
          <button style={{ background: 'transparent', border: '1px solid #1E2A3A', color: '#4A5568', padding: '10px 24px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          <button style={{ background: 'linear-gradient(135deg,#00D4AA,#3B82F6)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>
  </div>
)}
            </div>
        </div>
      </div>
    </>
  );
}


