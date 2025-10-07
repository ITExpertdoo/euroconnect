import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Lock,
  Shield,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  KeyRound,
  Database,
  Cloud,
  Smartphone
} from 'lucide-react';

interface DigitalDocumentationPageProps {
  onNavigate?: (page: string) => void;
}

export function DigitalDocumentationPage({ onNavigate }: DigitalDocumentationPageProps) {
  const { user, logout, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Cloud,
      title: 'Sigurno skladištenje u oblaku',
      description: 'Svi vaši dokumenti su bezbedno sačuvani na sigurnim EU serverima sa višestrukim backup-om'
    },
    {
      icon: Upload,
      title: 'Brzo otpremanje dokumenata',
      description: 'Jednostavan drag-and-drop interfejs za otpremanje PDF-ova, slika i skeniranih dokumenata'
    },
    {
      icon: Download,
      title: 'Pristup bilo kada, bilo gde',
      description: 'Preuzmite svoje dokumente u bilo kom trenutku sa bilo kojeg uređaja sa internet konekcijom'
    },
    {
      icon: Eye,
      title: 'Praćenje statusa dokumenata',
      description: 'Vidite status svakog dokumenta - da li je poslat, pregledan ili odobren'
    },
    {
      icon: Lock,
      title: 'Šifriranje podataka',
      description: 'Vaši dokumenti su šifrirani sa najnovijim AES-256 šifrovanjem'
    },
    {
      icon: Shield,
      title: 'GDPR usklađenost',
      description: 'Potpuna zaštita vaših ličnih podataka u skladu sa EU regulativom'
    }
  ];

  const documentTypes = [
    { name: 'CV/Biografija', required: true },
    { name: 'Diploma/Svjedočanstvo', required: true },
    { name: 'Fotografija za pasoš', required: true },
    { name: 'Kopija pasoša', required: true },
    { name: 'Medicinska potvrda', required: false },
    { name: 'Potvrda o nekažnjavanju', required: false },
    { name: 'Certifikati i obuke', required: false },
    { name: 'Radne reference', required: false }
  ];

  const securityFeatures = [
    {
      icon: KeyRound,
      title: 'Dvofaktorska autentifikacija (2FA)',
      description: 'Dodatni nivo zaštite vašeg naloga sa SMS ili email verifikacijom'
    },
    {
      icon: Database,
      title: 'Audit log',
      description: 'Potpuni uvid u sve aktivnosti na vašem nalogu - ko je pristupio i kada'
    },
    {
      icon: Smartphone,
      title: 'Mobilni pristup',
      description: 'Pristupite svojim dokumentima sa mobilnog telefona bilo kada vam je potrebno'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Kreirajte digitalni ID nalog',
      description: 'Registrujte se na platformi i dobijete svoj jedinstveni kandidatski ID broj'
    },
    {
      step: '2',
      title: 'Otpremite dokumente',
      description: 'Učitajte sve potrebne dokumente u skladu sa našim pravilima (boja, min 200 DPI)'
    },
    {
      step: '3',
      title: 'Verifikacija',
      description: 'Naš tim proverava autentičnost i kvalitet vaših dokumenata'
    },
    {
      step: '4',
      title: 'Digitalna arhiva',
      description: 'Odobreni dokumenti se čuvaju u vašoj digitalnoj arhivi, dostupni 24/7'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('landing')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazad
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">EC</span>
              </div>
              <span className="text-xl font-semibold text-primary">EuroConnect Europe</span>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Pozdrav, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Odjava
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Digitalna dokumentacija
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Vaš digitalni ID nalog za sve dokumente na jednom mestu. 
            Bezbedan, brz i jednostavan pristup dokumentima 24/7.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary">Zašto digitalna dokumentacija?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Moderna rešenja za upravljanje vašim dokumentima - bezbedno, brzo i jednostavno
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Kako funkcioniše?</h2>
          
          <div className="max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">Tipovi dokumenata</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Lista dokumenata koja možete učitati u vaš digitalni ID nalog
          </p>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {documentTypes.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>{doc.name}</span>
                      </div>
                      {doc.required ? (
                        <Badge className="bg-red-100 text-red-800">Obavezno</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Opciono</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Upload Guidelines */}
            <Card className="mt-6 border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  Važna pravila za upload dokumenata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">Dozvoljeni formati: <strong>PDF, JPG, PNG</strong></p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">Dokumenti moraju biti <strong>skenirani u boji</strong></p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">Minimalna rezolucija: <strong>200 DPI</strong></p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">Jasno vidljivi svi detalji i tekst</p>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-4">
                  <p className="text-sm text-red-800">
                    <strong>⚠️ ZABRANJENO:</strong> Crno-beli skenovi, fotografije sa telefona, mutni ili konvertovani fajlovi neće biti prihvaćeni i biće automatski odbijeni.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">Bezbednost i zaštita</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Vaši dokumenti su zaštićeni najvišim standardima bezbednosti
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Spremni da započnete?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Kreirajte svoj digitalni ID nalog i učitajte dokumente u nekoliko minuta
          </p>
          <Button 
            size="lg" 
            style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
            className="text-lg px-8"
            onClick={() => onNavigate?.(isAuthenticated ? 'candidate-dashboard' : 'landing')}
          >
            {isAuthenticated ? 'Pogledaj svoj Dashboard' : 'Registruj se besplatno'}
          </Button>
        </div>
      </section>
    </div>
  );
}
