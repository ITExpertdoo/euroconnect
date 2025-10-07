import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft,
  Shield,
  Heart,
  Plane,
  CheckCircle,
  Euro,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  LogOut,
  HelpCircle
} from 'lucide-react';

interface InsurancePageProps {
  onNavigate?: (page: string) => void;
}

export function InsurancePage({ onNavigate }: InsurancePageProps) {
  const { user, logout, isAuthenticated } = useAuth();

  const insuranceTypes = [
    {
      icon: Heart,
      title: 'Zdravstveno osiguranje',
      provider: 'Wiener Städtische',
      coverage: 'Do 100.000 EUR',
      description: 'Potpuna zdravstvena zaštita tokom vašeg boravka u EU zemljama',
      features: [
        'Hitna medicinska pomoć',
        'Bolničko lečenje',
        'Ambulantna nega',
        'Lekovi na recept',
        'Stomatološka hitna pomoć'
      ]
    },
    {
      icon: Plane,
      title: 'Putno osiguranje',
      provider: 'Wiener Städtische',
      coverage: 'Do 50.000 EUR',
      description: 'Zaštita tokom putovanja i prvog meseca boravka',
      features: [
        'Izgubljena ili oštećena prtljag',
        'Odloženi let',
        'Hitni povratak kući',
        'Pravna pomoć u inostranstvu',
        'Prevoz u hitnim slučajevima'
      ]
    }
  ];

  const coverageGuarantee = {
    title: 'Garancija troškova 500-1000 EUR',
    description: 'U slučaju problema sa poslodavcem, EuroConnect pokriva vaše troškove',
    scenarios: [
      {
        icon: AlertTriangle,
        title: 'Otkaz poslodavca',
        description: 'Ako poslodavac otkaže ugovor u prvih 90 dana, pokrivamo troškove povratka i smještaja',
        coverage: 'Do 1000 EUR'
      },
      {
        icon: Clock,
        title: 'Nejavljanje poslodavca',
        description: 'Ako se poslodavac ne pojavi ili ne pruži obećane uslove, pokrivamo sve troškove',
        coverage: 'Do 800 EUR'
      },
      {
        icon: Users,
        title: 'Nepojavljivanje na poslu',
        description: 'Ako posao ne postoji ili nije kao što je oglašen, kompenzujemo troškove',
        coverage: 'Do 500 EUR'
      }
    ]
  };

  const faqItems = [
    {
      question: 'Kada se aktivira pokriće troškova od 500-1000 EUR?',
      answer: 'Pokriće se automatski aktivira kada prijavite problem sa poslodavcem našem timu. Nakon verifikacije problema, sredstva se isplaćuju u roku od 5 radnih dana. Ovo pokriva troškove povratka kući, privremenog smještaja i izgubljene zarade.'
    },
    {
      question: 'Šta pokriva zdravstveno osiguranje?',
      answer: 'Naše zdravstveno osiguranje pokriva sve hitne medicinske intervencije, bolničko lečenje, ambulantnu negu, lekove na recept i stomatološku hitnu pomoć. Osiguranje važi tokom celog vašeg boravka u EU.'
    },
    {
      question: 'Da li moram sam da plaćam osiguranje?',
      answer: 'Ne! Osnovno zdravstveno i putno osiguranje je uključeno u cenu za sve Premium korisnike. Za kandidate koji nisu Premium članovi, osiguranje se može dodati za malu mesečnu naknadu od 15 EUR.'
    },
    {
      question: 'Kako funkcioniše digitalni ID nalog?',
      answer: 'Svaki kandidat dobija jedinstveni ID broj i digitalni nalog gde može da učitava i preuzima sve dokumente. Sve aktivnosti su zaštićene 2FA autentifikacijom, AES-256 šifrovanjem i u skladu su sa GDPR regulativom.'
    },
    {
      question: 'Kako se prijavljuje problem sa poslodavcem?',
      answer: 'Problem možete prijaviti direktno kroz platformu ili kontaktiranjem našeg support tima. Pružite sve relevantne informacije i dokaze, a naš tim će odmah započeti postupak verifikacije i aktivirati pokriće troškova.'
    },
    {
      question: 'Šta je GDPR i kako štiti moje podatke?',
      answer: 'GDPR (General Data Protection Regulation) je EU zakon koji štiti vaše lične podatke. To znači da vaši podaci ne mogu biti deljeni bez vaše saglasnosti, imate pravo da zatražite brisanje podataka, i svi podaci su sigurno šifrovani i zaštićeni.'
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
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Osiguranje i garancije
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Vaša sigurnost i zaštita su naš prioritet. Pružamo sveobuhvatno osiguranje i 
            garanciju troškova za sve naše kandidate.
          </p>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary">Vrste osiguranja</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Partnerstvo sa Wiener Städtische osigurava vrhunsku zaštitu
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {insuranceTypes.map((insurance, index) => {
            const Icon = insurance.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{insurance.title}</CardTitle>
                      <p className="text-sm text-gray-600">{insurance.provider}</p>
                      <Badge className="bg-green-100 text-green-800 mt-2">
                        Pokriće: {insurance.coverage}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{insurance.description}</p>
                  <div className="space-y-2">
                    {insurance.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Coverage Guarantee */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
                <Euro className="w-8 h-8 text-gold-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-3">{coverageGuarantee.title}</h2>
              <p className="text-gray-600">{coverageGuarantee.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {coverageGuarantee.scenarios.map((scenario, index) => {
                const Icon = scenario.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{scenario.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <Badge className="bg-gold text-gold-foreground">
                        {scenario.coverage}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-8 border-2 border-primary">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Kako funkcioniše garancija?</h3>
                    <p className="text-gray-600 mb-3">
                      U slučaju da poslodavac otkaže ugovor, ne pojavi se ili ne ispuni obećane uslove u prvih 90 dana rada, 
                      EuroConnect automatski aktivira pokriće troškova. To uključuje:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Troškove povratnog transporta u vašu zemlju</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Privremeni smještaj do 7 dana</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Kompenzaciju za izgubljenu zaradu (do 500 EUR)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Pomoć u pronalaženju zamjenskog posla</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Badge Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-gold/50">
            <CardHeader className="bg-gold/10">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-gold-foreground" />
                Premium osiguranje i zaštita
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Svi Premium poslovi na našoj platformi dolaze sa dodatnom oznakom:
              </p>
              <div className="bg-white border-2 border-gold/30 rounded-lg p-4 inline-flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-gold-foreground" />
                <span className="font-semibold">🔒 Osiguranje i pokriće troškova od strane EuroConnect-a</span>
              </div>
              <p className="text-gray-600">
                Ovaj badge garantuje da je poslodavac prošao našu striktnu verifikaciju i da ste vi kao kandidat 
                potpuno zaštićeni našim osiguranjem i garancijom troškova. Možete biti sigurni da nećete snositi 
                finansijske gubitke u slučaju problema sa poslodavcem.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary mb-3">Često postavljana pitanja (FAQ)</h2>
              <p className="text-gray-600">Odgovori na najčešća pitanja o osiguranju i zaštiti</p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Spremni za siguran početak?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Pridružite se hiljadama zaštićenih kandidata i započnite svoju EU karijeru bez brige
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
              className="text-lg px-8"
              onClick={() => onNavigate?.(isAuthenticated ? 'candidate-dashboard' : 'landing')}
            >
              {isAuthenticated ? 'Pogledaj poslove' : 'Registruj se besplatno'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => onNavigate?.('pricing')}
            >
              Pogledaj Premium planove
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
