import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Download,
  Globe,
  Award,
  Building2,
  LogOut
} from 'lucide-react';

interface LicensingPageProps {
  onNavigate?: (page: string) => void;
}

export function LicensingPage({ onNavigate }: LicensingPageProps) {
  const { user, logout, isAuthenticated } = useAuth();

  const licenses = [
    {
      name: 'EU Agencija za zapošljavanje',
      country: 'Njemačka',
      status: 'active',
      issueDate: '15.02.2023',
      expiryDate: '15.02.2028',
      licenseNumber: 'DE-EA-2023-5847',
      description: 'Licenca za pružanje usluga zapošljavanja i posredovanja radne snage u EU'
    },
    {
      name: 'Austrijsko posredovanje rada',
      country: 'Austrija',
      status: 'active',
      issueDate: '10.05.2023',
      expiryDate: '10.05.2028',
      licenseNumber: 'AT-AMS-2023-1245',
      description: 'Dozvola za posredovanje između poslodavaca i kandidata u Austriji'
    },
    {
      name: 'Holandska agencija za radnike',
      country: 'Holandija',
      status: 'pending',
      issueDate: '-',
      expiryDate: '-',
      licenseNumber: 'NL-PENDING-2024',
      description: 'U procesu dobijanja licence za rad u Holandiji'
    },
    {
      name: 'Švajcarska radna dozvola',
      country: 'Švicarska',
      status: 'pending',
      issueDate: '-',
      expiryDate: '-',
      licenseNumber: 'CH-PENDING-2024',
      description: 'U procesu dobijanja licence za Švicarsko tržište rada'
    }
  ];

  const regulations = [
    {
      title: 'GDPR Usklađenost',
      description: 'Potpuna usklađenost sa EU General Data Protection Regulation',
      icon: Shield,
      status: 'Aktivno'
    },
    {
      title: 'ISO 9001:2015',
      description: 'Certifikat kvaliteta usluga i upravljanja',
      icon: Award,
      status: 'Aktivno'
    },
    {
      title: 'EU Direktiva o radnicima',
      description: 'Usklađenost sa EU Directive 2008/104/EC',
      icon: FileText,
      status: 'Aktivno'
    },
    {
      title: 'Osiguranje poslovanja',
      description: 'Profesionalna odgovornost do 2M EUR',
      icon: Building2,
      status: 'Aktivno'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aktivna</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />U procesu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Nepoznato</Badge>;
    }
  };

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
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Licenciranje i pravna usklađenost
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            EuroConnect Europe je potpuno licencirana agencija za zapošljavanje sa dozvolama u više EU zemalja. 
            Transparentnost i usklađenost sa propisima su naš prioritet.
          </p>
        </div>
      </section>

      {/* Licenses Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary">Naše licence</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Posjedujemo sve potrebne licence za legalno posredovanje rada između Balkana i EU zemalja
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {licenses.map((license, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{license.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {license.country}
                    </p>
                  </div>
                  {getStatusBadge(license.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{license.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Broj licence:</span>
                    <span className="font-semibold">{license.licenseNumber}</span>
                  </div>
                  {license.status === 'active' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Datum izdavanja:</span>
                        <span className="font-semibold">{license.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Važi do:</span>
                        <span className="font-semibold">{license.expiryDate}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Download className="w-4 h-4 mr-2" />
                        Preuzmi sertifikat (PDF)
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Regulations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">Pravila i regulativa</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Usklađeni smo sa svim važećim EU regulativama i međunarodnim standardima
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {regulations.map((regulation, index) => {
              const Icon = regulation.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{regulation.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{regulation.description}</p>
                    <Badge className="bg-green-100 text-green-800">{regulation.status}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Transparentnost i prava korisnika</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Jasni ugovori</h4>
                  <p className="text-sm text-gray-600">
                    Svi ugovori su napisani jasnim jezikom na vašem maternjem jeziku, bez skrivenih troškova
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Zaštita podataka</h4>
                  <p className="text-sm text-gray-600">
                    Vaši lični podaci su zaštićeni u skladu sa GDPR regulativom i čuvaju se na sigurnim EU serverima
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Pravo na prigovor</h4>
                  <p className="text-sm text-gray-600">
                    Imate pravo na prigovor i podršku našeg tima u bilo kojem trenutku procesa
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Osiguranje i garancije</h4>
                  <p className="text-sm text-gray-600">
                    Svaki kandidat je osiguran i pokriveni su troškovi u slučaju problema sa poslodavcem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Imate pitanja o licenciranju?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Naš tim je spreman da vam pruži sve potrebne informacije i dokumentaciju
          </p>
          <Button 
            size="lg" 
            style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
            className="text-lg px-8"
          >
            Kontaktirajte nas
          </Button>
        </div>
      </section>
    </div>
  );
}
