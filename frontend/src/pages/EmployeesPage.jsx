import React from 'react';
import { ShieldCheck, Mail, Phone, User } from 'lucide-react';

export default function EmployeesPage() {
  const employees = [
    {
      name: 'Elena Rostova',
      email: 'owner@leadyfy.com',
      role: 'OWNER',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      status: 'Active',
      department: 'Executive Leadership',
    },
    {
      name: 'Marcus Vance',
      email: 'admin@leadyfy.com',
      role: 'ADMIN',
      phone: '+1 (555) 018-9922',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      status: 'Active',
      department: 'Operations & Creator Logistics',
    },
    {
      name: 'Sarah Connor',
      email: 'employee@leadyfy.com',
      role: 'EMPLOYEE',
      phone: '+1 (555) 017-4411',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      status: 'Active',
      department: 'Post-Production & Video Editing',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span>Staff Directory & Roles</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage staff profiles, roles, assigned permissions, and operational performance indicators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.email} className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center space-x-3">
              <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-xl object-cover border border-amber-500/30" />
              <div>
                <h3 className="font-bold text-zinc-100 text-sm">{emp.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {emp.role}
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-400 space-y-1 pt-2 border-t border-zinc-800">
              <div className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{emp.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{emp.phone}</span>
              </div>
              <div className="text-[11px] text-zinc-500 pt-1">Dept: {emp.department}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
