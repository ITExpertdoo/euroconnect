import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AuthModal } from './AuthModal';
import { ApplyToJobModal } from './ApplyToJobModal';
import { Logo } from './Logo';
import { ContactSection } from './ContactSection';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { 
  Search, 
  CheckCircle, 
  Users, 
  Globe, 
  FileText, 
  UserCheck, 
  ArrowRight,
  Lock,
  Play,
  MessageSquare,
  Mail,
  Phone,
  LogOut,
  Crown,
  Award,
  Shield,
  Cloud,
  Euro,
  Building2
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
  onOpenResetModal?: (token: string) => void;
}

export function LandingPage({ onNavigate, onOpenResetModal }: LandingPageProps) {
  const { user, logout, isAuthenticated, isPremium, isAdmin } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'candidate' | 'employer' | undefined>(undefined);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCountry, setSearchCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    // Auto-search when country filter changes
    if (searchCountry !== 'all') {
      handleSearch();
    }
  }, [searchCountry]);

  const loadJobs = async (filters?: { location?: string; search?: string }) => {
    setLoading(true);
    const response = await api.getJobs(filters);
    if (response.success) {
      setJobs(response.data || []);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    loadJobs({
      location: searchCountry && searchCountry !== 'all' ? searchCountry : undefined,
      search: searchQuery || undefined,
    });
  };

  const handleLoginClick = (role?: 'candidate' | 'employer') => {
    if (isAuthenticated) {
      logout();
    } else {
      setAuthDefaultRole(role);
      setAuthModalOpen(true);
    }
  };

  const handleCandidatesClick = () => {
    if (isAuthenticated) {
      // Already logged in, maybe scroll to jobs section
      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleLoginClick('candidate');
    }
  };

  const handleEmployersClick = () => {
    if (isAuthenticated && user?.role === 'employer') {
      // Navigate to employer dashboard or pricing
      if (onNavigate) onNavigate('employer-dashboard');
    } else if (!isAuthenticated) {
      handleLoginClick('employer');
    }
  };

  const handlePricingClick = () => {
    if (onNavigate) {
      onNavigate('pricing');
    }
  };

  const handleApplyClick = (job: any) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    
    if (user?.role !== 'candidate') {
      return;
    }
    
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCountryGuideClick = (country: string) => {
    // Set the country filter
    setSearchCountry(country);
    
    // Scroll to jobs section
    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <AuthModal 
        open={authModalOpen} 
        onClose={() => {
          setAuthModalOpen(false);
          setAuthDefaultRole(undefined);
        }}
        defaultRole={authDefaultRole}
        onOpenResetModal={onOpenResetModal}
      />
      {selectedJob && (
        <ApplyToJobModal 
          open={applyModalOpen} 
          onClose={() => {
            setApplyModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onSuccess={() => loadJobs()}
        />
      )}
    
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#jobs" className="text-gray-600 hover:text-primary cursor-pointer">Poslovi</a>
            <button 
              onClick={handleCandidatesClick}
              className="text-gray-600 hover:text-primary"
            >
              Za kandidate
            </button>
            <button 
              onClick={handleEmployersClick}
              className="text-gray-600 hover:text-primary"
            >
              Za poslodavce
            </button>
            <button 
              onClick={handlePricingClick}
              className="text-gray-600 hover:text-primary"
            >
              Cjenovnik
            </button>
            {isAuthenticated && isPremium && (
              <div className="flex items-center gap-2 text-gray-600">
                <Crown className="w-4 h-4 text-gold" />
                <span>Premium poslovi</span>
              </div>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Pozdrav, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Odjava
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleLoginClick()}>
                Prijavi se
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-secondary overflow-hidden">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 bg-black/20">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JrZXJzJTIwdGVhbSUyMG9mZmljZXxlbnwxfHx8fDE3NTgxMDEyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Professional workers"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span className="text-sm">30s promo video</span>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Povezujemo Balkan s poslodavcima širom EU
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Provjereni oglasi, jasni koraci za radne dozvole i podrška na vašem jeziku.
          </p>
          
          {/* Trust Elements */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#F2C230]" />
              <span>500+ zadovoljnih kandidata</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#F2C230]" />
              <span>8 EU zemalja</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#F2C230]" />
              <span>1000+ aktivnih oglasa</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button 
              size="lg" 
              style={{ backgroundColor: '#F2C230', color: '#0E395C' }} 
              className="text-lg px-8 py-4 shadow-lg"
              onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Pronađi posao
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary shadow-lg transition-all"
                onClick={() => setAuthModalOpen(true)}
              >
                Prijavi se / Uloguj se
              </Button>
            )}
          </div>
          
          {/* Employer CTA */}
          <div className="mb-12">
            <Button 
              variant="ghost"
              size="lg"
              className="text-white hover:text-gold border-2 border-white/50 hover:border-gold px-8 py-3"
              onClick={handleEmployersClick}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Poslodavci – Objavite oglas
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={searchCountry || 'all'} onValueChange={setSearchCountry}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Izaberi zemlju" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve zemlje</SelectItem>
                  <SelectItem value="Nemačka">🇩🇪 Nemačka</SelectItem>
                  <SelectItem value="Austrija">🇦🇹 Austrija</SelectItem>
                  <SelectItem value="Holandija">🇳🇱 Holandija</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="Pretraži po poziciji ili kompaniji..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                style={{ backgroundColor: '#F2C230', color: '#0E395C' }} 
                className="px-8"
                onClick={handleSearch}
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                Pretraži
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Icons Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Licencirana firma</h3>
              <p className="text-sm text-gray-600">EU dozvole i u postupku dodatnih licenci</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Digitalni proces</h3>
              <p className="text-sm text-gray-600">Sva dokumentacija digitalno preko korisničkog ID naloga</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Osiguranje</h3>
              <p className="text-sm text-gray-600">Putno i zdravstveno (Wiener Städtische)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Euro className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Garancija troškova</h3>
              <p className="text-sm text-gray-600">Pokriće 500–1000 € u slučaju problema</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Provereni poslodavci</h3>
              <p className="text-sm text-gray-600">Saradnja samo sa licenciranim firmama</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section id="jobs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Najnoviji poslovi {jobs.length > 0 && `(${jobs.length})`}
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Učitavanje poslova...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nema dostupnih poslova trenutno.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.slice(0, 8).map((job) => (
                <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.isPremium ? 'border-2 border-gold/50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex flex-col gap-1">
                        {job.isPremium && <Badge className="bg-gold text-gold-foreground whitespace-nowrap"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
                        {job.verified && <Badge className="bg-green-100 text-green-800">✓</Badge>}
                      </div>
                    </div>
                    <p className="text-gray-600">{job.company}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">{job.location}</p>
                    <p className="font-semibold text-primary mb-3">{job.salary}</p>
                    {job.isPremium && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-xs text-green-800 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          🔒 Osiguranje i pokriće troškova od strane EuroConnect-a
                        </p>
                      </div>
                    )}
                    {job.isPremium && !isPremium && !isAdmin ? (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleApplyClick(job)}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Premium pristup potreban
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
                        onClick={() => handleApplyClick(job)}
                      >
                        {isAuthenticated && user?.role === 'candidate' ? 'Apliciraj odmah' : 
                         isAuthenticated && user?.role === 'employer' ? 'Pogledaj detalje' :
                         'Prijavi se za pristup'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Kako funkcioniše</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Kreiraj profil</h3>
              <p className="text-gray-600">Napravi profesionalni profil i učitaj svoja dokumenta</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Prijavi se na oglase</h3>
              <p className="text-gray-600">Pronađi i prijavi se na poslove koji odgovaraju tvojim vještinama</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F2C230] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Ostvari ponudu</h3>
              <p className="text-gray-600">Dobij ponudu posla i počni svoj put ka EU</p>
            </div>
          </div>
        </div>
      </section>

      {/* Country Guides */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Vodiči po zemljama</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { country: 'Nemačka', flag: '🇩🇪', jobs: '450+ poslova' },
              { country: 'Austrija', flag: '🇦🇹', jobs: '280+ poslova' },
              { country: 'Holandija', flag: '🇳🇱', jobs: '220+ poslova' }
            ].map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{guide.flag}</div>
                  <h3 className="text-xl font-semibold mb-2">{guide.country}</h3>
                  <p className="text-gray-600 mb-4">{guide.jobs}</p>
                  <Button variant="outline" className="w-full" onClick={() => handleCountryGuideClick(guide.country)}>
                    Pogledaj vodič
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Spremni za novi početak u EU?</h2>
          <p className="text-xl mb-8 opacity-90">Pridruži se hiljadama kandidata koji su našli posao preko naše platforme</p>
          <Button 
            size="lg" 
            style={{ backgroundColor: '#F2C230', color: '#0E395C' }} 
            className="text-lg px-8 py-4"
            onClick={() => {
              if (isAuthenticated) {
                // Navigate to appropriate dashboard
                if (isAdmin) {
                  onNavigate?.('backend-demo');
                } else if (user?.role === 'candidate') {
                  onNavigate?.('candidate-dashboard');
                } else if (user?.role === 'employer') {
                  onNavigate?.('employer-dashboard');
                }
              } else {
                setAuthModalOpen(true);
              }
            }}
          >
            {isAuthenticated ? 'Pogledaj svoj Dashboard' : 'Registruj se besplatno'}
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" variant="dark" className="mb-4" />
              <p className="text-gray-300 mb-4">
                Platforma koja povezuje radnike sa Balkana s vjerifikovanim poslodavcima u EU.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://wa.me/381637029064" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors cursor-pointer"
                  title="WhatsApp Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:office@euroconnect.eu"
                  className="hover:text-gold transition-colors cursor-pointer"
                  title="Pošaljite Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a 
                  href="tel:+381637029064"
                  className="hover:text-gold transition-colors cursor-pointer"
                  title="Pozovite nas"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Za kandidate</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#jobs" className="hover:text-white">Poslovi</a></li>
                <li><button onClick={handleCandidatesClick} className="hover:text-white">Kreiraj profil</button></li>
                <li><a href="#" className="hover:text-white">Vodiči</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Za poslodavce</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={handleEmployersClick} className="hover:text-white">Objavi posao</button></li>
                <li><button onClick={handlePricingClick} className="hover:text-white">Cjenovnik</button></li>
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sigurnost i pravni</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => onNavigate?.('insurance')} className="hover:text-white">Osiguranje radnika</button></li>
                <li><button onClick={() => onNavigate?.('licensing')} className="hover:text-white">Licenciranje</button></li>
                <li><button onClick={() => onNavigate?.('digital-docs')} className="hover:text-white">Digitalna dokumentacija</button></li>
                <li><a href="#" className="hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EuroConnect Europe. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}