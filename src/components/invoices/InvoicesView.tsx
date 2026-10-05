import React, { useState } from 'react';
import { 
  Receipt, Plus, Printer, Send, DollarSign, 
  CheckCircle2, AlertTriangle, Clock, Trash2, 
  CreditCard, ArrowRight, Download 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types/crm';

export const InvoicesView: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, recordPayment, deleteInvoice, companies } = useCRM();
  const { addToast } = useToast();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [isRecordPayOpen, setIsRecordPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'Bank Transfer' | 'UPI' | 'Credit Card' | 'Cash'>('Bank Transfer');
  const [payRef, setPayRef] = useState('');
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice Form
  const [newClientCompany, setNewClientCompany] = useState('BrightLabs Interactive');
  const [newClientContact, setNewClientContact] = useState('Sarah Jenkins');
  const [newClientEmail, setNewClientEmail] = useState('sarah.jenkins@brightlabs.io');
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [item1Desc, setItem1Desc] = useState('Phase 1 Milestone Sprint');
  const [item1Amount, setItem1Amount] = useState('45000');

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

  const totalCollected = invoices
    .reduce((sum, i) => sum + i.amountPaid, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(item1Amount) || 30000;
    const subtotal = rate;
    const taxRate = 18;
    const taxAmount = Math.round(subtotal * 0.18);
    const total = subtotal + taxAmount;

    const created = addInvoice({
      companyName: newClientCompany,
      contactName: newClientContact,
      contactEmail: newClientEmail,
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      items: [{ id: `item-${Date.now()}`, description: item1Desc, quantity: 1, rate, amount: rate }],
      subtotal,
      taxRate,
      taxAmount,
      discount: 0,
      total,
      amountPaid: 0,
      payments: [],
      notes: 'Thank you for your business. 18% GST invoice.',
      terms: 'Payment due within 7 days.'
    });

    setSelectedInvoice(created);
    setIsNewInvoiceOpen(false);
    addToast('Invoice Created', `Invoice ${created.number} generated.`);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;

    recordPayment(selectedInvoice.id, {
      amount: amt,
      method: payMethod,
      referenceNo: payRef,
      notes: `Recorded via Nexus CRM console`
    });

    // Update selected invoice in view
    const updatedPaid = selectedInvoice.amountPaid + amt;
    setSelectedInvoice({
      ...selectedInvoice,
      amountPaid: updatedPaid,
      status: updatedPaid >= selectedInvoice.total ? 'paid' : 'partially_paid'
    });

    setIsRecordPayOpen(false);
    setPayAmount('');
    setPayRef('');
    addToast('Payment Recorded', `₹${amt.toLocaleString('en-IN')} added to revenue.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Invoices, GST & Payments
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ₹{(totalCollected / 100000).toFixed(1)}L Collected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated GST tax calculation, milestone billing, payment receipt recording, and downloadable tax invoices.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Collected Revenue</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Recorded bank & UPI transfers</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Outstanding Receivables</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Pending payment from clients</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Invoices Issued</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {invoices.length} Invoices
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Compliant with 18% GST rule</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Invoices List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Invoices Stream
          </h2>

          {invoices.map(inv => {
            const isSelected = selectedInvoice?.id === inv.id;
            const isOverdue = inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.dueDate) < new Date());
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900">{inv.number}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                    isOverdue ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {isOverdue ? 'Overdue' : inv.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="font-bold text-xs text-slate-800 truncate mb-1">
                  {inv.companyName}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-extrabold text-slate-900">
                    ₹{inv.total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Due {inv.dueDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Invoice Details */}
        {selectedInvoice && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">{selectedInvoice.number}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issued: {selectedInvoice.issueDate} • Due: <strong className="text-slate-800">{selectedInvoice.dueDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrintOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </button>

                {selectedInvoice.status !== 'paid' && (
                  <button
                    onClick={() => {
                      setPayAmount(String(selectedInvoice.total - selectedInvoice.amountPaid));
                      setIsRecordPayOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bill To & Bill From */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice.companyName}</p>
                <p className="font-medium text-slate-600">{selectedInvoice.contactName}</p>
                <p className="text-slate-500">{selectedInvoice.contactEmail}</p>
                {selectedInvoice.clientAddress && (
                  <p className="text-slate-400 mt-1">{selectedInvoice.clientAddress}</p>
                )}
                {selectedInvoice.clientGstNo && (
                  <p className="text-indigo-600 font-mono mt-1 font-semibold">GSTIN: {selectedInvoice.clientGstNo}</p>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payable To</span>
                <p className="font-bold text-slate-900 text-sm">Nexus Digital Studio</p>
                <p className="text-slate-500">Alex Morgan, Founder</p>
                <p className="text-slate-400">GSTIN: 29AAAAA0000A1Z5</p>
                <p className="text-slate-400">Bank: HDFC Bank • A/C: 50200012345678</p>
                <p className="text-slate-400">IFSC: HDFC0000123 • UPI: nexus@hdfcbank</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Service / Milestone Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-slate-50/70 border-t border-slate-200 space-y-1 text-right text-xs">
                <div className="flex justify-end gap-6 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-end gap-6 text-slate-600">
                  <span>GST (18%):</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-end gap-6 text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>Invoice Total:</span>
                  <span>₹{selectedInvoice.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-end gap-6 text-emerald-600 font-bold text-xs pt-1">
                  <span>Amount Paid:</span>
                  <span>₹{selectedInvoice.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoice.total - selectedInvoice.amountPaid > 0 && (
                  <div className="flex justify-end gap-6 text-rose-600 font-bold text-xs">
                    <span>Balance Due:</span>
                    <span>₹{(selectedInvoice.total - selectedInvoice.amountPaid).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payments History */}
            {selectedInvoice.payments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Payment History & Receipts
                </h4>
                {selectedInvoice.payments.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-emerald-900">
                        ₹{p.amount.toLocaleString('en-IN')} received via {p.method}
                      </p>
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        {p.date} {p.referenceNo && `• Ref: ${p.referenceNo}`}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isRecordPayOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Record Client Payment</h2>
            <p className="text-xs text-slate-500">Record funds received on {selectedInvoice.number}.</p>
            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                  <option value="Credit Card">Credit Card / Stripe</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank UTR / Reference No</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC-NEFT-998811"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordPayOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900">Create Tax Invoice</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Company *</label>
                  <input
                    type="text"
                    required
                    value={newClientCompany}
                    onChange={e => setNewClientCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newClientContact}
                    onChange={e => setNewClientContact(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={e => setNewClientEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Description *</label>
                <input
                  type="text"
                  required
                  value={item1Desc}
                  onChange={e => setItem1Desc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Amount (₹, ex-GST) *</label>
                <input
                  type="number"
                  required
                  value={item1Amount}
                  onChange={e => setItem1Amount(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl text-xs text-indigo-900">
                18% GST will be calculated automatically: Total = ₹{Math.round((parseFloat(item1Amount) || 0) * 1.18).toLocaleString('en-IN')}.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Create & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT VIEW MODAL */}
      {isPrintOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="no-print flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-slate-600">Tax Invoice Print</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setIsPrintOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-6 text-slate-800">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Nexus Digital Studio</h1>
                  <p className="text-xs text-slate-500">Tax Invoice (Under GST Rules)</p>
                  <p className="text-xs font-mono text-slate-600 mt-1">GSTIN: 29AAAAA0000A1Z5</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-indigo-600">{selectedInvoice.number}</span>
                  <p className="text-xs text-slate-500">Date: {selectedInvoice.issueDate}</p>
                  <p className="text-xs text-slate-500">Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900">Bill To:</p>
                  <p className="font-semibold text-slate-800">{selectedInvoice.companyName}</p>
                  <p>{selectedInvoice.contactName}</p>
                  <p>{selectedInvoice.contactEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Remit Payment To:</p>
                  <p>Bank: HDFC Bank</p>
                  <p>A/C: 50200012345678</p>
                  <p>IFSC: HDFC0000123</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right font-semibold">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right text-xs space-y-1">
                <p>Subtotal: ₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</p>
                <p>GST (18%): ₹{selectedInvoice.taxAmount.toLocaleString('en-IN')}</p>
                <p className="text-base font-extrabold text-slate-900 pt-1 border-t">
                  Total Due: ₹{selectedInvoice.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
