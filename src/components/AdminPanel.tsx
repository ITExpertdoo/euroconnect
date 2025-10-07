import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  Crown,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
  Database,
  Loader2,
  Settings,
  Eye,
  EyeOff,
  Save,
  CheckCircle
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { createJobsForEmployers } from '../utils/seedDemoData';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { EmailConfigSection } from './EmailConfigSection';

interface AdminPanelProps {
  onNavigate?: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  // Email settings state
  const [emailConfig, setEmailConfig] = useState<any>(null);
  const [emailForm, setEmailForm] = useState({
    provider: 'resend',
    apiKey: '',
    fromEmail: 'noreply@euroconnect.eu',
    fromName: 'EuroConnect Europe',
    enabled: false,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  
  // Payment Configuration State
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [configForm, setConfigForm] = useState({
    provider: 'stripe',
    publishableKey: '',
    secretKey: '',
    enabled: true,
  });

  const fetchData = async () => {
    setLoading(true);
    
    const [usersRes, appsRes, paymentsRes, configRes, emailRes] = await Promise.all([
      api.getAllUsers(),
      api.getAllApplications(),
      api.getAllPayments(),
      api.getPaymentConfig(),
      api.getEmailConfig(),
    ]);

    if (usersRes.success) setUsers(usersRes.data);
    if (appsRes.success) setApplications(appsRes.data);
    if (paymentsRes.success) setPayments(paymentsRes.data);
    
    if (configRes.success && configRes.data) {
      setPaymentConfig(configRes.data);
      setConfigForm({
        provider: configRes.data.provider || 'stripe',
        publishableKey: configRes.data.publishableKey || '',
        secretKey: '', // Never auto-fill secret key for security
        enabled: configRes.data.enabled !== false,
      });
    }
    
    if (emailRes.success && emailRes.data) {
      setEmailConfig(emailRes.data);
      setEmailForm({
        provider: emailRes.data.provider || 'resend',
        apiKey: '',
        fromEmail: emailRes.data.fromEmail || 'noreply@euroconnect.eu',
        fromName: emailRes.data.fromName || 'EuroConnect Europe',
        enabled: emailRes.data.enabled || false,
      });
    }

    setLoading(false);
  };
  
  const handleSaveEmailConfig = async () => {
    setSavingEmail(true);
    try {
      const result = await api.saveEmailConfig(emailForm);
      
      if (result.success) {
        toast.success('✅ Email konfiguracija sačuvana!');
        await fetchData();
        setShowApiKey(false);
      } else {
        toast.error(result.error || 'Greška pri čuvanju');
      }
    } catch (error) {
      console.error('Error saving email config:', error);
      toast.error('Greška pri čuvanju konfiguracije');
    } finally {
      setSavingEmail(false);
    }
  };
  
  const handleTestEmail = async () => {
    if (!user?.email) {
      toast.error('Nema email adrese za test');
      return;
    }
    
    try {
      toast.info('Slanje test email-a...');
      const result = await api.sendTestEmail(user.email);
      
      if (result.success) {
        toast.success(`✅ Test email poslat na ${user.email}!`);
      } else {
        toast.error(result.error || 'Greška pri slanju');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Greška pri slanju test email-a');
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const handleSavePaymentConfig = async () => {
    setSavingConfig(true);
    
    try {
      const result = await api.savePaymentConfig(configForm);
      
      if (result.success) {
        toast.success('✅ Payment konfiguracija uspešno sačuvana!');
        await fetchData();
      } else {
        toast.error(`Greška: ${result.error || 'Nije moguće sačuvati konfiguraciju'}`);
      }
    } catch (error) {
      console.error('Error saving payment config:', error);
      toast.error('Greška pri čuvanju payment konfiguracije');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSeedDemoData = async () => {
    setSeeding(true);
    toast.info('Kreiranje demo podataka...');
    
    try {
      const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a`;
      
      // Create demo employers
      const employers = [
        { name: 'Stefan Petrović', email: 'stefan@poslodavac.rs', password: 'demo123', role: 'employer' as const },
        { name: 'Marija Nikolić', email: 'marija@poslodavac.rs', password: 'demo123', role: 'employer' as const },
      ];

      // Create demo candidates
      const candidates = [
        { name: 'Nikola Jovanović', email: 'nikola@kandidat.rs', password: 'demo123', role: 'candidate' as const },
        { name: 'Ana Stojanović', email: 'ana@kandidat.rs', password: 'demo123', role: 'candidate' as const },
        { name: 'Milica Đorđević', email: 'milica@kandidat.rs', password: 'demo123', role: 'candidate' as const },
      ];

      let employersCreated = 0;
      let candidatesCreated = 0;
      
      // Create users and collect employer tokens
      const employerTokens: string[] = [];
      
      for (const userData of employers) {
        // Try to login first - if user exists, use existing account
        let loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        });
        
        // If login fails, try to create new user
        if (!loginResponse.ok) {
          console.log(`Attempting to create new employer: ${userData.email}`);
          const signupResult = await api.signup(userData);
          
          // If signup fails because user exists, try login again
          if (!signupResult.success) {
            console.log('Signup failed, trying login again:', signupResult.error);
            
            // Try login one more time in case user exists
            loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                email: userData.email,
                password: userData.password,
              }),
            });
            
            if (!loginResponse.ok) {
              console.error('Failed to create or login employer:', userData.email);
              continue;
            }
            console.log(`Using existing employer: ${userData.email}`);
          } else {
            employersCreated++;
            
            // Login after successful signup
            loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                email: userData.email,
                password: userData.password,
              }),
            });
            console.log(`Created new employer: ${userData.email}`);
          }
        } else {
          console.log(`Using existing employer: ${userData.email}`);
        }
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          employerTokens.push(loginData.access_token);
        }
      }
      
      // Create candidates (or use existing ones)
      for (const userData of candidates) {
        // Try to login first
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        });
        
        // If login fails, try to create new user
        if (!loginResponse.ok) {
          console.log(`Attempting to create new candidate: ${userData.email}`);
          const signupResult = await api.signup(userData);
          
          if (signupResult.success) {
            candidatesCreated++;
            console.log(`Created new candidate: ${userData.email}`);
          } else {
            console.log('Signup failed (user may already exist):', signupResult.error);
          }
        } else {
          console.log(`Using existing candidate: ${userData.email}`);
        }
      }

      // Create demo jobs with employer tokens
      console.log(`Collected ${employerTokens.length} employer tokens for creating jobs`);
      
      if (employerTokens.length > 0) {
        toast.info(`Kreiranje poslova sa ${employerTokens.length} poslodavca...`);
        const jobResults = await createJobsForEmployers(employerTokens);
        const successfulJobs = jobResults.filter(r => r.success).length;
        const totalJobs = jobResults.length;
        
        if (successfulJobs > 0) {
          toast.success(`Uspešno kreirano ${successfulJobs}/${totalJobs} demo poslova!`);
        } else if (successfulJobs === 0 && totalJobs > 0) {
          toast.warning('Poslovi nisu kreirani. Možda već postoje.');
        }
      } else {
        toast.error('Nije moguće kreirati poslove - nedostaju employer tokeni');
      }

      // Summary message
      const summary = [];
      if (employersCreated > 0) summary.push(`${employersCreated} poslodavca`);
      if (candidatesCreated > 0) summary.push(`${candidatesCreated} kandidata`);
      
      if (summary.length > 0) {
        toast.success(`✅ Kreirano: ${summary.join(', ')}`);
      } else {
        toast.info('📋 Korišteni postojeći demo podaci');
      }
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Greška pri kreiranju demo podataka');
    } finally {
      setSeeding(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Pristup zabranjen</h2>
          <p className="text-gray-600">Samo administratori mogu pristupiti ovoj stranici.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje podataka...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Ukupno Korisnika',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Premium Korisnici',
      value: users.filter(u => u.isPremium).length,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Ukupne Aplikacije',
      value: applications.length,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Ukupna Zarada',
      value: `€${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (user?.role === 'candidate') {
                onNavigate?.('candidate-dashboard');
              } else if (user?.role === 'employer') {
                onNavigate?.('employer-dashboard');
              } else {
                onNavigate?.('landing');
              }
            }}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad
          </Button>
          
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-gold" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-white/80 mt-2">Upravljanje sistemom EuroConnect</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Seed Demo Data Button */}
        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Demo Podaci</h3>
                  <p className="text-sm text-blue-700">
                    {users.length <= 1 
                      ? 'Trenutno nema demo korisnika. Kreirajte demo poslodavce, kandidate i poslove.'
                      : `Sistem ima ${users.length} korisnika i ${applications.length} aplikacija.`
                    }
                  </p>
                </div>
                <Button
                  onClick={handleSeedDemoData}
                  disabled={seeding}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {seeding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kreiranje...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Kreiraj Demo Podatke
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="users">Korisnici</TabsTrigger>
            <TabsTrigger value="applications">Aplikacije</TabsTrigger>
            <TabsTrigger value="payments">Plaćanja</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Podešavanja
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Svi Korisnici</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Ime</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Uloga</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Registrovan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nema korisnika u sistemu.</p>
                            <p className="text-sm mt-1">Kliknite "Kreiraj Demo Podatke" da dodate demo korisnike.</p>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <Badge variant={user.role === 'employer' ? 'default' : 'secondary'}>
                                {user.role === 'employer' ? 'Poslodavac' : 'Kandidat'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                {user.isAdmin && (
                                  <Badge className="bg-gold text-gold-foreground">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                                {user.isPremium && (
                                  <Badge className="bg-purple-600 text-white">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString('sr-RS')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Sve Aplikacije</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Kandidat</th>
                        <th className="text-left p-3">Posao</th>
                        <th className="text-left p-3">Kompanija</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nema aplikacija u sistemu.</p>
                            <p className="text-sm mt-1">Aplikacije će se pojaviti kada kandidati počnu da apliciraju.</p>
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <div className="font-semibold">{app.candidateName}</div>
                                <div className="text-sm text-gray-600">{app.candidateEmail}</div>
                              </div>
                            </td>
                            <td className="p-3">{app.job?.title || 'N/A'}</td>
                            <td className="p-3">{app.job?.company || 'N/A'}</td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  app.status === 'accepted'
                                    ? 'default'
                                    : app.status === 'rejected'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {app.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {new Date(app.createdAt).toLocaleDateString('sr-RS')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Sva Plaćanja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Korisnik ID</th>
                        <th className="text-left p-3">Plan</th>
                        <th className="text-left p-3">Način Plaćanja</th>
                        <th className="text-left p-3">Iznos</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nema plaćanja u sistemu.</p>
                            <p className="text-sm mt-1">Plaćanja će se pojaviti kada korisnici kupe premium pristup.</p>
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm font-mono">{payment.userId.slice(0, 8)}...</td>
                            <td className="p-3">
                              <Badge variant="secondary">{payment.planType}</Badge>
                            </td>
                            <td className="p-3 capitalize">{payment.paymentMethod}</td>
                            <td className="p-3 font-semibold">
                              {payment.currency} {payment.amount.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={payment.status === 'completed' ? 'default' : 'secondary'}
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {new Date(payment.createdAt).toLocaleDateString('sr-RS')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              {/* Section Heading */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">Sistemska Podešavanja</h2>
                <p className="text-gray-600">Konfiguriši payment gateway i email notifikacije</p>
              </div>

              {/* Payment Configuration Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-primary">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-primary">Payment Configuration</h3>
                </div>
                
                {/* Current Payment Status Card */}
                <Card className={paymentConfig?.enabled ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {paymentConfig?.enabled ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Settings className="w-6 h-6 text-yellow-600" />
                      )}
                      <div>
                        <h3 className={`font-semibold ${paymentConfig?.enabled ? 'text-green-900' : 'text-yellow-900'}`}>
                          {paymentConfig?.enabled ? 'Live Payment Aktivno' : 'Payment Nije Konfigurisan'}
                        </h3>
                        <p className={`text-sm ${paymentConfig?.enabled ? 'text-green-700' : 'text-yellow-700'}`}>
                          {paymentConfig?.enabled 
                            ? `Provider: ${paymentConfig.provider?.toUpperCase() || 'N/A'}` 
                            : 'Konfiguriši payment gateway da omogućiš live plaćanja'
                          }
                        </p>
                      </div>
                    </div>
                    <Badge variant={paymentConfig?.enabled ? 'default' : 'secondary'} className="text-sm">
                      {paymentConfig?.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Gateway Konfiguracija</CardTitle>
                  <p className="text-sm text-gray-600">
                    Konfiguriši Stripe ili drugi payment gateway za live plaćanja.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Provider
                    </label>
                    <select
                      value={configForm.provider}
                      onChange={(e) => setConfigForm({ ...configForm, provider: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Izaberi payment gateway koji ćeš koristiti
                    </p>
                  </div>

                  {/* Publishable Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publishable Key (Public)
                    </label>
                    <Input
                      type="text"
                      value={configForm.publishableKey}
                      onChange={(e) => setConfigForm({ ...configForm, publishableKey: e.target.value })}
                      placeholder="pk_live_..."
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ovaj ključ će biti vidljiv u frontend kodu
                    </p>
                  </div>

                  {/* Secret Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key (Private)
                    </label>
                    <div className="relative">
                      <Input
                        type={showSecretKey ? 'text' : 'password'}
                        value={configForm.secretKey}
                        onChange={(e) => setConfigForm({ ...configForm, secretKey: e.target.value })}
                        placeholder={paymentConfig?.hasSecretKey ? '••••••••••••' : 'sk_live_...'}
                        className="font-mono pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showSecretKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {paymentConfig?.hasSecretKey 
                        ? 'Secret key je već sačuvan. Unesi novi samo ako želiš da ga promeniš.'
                        : 'Ovaj ključ će biti bezbedno sačuvan na serveru'
                      }
                    </p>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Aktiviraj Live Payment</h4>
                      <p className="text-sm text-gray-600">
                        Omogući korisnicima da plaćaju preko payment gateway-a
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.enabled}
                        onChange={(e) => setConfigForm({ ...configForm, enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSavePaymentConfig}
                      disabled={savingConfig || !configForm.publishableKey}
                      className="w-full"
                      size="lg"
                    >
                      {savingConfig ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Čuvanje...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Sačuvaj Konfiguraciju
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">📘 Kako dobiti API ključeve?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Stripe:</strong> Poseti <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a></li>
                      <li>• <strong>PayPal:</strong> Idi na <a href="https://developer.paypal.com/developer/applications" target="_blank" rel="noopener noreferrer" className="underline">PayPal Developer</a></li>
                      <li>• <strong>Square:</strong> Kreiraj aplikaciju na <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="underline">Square Developer</a></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Email Configuration Section */}
              <EmailConfigSection
                emailConfig={emailConfig}
                emailForm={emailForm}
                setEmailForm={setEmailForm}
                showApiKey={showApiKey}
                setShowApiKey={setShowApiKey}
                savingEmail={savingEmail}
                handleSaveEmailConfig={handleSaveEmailConfig}
                handleTestEmail={handleTestEmail}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
