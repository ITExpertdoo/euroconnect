import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Loader2, Upload, FileText } from 'lucide-react';

interface ApplyToJobModalProps {
  open: boolean;
  onClose: () => void;
  job: any;
  onSuccess?: () => void;
}

export function ApplyToJobModal({ open, onClose, job, onSuccess }: ApplyToJobModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [checkingDocuments, setCheckingDocuments] = useState(false);
  const [hasAllDocuments, setHasAllDocuments] = useState(false);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);

  // Required document types
  const requiredDocuments = [
    'CV/Biografija',
    'Diploma/Svjedočanstvo',
    'Fotografija za pasoš',
    'Kopija pasoša',
    'Medicinska potvrda',
    'Potvrda o nekažnjavanju'
  ];

  // Check if user has all required documents when modal opens
  React.useEffect(() => {
    if (open && isAuthenticated && user?.role === 'candidate') {
      checkUserDocuments();
    }
  }, [open, isAuthenticated, user]);

  const checkUserDocuments = async () => {
    setCheckingDocuments(true);
    try {
      const response = await api.getMyDocuments();
      if (response.success && response.data) {
        const approvedDocs = response.data.filter((doc: any) => doc.status === 'approved');
        const approvedTypes = approvedDocs.map((doc: any) => doc.documentType);
        
        const missing = requiredDocuments.filter(type => !approvedTypes.includes(type));
        setMissingDocuments(missing);
        setHasAllDocuments(missing.length === 0);
      }
    } catch (error) {
      console.error('Error checking documents:', error);
    } finally {
      setCheckingDocuments(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fajl je prevelik. Maksimalna veličina je 5MB.');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Dozvoljen format je samo PDF ili Word dokument.');
        return;
      }
      
      setCvFile(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Morate biti prijavljeni da aplicirate');
      return;
    }

    if (user?.role !== 'candidate') {
      toast.error('Samo kandidati mogu aplicirati za poslove');
      return;
    }

    if (!hasAllDocuments) {
      toast.error('Morate imati sva odobrena dokumenta pre apliciranja na posao');
      return;
    }

    if (!cvFile) {
      toast.error('Molimo učitajte vaš CV');
      return;
    }

    setLoading(true);

    try {
      // First upload CV
      setUploadingCv(true);
      const uploadResponse = await api.uploadFile(cvFile, 'cv');
      setUploadingCv(false);

      if (!uploadResponse.success || !uploadResponse.data?.url) {
        toast.error('Greška pri učitavanju CV-a');
        setLoading(false);
        return;
      }

      // Then submit application
      const response = await api.applyToJob({
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
        cvUrl: uploadResponse.data.url,
      });

      if (response.success) {
        toast.success('Uspešno ste aplicirali za posao!');
        setCoverLetter('');
        setCvFile(null);
        onClose();
        onSuccess?.();
      } else {
        toast.error(response.error || 'Greška pri apliciranju');
      }
    } catch (error) {
      toast.error('Došlo je do greške pri apliciranju');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCoverLetter('');
      setCvFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apliciraj za posao</DialogTitle>
          <DialogDescription>
            {job?.title} - {job?.company}
          </DialogDescription>
        </DialogHeader>

        {checkingDocuments ? (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-gray-500 mt-2">Provera dokumenata...</p>
          </div>
        ) : !hasAllDocuments ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ Nedostaju dokumenta</h4>
            <p className="text-sm text-red-700 mb-3">
              Morate imati sva odobrena dokumenta da biste aplicirali za posao.
            </p>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Potrebna dokumenta koja nedostaju:</p>
              <ul className="list-disc list-inside space-y-1">
                {missingDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Zatvori
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <Label htmlFor="cv-upload">
                CV / Resume * 
                <span className="text-xs text-gray-500 ml-2">(PDF ili Word, max 5MB)</span>
              </Label>
            <div className="mt-2">
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading}
                required
              />
              {cvFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{cvFile.name}</span>
                  <span className="text-xs">({(cvFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="cover-letter">
              Cover Letter (opciono)
            </Label>
            <Textarea
              id="cover-letter"
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Predstavite se poslodavcu i objasnite zašto ste idealan kandidat za ovu poziciju..."
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {coverLetter.length} / 1000 karaktera
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Otkaži
            </Button>
            <Button 
              type="submit"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              disabled={loading || uploadingCv}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploadingCv ? 'Učitavanje CV-a...' : 'Apliciranje...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Pošalji aplikaciju
                </>
              )}
            </Button>
          </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
