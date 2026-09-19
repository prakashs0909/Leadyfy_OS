import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  UserCheck,
  Video,
  Clapperboard,
  CheckSquare,
  CreditCard,
  Receipt,
  DollarSign,
  HelpCircle,
  ShieldCheck,
  History,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'CLIENT';

  const ownerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Orders', path: '/orders', icon: Package },
    { name: 'Scripts', path: '/scripts', icon: FileText },
    { name: 'Creators', path: '/creators', icon: UserCheck },
    { name: 'Shoots', path: '/shoots', icon: Clapperboard },
    { name: 'Videos Pipeline', path: '/videos', icon: Video },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Creator Payouts', path: '/payouts', icon: DollarSign },
    { name: 'Support', path: '/support', icon: HelpCircle },
    { name: 'Employees', path: '/employees', icon: ShieldCheck },
    { name: 'Activity Logs', path: '/activity-logs', icon: History },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Orders', path: '/orders', icon: Package },
    { name: 'Scripts', path: '/scripts', icon: FileText },
    { name: 'Creators', path: '/creators', icon: UserCheck },
    { name: 'Shoots', path: '/shoots', icon: Clapperboard },
    { name: 'Videos Pipeline', path: '/videos', icon: Video },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Scripts', path: '/scripts', icon: FileText },
    { name: 'Creators', path: '/creators', icon: UserCheck },
    { name: 'Shoots', path: '/shoots', icon: Clapperboard },
    { name: 'Videos Pipeline', path: '/videos', icon: Video },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/client-portal', icon: LayoutDashboard },
    { name: 'Orders & Progress', path: '/orders', icon: Package },
    { name: 'Script Approvals', path: '/scripts', icon: FileText },
    { name: 'Video Reviews', path: '/videos', icon: Video },
    { name: 'Invoices & Billing', path: '/payments', icon: CreditCard },
    { name: 'Support Tickets', path: '/support', icon: HelpCircle },
  ];

  let navItems = ownerLinks;
  if (role === 'ADMIN') navItems = adminLinks;
  else if (role === 'EMPLOYEE') navItems = employeeLinks;
  else if (role === 'CLIENT') navItems = clientLinks;

  return (
    <aside className="w-64 bg-[#09090B] border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black font-extrabold text-lg">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-wider text-base text-zinc-100 flex items-center space-x-1">
              LEADYFY <span className="text-amber-500 font-bold ml-1">OS</span>
            </h1>
            <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-widest">
              Agency Operations
            </p>
          </div>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800/60 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Current Role:
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {role}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border-l-2 border-amber-500 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Tagline */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/30 text-[11px] text-zinc-500">
        <p className="line-clamp-2 leading-relaxed">
          Manage clients, production, creators, content and operations.
        </p>
      </div>
    </aside>
  );
}
