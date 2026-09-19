import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/EmptyState';
import {
  Users,
  Package,
  FileText,
  Clapperboard,
  Video,
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingState message="Fetching live agency analytics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;

  const { kpis, pipelineBreakdown, widgets } = data;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 via-charcoal-900 to-[#111111] border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
              Executive & Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
              LIVE DATA
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time oversight of agency production, client pipelines, and financial profitability.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-950/80 px-4 py-2.5 rounded-xl border border-zinc-800">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-zinc-400 font-semibold uppercase">Estimated Net Profit</div>
            <div className="text-lg font-bold text-amber-400">
              ${kpis.estimatedNetProfit?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Top Financial & Production KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Active Clients"
          value={kpis.totalActiveClients}
          icon={Users}
          subtext={`+${kpis.newClients} new onboarded this month`}
        />
        <KpiCard
          title="Active Orders"
          value={kpis.activeOrders}
          icon={Package}
          subtext="Package campaigns in production"
        />
        <KpiCard
          title="Videos in Pipeline"
          value={kpis.videosInProduction}
          icon={Video}
          subtext={`${kpis.deliveredVideos} videos delivered total`}
        />
        <KpiCard
          title="Pending Approvals"
          value={kpis.pendingApprovals}
          icon={AlertCircle}
          subtext="Awaiting client sign-off"
          highlight={kpis.pendingApprovals > 0}
        />
        <KpiCard
          title="Monthly Revenue"
          value={`$${kpis.monthlyRevenue?.toLocaleString() || 0}`}
          icon={TrendingUp}
          trend="+18.4%"
        />
        <KpiCard
          title="Total Receivables"
          value={`$${kpis.totalReceivables?.toLocaleString() || 0}`}
          icon={DollarSign}
          subtext="Pending client invoice balances"
        />
        <KpiCard
          title="Monthly Expenses"
          value={`$${kpis.monthlyExpenses?.toLocaleString() || 0}`}
          icon={Receipt}
          subtext="Salaries, studio & equipment"
        />
        <KpiCard
          title="Estimated Net Profit"
          value={`$${kpis.estimatedNetProfit?.toLocaleString() || 0}`}
          icon={Zap}
          highlight={true}
          subtext="Revenue - Expenses - Creator Payouts"
        />
      </div>

      {/* Production Pipeline Breakdown Widget */}
      <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <Clapperboard className="w-4 h-4 text-amber-500" />
            <span>Core Video Production Pipeline (9 Stages)</span>
          </h3>
          <span className="text-xs text-zinc-500">Live Stage Counts</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {pipelineBreakdown.map((item, idx) => (
            <div
              key={item.stage}
              className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-center flex flex-col justify-between hover:border-amber-500/30 transition"
            >
              <span className="text-[10px] font-bold text-amber-400/90 font-mono">
                0{idx + 1}
              </span>
              <div className="text-lg font-bold text-zinc-100 my-1">{item.count}</div>
              <span className="text-[10px] text-zinc-400 font-medium line-clamp-2 leading-tight">
                {item.stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts & Operational Control Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Chart */}
        <div className="lg:col-span-2 p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Monthly Profitability Trend</h3>
              <p className="text-xs text-zinc-500">Revenue vs Operational Expenses vs Net Profit</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={widgets.monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#52525B" fontSize={11} />
                <YAxis stroke="#52525B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#F59E0B" fillOpacity={1} fill="url(#colorProfit)" name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Client Approvals Widget */}
        <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Action Required: Client Reviews</span>
              </h3>
              <span className="text-xs text-amber-400 font-bold">{widgets.pendingClientApprovals?.length || 0}</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {widgets.pendingClientApprovals?.map((v) => (
                <div key={v._id} className="p-2.5 bg-zinc-900/60 border border-zinc-800/80 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-200">{v.title}</div>
                    <div className="text-[10px] text-zinc-500">{v.client?.companyName}</div>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedules & Recent Activity Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Shoots */}
        <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Today's Shoots & Logistics</span>
          </h3>

          <div className="space-y-2">
            {widgets.todaysShoots?.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No shoots scheduled for today.</p>
            ) : (
              widgets.todaysShoots?.map((s) => (
                <div key={s._id} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-400">{s.time}</span>
                    <span className="text-zinc-300 ml-2 font-medium">{s.location}</span>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Creator: {s.creator?.name}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit Feed */}
        <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-zinc-100">Live Activity Audit Log</h3>
          <div className="space-y-2 max-h-52 overflow-y-auto divide-y divide-zinc-800/60">
            {widgets.recentActivity?.map((act) => (
              <div key={act._id} className="pt-2 text-xs flex items-start justify-between">
                <div>
                  <span className="font-bold text-zinc-200">{act.userName}</span>
                  <span className="text-zinc-400 ml-1.5">{act.details}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-2">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
