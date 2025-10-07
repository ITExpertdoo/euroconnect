import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { api } from '../utils/api';
import { seedDemoJobs } from '../utils/seedDemoData';
import { toast } from 'sonner@2.0.3';
import {
  LogOut,
  Briefcase,
  Upload,
  FileText,
  CheckCircle,
  User,
  Database,
  RefreshCw,
} from 'lucide-react';

export function BackendDemo() {
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    setLoading(true);
    
    // Load jobs
    const jobsResponse = await api.getJobs();
    if (jobsResponse.success) {
      setJobs(jobsResponse.data || []);
    }
    
    // Load applications if candidate
    if (user?.role === 'candidate') {
      const appsResponse = await api.getMyApplications();
      if (appsResponse.success) {
        setApplications(appsResponse.data || []);
      }
    }
    
    setLoading(false);
  };

  const seedDemoData = async () => {
    if (!isAuthenticated || user?.role !== 'employer') {
      toast.error('Morate biti prijavljeni kao poslodavac');
      return;
    }

    setLoading(true);
    
    const results = await seedDemoJobs();
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    if (successCount > 0) {
      toast.success(`Kreirano ${successCount} demo poslova!`);
    }
    
    if (failCount > 0) {
      toast.error(`${failCount} poslova nije uspelo da se kreira`);
    }
    
    loadData();
  };

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated || user?.role !== 'candidate') {
      toast.error('Morate biti prijavljeni kao kandidat');
      return;
    }

    // For demo, we'll use a placeholder CV URL
    const response = await api.applyToJob({
      jobId,
      coverLetter: 'Zainteresovan sam za ovu poziciju.',
      cvUrl: 'demo-cv-url', // In real app, this would be uploaded first
    });

    if (response.success) {
      toast.success('Uspešno ste aplicirali!');
      loadData();
    } else {
      toast.error(response.error || 'Aplikacija nije uspela');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>Backend Demo</CardTitle>
              <CardDescription>
                Prijavite se ili registrujte da vidite backend funkcionalnost
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                onClick={() => setAuthModalOpen(true)}
              >
                Prijava / Registracija
              </Button>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Backend funkcionalnosti:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Autentifikacija (Signup/Login)</li>
                  <li>CRUD operacije za poslove</li>
                  <li>Aplikacije za poslove</li>
                  <li>File upload (CV, logo)</li>
                  <li>Real-time podaci iz Supabase</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Backend Demo</h1>
              <p className="text-white/80">
                Testiranje backend funkcionalnosti sa pravim podacima
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <Badge variant="secondary" className="mt-1">
                  {user?.role === 'candidate' ? 'Kandidat' : 'Poslodavac'}
                </Badge>
              </div>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Odjava
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Backend:</span>
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Autentifikacija:</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-xs">{user?.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Poslovi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl">{jobs.length}</div>
                {user?.role === 'employer' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={seedDemoData}
                    disabled={loading}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Seed Demo Poslove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {user?.role === 'candidate' ? 'Moje Aplikacije' : 'Akcije'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl">
                  {user?.role === 'candidate' ? applications.length : '-'}
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={loadData}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2>Aktivni Poslovi ({jobs.length})</h2>
            </div>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nema poslova u bazi</p>
                  {user?.role === 'employer' && (
                    <Button
                      className="mt-4"
                      onClick={seedDemoData}
                      disabled={loading}
                    >
                      Kreiraj Demo Poslove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription>{job.company}</CardDescription>
                        </div>
                        {job.verified && (
                          <Badge variant="secondary">Verifikovan</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        {user?.role === 'candidate' && (
                          <Button
                            className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
                            onClick={() => handleApply(job.id)}
                            disabled={loading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Apliciraj
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                          Detaljnije
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Pregledi: {job.views || 0} | Aplikacije: {job.applicants || 0}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {user?.role === 'candidate' && applications.length > 0 && (
            <div>
              <h2 className="mb-4">Moje Aplikacije ({applications.length})</h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4>{app.job?.title || 'Posao obrisan'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {app.job?.company}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Aplicirano: {new Date(app.createdAt).toLocaleDateString('sr-RS')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            app.status === 'accepted' ? 'default' :
                            app.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {app.status === 'pending' ? 'Na čekanju' :
                           app.status === 'reviewed' ? 'Pregledano' :
                           app.status === 'accepted' ? 'Prihvaćeno' :
                           'Odbijeno'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
