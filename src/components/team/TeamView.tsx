import React, { useState } from 'react';
import { Shield, Plus, Mail, UserCheck, Trash2, CheckCircle2, UserPlus } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';

export const TeamView: React.FC = () => {
  const { teamMembers, inviteTeamMember } = useCRM();
  const { addToast } = useToast();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteTitle, setInviteTitle] = useState('Account Executive');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    inviteTeamMember(inviteName, inviteEmail, inviteRole, inviteTitle);
    addToast('Invitation Sent', `${inviteName} was invited as ${inviteRole}.`);
    setIsInviteOpen(false);
    setInviteName(''); setInviteEmail('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Team & Role-Based Access Control
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {teamMembers.length} Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage teammates, deal owners, sales reps, project collaborators, and permission tiers.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <div 
            key={member.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm overflow-hidden border border-slate-200">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                  <p className="text-xs text-slate-500">{member.title || 'Collaborator'}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                member.role === 'member' ? 'bg-indigo-100 text-indigo-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {member.role}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{member.email}</span>
              </p>
              {member.phone && (
                <p className="text-slate-500">{member.phone}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-600">Active</strong></span>
              <span>2FA Enabled</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Invite Team Member</h2>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="maya@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={e => setInviteTitle(e.target.value)}
                    placeholder="Senior Consultant"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Permission Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="member">Member (CRUD)</option>
                    <option value="admin">Admin (All Access)</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
