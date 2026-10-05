import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Database, Upload, ArrowRight } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { workspace, completeOnboarding } = useAuth();
  const { resetToMockData } = useCRM();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState(workspace.name || 'Studio Orbit');
  const [currency, setCurrency] = useState('₹');
  const [taxRate, setTaxRate] = useState(18);
  const [teamSize, setTeamSize] = useState('Solo Freelancer');
  const [businessFocus, setBusinessFocus] = useState('Freelancer / Agency');
  const [pastedJson, setPastedJson] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding({ workspaceName, currency, taxRate, teamSize });
      addToast('Onboarding Complete', 'Welcome to your tailored CRM workspace!');
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-700 pb-3">
          <span>Business Setup Wizard</span>
          <span className="text-indigo-400 font-bold">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Name Your CRM Workspace</h2>
              <p className="text-xs text-slate-400 mt-1">This will appear on your proposals, invoices, and client portals.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Workspace / Studio Name *</label>
              <input
                type="text"
                required
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                placeholder="e.g. Apex Digital Consulting"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Freelance Business Focus</label>
              <select
                value={businessFocus}
                onChange={e => setBusinessFocus(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Freelancer / Agency">Web & Mobile Engineering Agency</option>
                <option value="Design & UX Studio">UI/UX & Product Design</option>
                <option value="Marketing & SEO">Digital Marketing & Growth Consultancy</option>
                <option value="General Consulting">Management & Strategy Consulting</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Default Currency & GST</h2>
              <p className="text-xs text-slate-400 mt-1">Configure default billing currencies and applicable sales tax rates.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                >
                  <option value="₹">₹ (INR - Indian Rupee)</option>
                  <option value="$">$ (USD - US Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GST / Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team Size</label>
              <div className="grid grid-cols-3 gap-2">
                {['Solo Freelancer', '2-5 Team', '6-20 Team'].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      teamSize === size
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Seed CRM Data</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose how you want to start exploring your CRM workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => {
                  resetToMockData();
                  addToast('Dummy Data Ready', 'Pre-populated with Sarah Jenkins, BrightLabs, and active deals.');
                }}
                className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-600/50 hover:bg-indigo-900/50 transition cursor-pointer text-left space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Recommended</span>
                </div>
                <h3 className="font-bold text-sm text-white">Start with Demo Records</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Includes realistic leads, Kanban pipeline, proposals, invoices, and AI insights.
                </p>
              </div>

              <div 
                onClick={() => setStep(3)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition cursor-pointer text-left space-y-2"
              >
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Custom Import</span>
                </div>
                <h3 className="font-bold text-sm text-white">Import Existing Data</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste JSON backup file to restore records from an existing CRM export.
                </p>
              </div>
            </div>

            {step === 3 && (
              <div className="pt-2">
                <textarea
                  rows={2}
                  value={pastedJson}
                  onChange={e => setPastedJson(e.target.value)}
                  placeholder="Optional: Paste CRM backup JSON here..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white placeholder:text-slate-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
          >
            <span>{step === 3 ? 'Launch Operating System' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
