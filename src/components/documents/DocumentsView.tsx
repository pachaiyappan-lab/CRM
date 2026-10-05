import React, { useState } from 'react';
import { 
  Files, Plus, Search, Download, Trash2, Eye, 
  FileText, Shield, DollarSign, UploadCloud, CheckCircle2 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { DocumentItem } from '../../types/crm';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useCRM();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Upload Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<any>('contract');
  const [relatedName, setRelatedName] = useState('BrightLabs Interactive');

  const filtered = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.relatedToName && doc.relatedToName.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterType === 'all' || doc.fileType === filterType;
    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    addDocument({
      title: docTitle.endsWith('.pdf') ? docTitle : `${docTitle}.pdf`,
      fileType: docCategory,
      fileSize: '1.4 MB',
      relatedToName: relatedName,
      uploadedBy: 'Alex Morgan'
    });

    addToast('Document Uploaded', `${docTitle} is now linked to CRM.`);
    setIsUploadModalOpen(false);
    setDocTitle('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Documents & File Repository
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {documents.length} Files
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store client contracts, executed proposals, invoices, project deliverables, and compliance paperwork.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'proposal', 'contract', 'invoice', 'pdf'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                filterType === cat ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(doc => (
          <div 
            key={doc.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {doc.fileType}
                </span>
              </div>

              <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 mb-1 group-hover:text-indigo-600 transition">
                {doc.title}
              </h3>

              {doc.relatedToName && (
                <p className="text-[11px] text-slate-500 truncate mb-2">
                  Linked to: <strong>{doc.relatedToName}</strong>
                </p>
              )}

              <div className="text-[10px] text-slate-400 space-y-0.5">
                <p>Size: {doc.fileSize}</p>
                <p>Uploaded by {doc.uploadedBy}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => {
                  deleteDocument(doc.id);
                  addToast('Document Deleted', 'File removed from CRM.');
                }}
                className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No documents found</p>
          <p className="text-xs text-slate-500 mt-1">Upload client agreements or contracts to manage them here.</p>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Upload CRM Document</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Services Agreement v2.pdf"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="contract">Client Contract</option>
                    <option value="proposal">Scope / Proposal</option>
                    <option value="invoice">Invoice Receipt</option>
                    <option value="pdf">General PDF Asset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Related Entity</label>
                  <input
                    type="text"
                    value={relatedName}
                    onChange={e => setRelatedName(e.target.value)}
                    placeholder="e.g. BrightLabs Interactive"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Drag drop dropzone simulation */}
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Choose file or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, XLSX up to 25MB</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500">Related to {previewDoc.relatedToName}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="p-10 border border-slate-200 rounded-xl bg-slate-50 text-center space-y-3">
              <FileText className="w-16 h-16 text-indigo-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Document preview ready</p>
              <p className="text-[11px] text-slate-400">File size: {previewDoc.fileSize} • Uploaded by {previewDoc.uploadedBy}</p>
              <button
                onClick={() => {
                  addToast('Download Started', `Downloading ${previewDoc.title}...`);
                  setPreviewDoc(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
