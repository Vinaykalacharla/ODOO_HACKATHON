import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDocStore from '../store/useDocStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  Trash2, 
  Clock, 
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { documents, loading, fetchDocuments, uploadDocument } = useDocStore();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    await uploadDocument(file, title || file.name);
    setFile(null);
    setTitle('');
    setIsUploading(false);
  };

  return (
    <div className="pt-32 px-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">My Knowledge Base</h1>
          <p className="text-muted text-lg">Manage and query your document library.</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4 flex items-center gap-4 border-accent/20 bg-accent/5">
            <Database className="text-accent h-5 w-5" />
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Vector Index</p>
              <p className="font-bold">{documents.length} Documents</p>
            </div>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card className="p-8 sticky top-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5 text-accent" /> Upload PDF
            </h2>
            <form onSubmit={handleUpload} className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                  ${file ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input 
                  id="file-input"
                  type="file" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="h-10 w-10 text-accent mb-3" />
                    <p className="font-bold text-sm truncate w-full px-4">{file.name}</p>
                    <p className="text-xs text-muted">Ready to index</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-muted/30 mb-3" />
                    <p className="font-bold text-sm">Click or drag PDF</p>
                    <p className="text-xs text-muted">Up to 10MB</p>
                  </div>
                )}
              </div>

              <Input 
                label="Document Title"
                placeholder="e.g. Q4 Financial Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Button type="submit" loading={isUploading} className="w-full h-12" disabled={!file}>
                Analyze & Index
              </Button>
            </form>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-surface animate-pulse rounded-3xl border border-border" />
              ))
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <DocumentItem key={doc._id} doc={doc} />
              ))
            ) : (
              <div className="py-20 text-center glass rounded-3xl border-dashed">
                <FileText className="h-12 w-12 text-muted/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted">No documents found</h3>
                <p className="text-muted">Upload your first PDF to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentItem = ({ doc }) => (
  <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
    <div className="flex items-center gap-4">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors
        ${doc.status === 'ready' ? 'bg-teal/10 text-teal' : 'bg-accent/10 text-accent'}`}>
        {doc.status === 'ready' ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7 animate-spin-slow" />}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">{doc.title}</h3>
        <div className="flex items-center gap-4 text-xs text-muted font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(doc.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      {doc.status === 'ready' ? (
        <Button as={Link} to={`/chat/${doc._id}`} variant="secondary" className="gap-2">
          <MessageSquare className="h-4 w-4" /> Start Chat
        </Button>
      ) : (
        <div className="px-4 py-2 bg-border/20 rounded-xl text-xs font-bold text-muted">
          Processing...
        </div>
      )}
      <button className="p-2 text-muted hover:text-danger transition-colors">
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  </Card>
);

export default DashboardPage;
