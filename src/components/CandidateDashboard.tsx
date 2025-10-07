import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ChangePasswordSection } from './ChangePasswordSection';
import { 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  MessageSquare, 
  Upload, 
  Settings,
  CheckCircle,
  Clock,
  Eye,
  UserCheck,
  Bell,
  ChevronRight,
  Calendar,
  MapPin,
  Euro,
  RefreshCw,
  LogOut,
  Crown,
  Home,
  Menu,
  X,
  Shield
} from 'lucide-react';

interface CandidateDashboardProps {
  onNavigate?: (page: string) => void;
}

export function CandidateDashboard({ onNavigate }: CandidateDashboardProps = {}) {
  const { user, isAuthenticated, logout, isPremium, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [documents, setDocuments] = useState([
    { name: 'CV/Biografija', uploaded: false, file: null as File | null },
    { name: 'Diploma/Svjedočanstvo', uploaded: false, file: null as File | null },
    { name: 'Fotografija za pasoš', uploaded: false, file: null as File | null },
    { name: 'Kopija pasoša', uploaded: false, file: null as File | null },
    { name: 'Medicinska potvrda', uploaded: false, file: null as File | null },
    { name: 'Potvrda o nekažnjavanju', uploaded: false, file: null as File | null }
  ]);
  const [checklistItems, setChecklistItems] = useState([
    { step: 'Radna dozvola', completed: false, description: 'Prikupiti potrebna dokumenta' },
    { step: 'Osiguranje', completed: false, description: 'Zdravstveno i putno osiguranje' },
    { step: 'Prijava boravka', completed: false, description: 'Registracija u lokalnim organima' },
    { step: 'Smeštaj', completed: false, description: 'Pronalaženje privremenog smještaja' }
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadApplications = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const response = await api.getMyApplications();
    if (response.success) {
      setApplications(response.data || []);
    } else {
      // Don't show error if user is not authenticated
      if (isAuthenticated) {
        toast.error('Greška pri učitavanju aplikacija');
      }
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Sent', color: 'bg-gray-100 text-gray-800' };
      case 'reviewed':
        return { label: 'Seen', color: 'bg-yellow-100 text-yellow-800' };
      case 'accepted':
        return { label: 'Offer', color: 'bg-green-100 text-green-800' };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleFileUpload = (index: number, file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Nevalidan format! Dozvoljeni formati su: PDF, JPG, PNG');
      return;
    }
    
    // Show warning about document requirements
    toast.info('⚠️ Molimo da dokument bude skeniran u boji, min. 200 DPI. Crno-beli skenovi i telefonske fotografije neće biti prihvaćeni.', {
      duration: 5000
    });
    
    const newDocuments = [...documents];
    newDocuments[index] = {
      ...newDocuments[index],
      uploaded: true,
      file: file
    };
    setDocuments(newDocuments);
    toast.success(`${newDocuments[index].name} uspešno uploadovan!`);
  };

  const toggleChecklistItem = (index: number) => {
    const newItems = [...checklistItems];
    newItems[index] = {
      ...newItems[index],
      completed: !newItems[index].completed
    };
    setChecklistItems(newItems);
  };

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'applications', icon: FileText, label: 'My Applications', count: applications.length },
    { id: 'saved', icon: Bookmark, label: 'Saved Jobs', count: 0 },
    { id: 'messages', icon: MessageSquare, label: 'Messages', count: 0 },
    { id: 'documents', icon: Upload, label: 'Moja dokumenta' },
    { id: 'checklist', icon: CheckCircle, label: 'Checklist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const savedJobs: any[] = [];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSectionTitle = () => {
    const section = sidebarItems.find(item => item.id === activeSection);
    return section ? section.label : 'Dashboard';
  };

  const calculateDocumentProgress = () => {
    const uploaded = documents.filter(d => d.uploaded).length;
    return Math.round((uploaded / documents.length) * 100);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'applications':
        return renderApplications();
      case 'saved':
        return renderSavedJobs();
      case 'messages':
        return renderMessages();
      case 'documents':
        return renderDocuments();
      case 'checklist':
        return renderChecklist();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'reviewed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offers</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'accepted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Documents</p>
                <p className="text-2xl font-bold">{calculateDocumentProgress()}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">Učitavanje...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Još nemate aplikacija</p>
                  <p className="text-sm mt-2">Pronađite poslove i aplicirajte!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => {
                    const statusInfo = getStatusDisplay(app.status);
                    return (
                      <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4>{app.job?.title || 'N/A'}</h4>
                            <p className="text-sm text-gray-600">{app.job?.company || 'N/A'}</p>
                          </div>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.job?.location || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="w-4 h-4" />
                            {app.job?.salary || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(app.createdAt).toLocaleDateString('sr-RS')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Quick Stats */}
        <div className="space-y-6">
          {/* Documents Status */}
          <Card>
            <CardHeader>
              <CardTitle>Moja dokumenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Kompletnost</span>
                  <span className="text-sm font-semibold">{calculateDocumentProgress()}%</span>
                </div>
                <Progress value={calculateDocumentProgress()} />
              </div>
              <div className="space-y-2">
                {documents.slice(0, 3).map((doc, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{doc.name}</span>
                    {doc.uploaded ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setActiveSection('documents')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Pogledaj sve
              </Button>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.step}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setActiveSection('checklist')}
              >
                Pogledaj sve
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  const renderApplications = () => (
    <Card>
      <CardHeader>
        <CardTitle>Sve moje aplikacije</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Učitavanje...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Još nemate aplikacija</p>
            <p className="text-sm mt-2">Pronađite poslove i aplicirajte!</p>
            <Button className="mt-6" onClick={() => onNavigate?.('billboard')}>
              Pretraži poslove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusInfo = getStatusDisplay(app.status);
              return (
                <div key={app.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3>{app.job?.title || 'N/A'}</h3>
                      <p className="text-gray-600 mt-1">{app.job?.company || 'N/A'}</p>
                    </div>
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {app.job?.location || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      {app.job?.salary || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Aplicirano: {new Date(app.createdAt).toLocaleDateString('sr-RS')}
                    </div>
                  </div>
                  {app.coverLetter && (
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p className="font-medium mb-2">Motivaciono pismo:</p>
                      <p className="text-gray-700">{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSavedJobs = () => (
    <Card>
      <CardHeader>
        <CardTitle>Sačuvani poslovi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-gray-600">
          <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nemate sačuvanih poslova</p>
          <p className="text-sm mt-2">Sačuvajte poslove koji vas zanimaju</p>
          <Button className="mt-6" onClick={() => onNavigate?.('billboard')}>
            Pretraži poslove
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMessages = () => (
    <Card>
      <CardHeader>
        <CardTitle>Poruke</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-gray-600">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Nemate poruka</p>
          <p className="text-sm mt-2">Poruke od poslodavaca će se prikazati ovde</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Moja dokumenta</CardTitle>
          <div className="text-sm">
            <span className="text-gray-600">Kompletnost: </span>
            <span className="font-semibold text-primary">{calculateDocumentProgress()}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Upload Warning */}
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            ⚠️ Važna pravila za upload dokumenata
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✅ Dozvoljeni formati: <strong>PDF, JPG, PNG</strong></li>
            <li>✅ Dokumenti moraju biti <strong>skenirani u boji</strong></li>
            <li>✅ Minimalna rezolucija: <strong>200 DPI</strong></li>
            <li>❌ <strong>ZABRANJENO:</strong> Crno-beli skenovi, fotografije sa telefona, mutni fajlovi</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <Progress value={calculateDocumentProgress()} className="h-2" />
        </div>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {doc.uploaded ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.uploaded && doc.file && (
                      <p className="text-sm text-gray-600">{doc.file.name}</p>
                    )}
                  </div>
                </div>
                <div>
                  {doc.uploaded ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDocuments = [...documents];
                        newDocuments[index] = {
                          ...newDocuments[index],
                          uploaded: false,
                          file: null
                        };
                        setDocuments(newDocuments);
                        toast.info('Dokument uklonjen');
                      }}
                    >
                      Ukloni
                    </Button>
                  ) : (
                    <label>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </span>
                      </Button>
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Napomena:</strong> Prihvaćeni formati: PDF, DOC, DOCX, JPG, PNG. Maksimalna veličina fajla: 10MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderChecklist = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Checklist za rad u EU</CardTitle>
          <div className="text-sm">
            <span className="text-gray-600">Završeno: </span>
            <span className="font-semibold text-primary">
              {checklistItems.filter(i => i.completed).length}/{checklistItems.length}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklistItems.map((item, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                item.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
              }`}
              onClick={() => toggleChecklistItem(index)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'
                }`}>
                  {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`font-medium mb-1 ${item.completed ? 'text-green-900' : ''}`}>
                    {item.step}
                  </p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Savet:</strong> Kliknite na stavku da je označite kao završenu ili nezavršenu.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Ime i prezime</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg" 
                defaultValue={user?.name}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border rounded-lg" 
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
              <span className="text-sm">Notifikacije o novim poslovima</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifikacije o statusu aplikacije</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opasna zona</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Brisanje naloga je trajna radnja i ne može se poništiti.
          </p>
          <Button variant="destructive">
            Obriši nalog
          </Button>
        </CardContent>
      </Card>
    </div>
  );

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
                <p className="font-semibold">{user?.name || 'Kandidat'}</p>
                {isPremium && <Crown className="w-4 h-4 text-gold" />}
                {isAdmin && <span className="text-xs">👑</span>}
              </div>
              <p className="text-sm text-gray-600">Kandidat</p>
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
              onClick={() => onNavigate?.('premium')}
            >
              <Crown className="w-5 h-5 text-gold" />
              <span className="text-sm">Premium</span>
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
              <h1>{getSectionTitle()}</h1>
              <p className="text-gray-600 mt-1">
                {activeSection === 'dashboard' 
                  ? `Dobrodošli nazad, ${user?.name || 'Kandidat'}` 
                  : getSectionTitle()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={loadApplications} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="icon" variant="outline">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
