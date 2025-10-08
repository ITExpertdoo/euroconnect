import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ChangePasswordSection } from './ChangePasswordSection';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Euro,
  Clock,
  UserCheck,
  Crown,
  RefreshCw,
  Trash2,
  LogOut,
  Home,
  Menu,
  X,
  DollarSign
} from 'lucide-react';

interface EmployerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function EmployerDashboard({ onNavigate }: EmployerDashboardProps = {}) {
  const { user, isAuthenticated, logout, isAdmin, isPremium } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState<any>(null);
  const [applicationsForJob, setApplicationsForJob] = useState<any[]>([]);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    country: '',
    salary: '',
    employmentType: 'Puno radno vreme',
    category: 'Proizvodnja',
    verified: false,
    premium: false,
    description: '',
    requirements: '',
    benefits: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadJobs();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadJobs = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const response = await api.getJobs();
    if (response.success) {
      // Filter only my jobs
      const myJobs = (response.data || []).filter((job: any) => job.employerId === user?.id);
      setJobs(myJobs);
    }
    setLoading(false);
  };

  const loadApplicationsForJob = async (jobId: string) => {
    const response = await api.getJobApplications(jobId);
    if (response.success) {
      setApplicationsForJob(response.data || []);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      ...newJob,
      requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      benefits: newJob.benefits.split('\n').filter(b => b.trim()),
    };

    const response = await api.createJob(jobData);
    if (response.success) {
      toast.success('Posao uspešno kreiran!');
      setCreateModalOpen(false);
      setNewJob({
        title: '',
        company: '',
        location: '',
        country: '',
        salary: '',
        employmentType: 'Puno radno vreme',
        category: 'Proizvodnja',
        verified: false,
        premium: false,
        description: '',
        requirements: '',
        benefits: '',
      });
      loadJobs();
    } else {
      toast.error(response.error || 'Greška pri kreiranju posla');
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      salary: job.salary,
      employmentType: job.employmentType,
      category: job.category,
      verified: job.verified,
      premium: job.premium,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits,
    });
    setEditModalOpen(true);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingJob) return;
    
    const jobData = {
      ...newJob,
      requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      benefits: newJob.benefits.split('\n').filter(b => b.trim()),
    };

    const response = await api.updateJob(editingJob.id, jobData);
    if (response.success) {
      toast.success('Oglas uspešno ažuriran!');
      setEditModalOpen(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        company: '',
        location: '',
        country: '',
        salary: '',
        employmentType: 'Puno radno vreme',
        category: 'Proizvodnja',
        verified: false,
        premium: false,
        description: '',
        requirements: '',
        benefits: '',
      });
      loadJobs();
    } else {
      toast.error(response.error || 'Greška pri ažuriranju oglasa');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Da li ste sigurni da želite obrisati ovaj posao?')) return;
    
    const response = await api.deleteJob(jobId);
    if (response.success) {
      toast.success('Posao obrisan');
      loadJobs();
    } else {
      toast.error(response.error || 'Greška pri brisanju posla');
    }
  };

  const handleUpgradeJob = async (jobId: string, featureType: 'featured' | 'boost' | 'highlight') => {
    const featureNames = {
      featured: 'Featured (€49.99/30 dana)',
      boost: 'Boost (€19.99/7 dana)',
      highlight: 'Highlight (€29.99/30 dana)'
    };
    
    if (!confirm(`Da li želite da nadogradite ovaj oglas na ${featureNames[featureType]}?`)) return;
    
    const response = await api.upgradeJobToPremium(jobId, featureType);
    if (response.success) {
      toast.success('Oglas uspešno nadograđen na premium!');
      loadJobs();
    } else {
      toast.error(response.error || 'Greška pri nadogradnji');
    }
  };

  const handleViewApplications = async (job: any) => {
    setViewingApplicationsFor(job);
    await loadApplicationsForJob(job.id);
  };

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'jobs', icon: Briefcase, label: 'Moji oglasi', count: jobs.length },
    { id: 'candidates', icon: Users, label: 'Kandidati', count: 0 },
    { id: 'messages', icon: MessageSquare, label: 'Poruke', count: 0 },
    { id: 'billing', icon: CreditCard, label: 'Naplata' },
    { id: 'settings', icon: Settings, label: 'Podešavanja' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'E';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
  const premiumJobsCount = jobs.filter(j => j.premium).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('landing')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">EC</span>
              </div>
              <span className="text-sm font-semibold text-primary">EuroConnect</span>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-semibold">{user?.name || 'Employer'}</p>
                {isAdmin && <span className="text-xs">👑</span>}
              </div>
              <p className="text-sm text-gray-600">Poslodavac</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeSection === item.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {item.count}
                </Badge>
              )}
            </div>
          ))}
          
          {/* Quick Navigation */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-3 px-3">NAVIGACIJA</p>
            
            <div 
              className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onNavigate?.('landing')}
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Početna</span>
            </div>
            
            <div 
              className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onNavigate?.('pricing')}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Cjenovnik</span>
            </div>
            
            <div 
              className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onNavigate?.('billboard')}
            >
              <Eye className="w-5 h-5" />
              <span className="text-sm">Oglasna tabla</span>
            </div>
            
            {isAdmin && (
              <div 
                className="flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-amber-50 transition-colors border border-gold"
                onClick={() => onNavigate?.('backend-demo')}
              >
                <span className="text-sm">👑 Admin Panel</span>
              </div>
            )}
            
            <div 
              className="flex items-center gap-3 p-3 rounded-lg mt-4 cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
              onClick={() => {
                logout();
                onNavigate?.('landing');
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Odjava</span>
            </div>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <button 
              className="md:hidden mr-4"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1>Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">Upravljajte svojim oglasima i kandidatima</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Kreiraj Oglas
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Ime i prezime</label>
                      <Input 
                        type="text" 
                        defaultValue={user?.name}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email</label>
                      <Input 
                        type="email" 
                        defaultValue={user?.email}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ChangePasswordSection />

              <Card>
                <CardHeader>
                  <CardTitle>Notifikacije</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifikacije</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifikacije o novim kandidatima</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Dashboard and Jobs Section */}
          {activeSection !== 'settings' && (
            <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Aktivni oglasi</p>
                    <p className="text-2xl font-bold">
                      {jobs.filter(j => j.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ukupno kandidata</p>
                    <p className="text-2xl font-bold">{totalApplicants}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ukupno pregleda</p>
                    <p className="text-2xl font-bold">{totalViews}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Premium oglasi</p>
                    <p className="text-2xl font-bold">{premiumJobsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Info Card */}
          <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-gold">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Istaknite svoje oglase</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Povećajte vidljivost vaših oglasa i privucite više kvalifikovanih kandidata sa premium opcijama.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-900">
                      <strong>💳 Kako funkcionišu plaćanja:</strong> Kada kliknete na premium opciju kod vašeg oglasa, 
                      otvorićete se payment modal gde možete platiti kreditnom karticom ili PayPal-om. 
                      Nakon uspešnog plaćanja, oglas će automatski dobiti premium status i posebno istaknuti izgled.
                      <br />
                      <span className="text-blue-700 italic">
                        * Demo verzija - neće se naplatiti pravi novac
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">Boost</span>
                        <Badge variant="secondary" className="text-xs ml-auto">€19.99</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Povećajte poziciju na 7 dana</p>
                      <p className="text-xs text-gray-500">Vaš oglas će biti više rangiran u rezultatima pretrage</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-sm">Highlight</span>
                        <Badge variant="secondary" className="text-xs ml-auto">€29.99</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Zlatni okvir na 30 dana</p>
                      <p className="text-xs text-gray-500">Oglas dobija zlatni okvir koji privlači pažnju</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gold">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-gold" />
                        <span className="font-medium text-sm">Featured</span>
                        <Badge style={{ backgroundColor: '#F2C230', color: '#0E395C' }} className="text-xs ml-auto">€49.99</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Top pozicija na 30 dana</p>
                      <p className="text-xs text-gray-500">Prikazan na vrhu liste + zlatni okvir + badge</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Ads */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Moji oglasi ({jobs.length})</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novi oglas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">Učitavanje...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nemate kreiranih oglasa</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Kreirajte prvi oglas
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        job.premium && job.premiumFeature === 'highlight' ? 'border-gold border-2 bg-amber-50/30' : ''
                      } ${
                        job.premium && job.premiumFeature === 'featured' ? 'border-gold border-2 bg-gradient-to-r from-amber-50 to-yellow-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4>{job.title}</h4>
                            {job.premium && (
                              <Badge style={{ backgroundColor: '#F2C230', color: '#0E395C' }}>
                                <Crown className="w-3 h-3 mr-1" />
                                {job.premiumFeature === 'featured' ? 'Featured' : 
                                 job.premiumFeature === 'boost' ? 'Boosted' : 'Highlighted'}
                              </Badge>
                            )}
                            <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {job.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                            {job.verified && (
                              <Badge variant="secondary">Verifikovan</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewApplications(job)}>
                            <Users className="w-4 h-4 mr-1" />
                            {job.applicants || 0}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Euro className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          {job.views || 0} pregleda
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(job.createdAt).toLocaleDateString('sr-RS')}
                        </div>
                      </div>

                      {/* Premium Upgrade Options */}
                      {!job.premium && (
                        <div className="flex gap-2 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpgradeJob(job.id, 'boost')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Boost (€19.99)
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpgradeJob(job.id, 'highlight')}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Highlight (€29.99)
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpgradeJob(job.id, 'featured')}
                            style={{ color: '#F2C230' }}
                            className="hover:bg-amber-50"
                          >
                            <Crown className="w-3 h-3 mr-1" />
                            Featured (€49.99)
                          </Button>
                        </div>
                      )}

                      {job.premium && job.premiumUntil && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-gray-600">
                            Premium aktivno do: {new Date(job.premiumUntil).toLocaleDateString('sr-RS')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kreiraj novi oglas za posao</DialogTitle>
            <DialogDescription>
              Popunite informacije o poziciji
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Naziv pozicije *</Label>
                <Input
                  id="title"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="npr. CNC Operater"
                />
              </div>
              <div>
                <Label htmlFor="company">Kompanija *</Label>
                <Input
                  id="company"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder="npr. Tech GmbH"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Lokacija *</Label>
                <Input
                  id="location"
                  required
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="npr. Berlin, Nemačka"
                />
              </div>
              <div>
                <Label htmlFor="country">Država *</Label>
                <Select value={newJob.country} onValueChange={(value) => setNewJob({ ...newJob, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite državu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nemačka">Nemačka</SelectItem>
                    <SelectItem value="Austrija">Austrija</SelectItem>
                    <SelectItem value="Holandija">Holandija</SelectItem>
                    <SelectItem value="Švicarska">Švicarska</SelectItem>
                    <SelectItem value="Belgija">Belgija</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Plata *</Label>
                <Input
                  id="salary"
                  required
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  placeholder="npr. €2,800 - €3,500"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategorija *</Label>
                <Select value={newJob.category} onValueChange={(value) => setNewJob({ ...newJob, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proizvodnja">Proizvodnja</SelectItem>
                    <SelectItem value="Građevina">Građevina</SelectItem>
                    <SelectItem value="Ugostiteljstvo">Ugostiteljstvo</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Logistika">Logistika</SelectItem>
                    <SelectItem value="Zdravstvo">Zdravstvo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Opis posla *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Opišite poziciju..."
              />
            </div>

            <div>
              <Label htmlFor="requirements">Zahtevi (jedan po liniji)</Label>
              <Textarea
                id="requirements"
                rows={4}
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                placeholder="2+ godine iskustva&#10;Poznavanje CNC mašina&#10;Osnovi nemačkog jezika"
              />
            </div>

            <div>
              <Label htmlFor="benefits">Beneficije (jedan po liniji)</Label>
              <Textarea
                id="benefits"
                rows={4}
                value={newJob.benefits}
                onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                placeholder="Zdravstveno osiguranje&#10;Plaćen smeštaj&#10;30 dana godišnjeg odmora"
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCreateModalOpen(false)}
              >
                Otkaži
              </Button>
              <Button 
                type="submit"
                style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
              >
                Kreiraj oglas
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={editModalOpen} onOpenChange={(open) => {
        setEditModalOpen(open);
        if (!open) {
          setEditingJob(null);
          setNewJob({
            title: '',
            company: '',
            location: '',
            country: '',
            salary: '',
            employmentType: 'Puno radno vreme',
            category: 'Proizvodnja',
            verified: false,
            premium: false,
            description: '',
            requirements: '',
            benefits: '',
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Izmeni oglas za posao</DialogTitle>
            <DialogDescription>
              Ažurirajte informacije o poziciji
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Naziv pozicije *</Label>
                <Input
                  id="edit-title"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="npr. CNC Operater"
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Kompanija *</Label>
                <Input
                  id="edit-company"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder="npr. Tech GmbH"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-location">Lokacija *</Label>
                <Input
                  id="edit-location"
                  required
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="npr. Berlin, Nemačka"
                />
              </div>
              <div>
                <Label htmlFor="edit-country">Država *</Label>
                <Select value={newJob.country} onValueChange={(value) => setNewJob({ ...newJob, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite državu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nemačka">Nemačka</SelectItem>
                    <SelectItem value="Austrija">Austrija</SelectItem>
                    <SelectItem value="Holandija">Holandija</SelectItem>
                    <SelectItem value="Švicarska">Švicarska</SelectItem>
                    <SelectItem value="Belgija">Belgija</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-salary">Plata *</Label>
                <Input
                  id="edit-salary"
                  required
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  placeholder="npr. €2,800 - €3,500"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Kategorija *</Label>
                <Select value={newJob.category} onValueChange={(value) => setNewJob({ ...newJob, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proizvodnja">Proizvodnja</SelectItem>
                    <SelectItem value="Građevina">Građevina</SelectItem>
                    <SelectItem value="Ugostiteljstvo">Ugostiteljstvo</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Logistika">Logistika</SelectItem>
                    <SelectItem value="Zdravstvo">Zdravstvo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Opis posla *</Label>
              <Textarea
                id="edit-description"
                required
                rows={4}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Opišite poziciju..."
              />
            </div>

            <div>
              <Label htmlFor="edit-requirements">Zahtevi (jedan po liniji)</Label>
              <Textarea
                id="edit-requirements"
                rows={4}
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                placeholder="2+ godine iskustva&#10;Poznavanje CNC mašina&#10;Osnovi nemačkog jezika"
              />
            </div>

            <div>
              <Label htmlFor="edit-benefits">Beneficije (jedan po liniji)</Label>
              <Textarea
                id="edit-benefits"
                rows={4}
                value={newJob.benefits}
                onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                placeholder="Zdravstveno osiguranje&#10;Plaćen smeštaj&#10;30 dana godišnjeg odmora"
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
              >
                Otkaži
              </Button>
              <Button 
                type="submit"
                style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
              >
                Sačuvaj izmene
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Applications Modal */}
      <Dialog open={!!viewingApplicationsFor} onOpenChange={() => setViewingApplicationsFor(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aplikacije za: {viewingApplicationsFor?.title}</DialogTitle>
            <DialogDescription>
              {viewingApplicationsFor?.company} - {applicationsForJob.length} kandidata
            </DialogDescription>
          </DialogHeader>
          
          {applicationsForJob.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Još nema aplikacija za ovaj posao</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicationsForJob.map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4>{app.candidateName}</h4>
                        <p className="text-sm text-gray-600">{app.candidateEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Aplicirano: {new Date(app.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <Badge className={
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                    {app.coverLetter && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Cover Letter:</p>
                        <p className="text-sm text-gray-600">{app.coverLetter}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Pregled CV-a
                      </Button>
                      <Button size="sm" variant="outline" className="text-green-600">
                        Prihvati
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        Odbij
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
