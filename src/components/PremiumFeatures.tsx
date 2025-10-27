import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Crown, 
  Lock, 
  Check, 
  Star, 
  Bell, 
  Smartphone, 
  Shield, 
  RefreshCw,
  Zap,
  MessageSquare,
  FileText,
  Globe,
  Euro,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { PremiumPaymentModal } from './PremiumPaymentModal';
import { useAuth } from '../contexts/AuthContext';

interface PremiumFeaturesProps {
  onNavigate?: (page: string) => void;
}

export function PremiumFeatures({ onNavigate }: PremiumFeaturesProps) {
  const { isPremium, isAdmin } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'enterprise'>('professional');

  const handlePlanSelect = (plan: 'basic' | 'professional' | 'enterprise') => {
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  const premiumJobs = [
    {
      title: 'Senior Građevinski inženjer',
      company: 'Deutsche Bau AG',
      location: 'München, Nemačka',
      salary: '€4,500-5,200',
      type: 'Ekskluzivno',
      benefits: ['Visa podrška', 'Smještaj uključen', 'Porodični paket']
    },
    {
      title: 'IT Specialist - DevOps',
      company: 'TechCorp Austria',
      location: 'Beč, Austrija',
      salary: '€5,000-6,500',
      type: 'Premium',
      benefits: ['Remote mogućnost', 'Relokacija paket', 'Bonus €2000']
    },
    {
      title: 'Medicinski tehničar',
      company: 'HealthCare Netherlands',
      location: 'Amsterdam, Holandija',
      salary: '€3,800-4,500',
      type: 'Ekskluzivno',
      benefits: ['Stručno usavršavanje', 'Zdravstveno', 'Penzijski plan']
    }
  ];

  const pricingPlans = [
    {
      id: 'basic' as const,
      name: 'Basic Premium',
      price: '€9.99',
      period: '/1 mesec',
      popular: false,
      features: [
        'Pristup svim premium poslovima',
        'Email notifikacije',
        'Prioritetna podrška',
        'Mesečni newsletteri'
      ]
    },
    {
      id: 'professional' as const,
      name: 'Professional',
      price: '€29.99',
      period: '/3 meseca',
      popular: true,
      features: [
        'Sve iz Basic paketa',
        'Premium badge na profilu',
        'Direktan kontakt sa poslodavcima',
        'CV pregled od stručnjaka',
        'Personalizovane preporuke',
        'Early access na nove poslove'
      ]
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: '€99.99',
      period: '/1 godina',
      popular: false,
      features: [
        'Sve iz Professional paketa',
        'Lični karierni savetnik',
        'Prioritetne aplikacije',
        'Ekskluzivni oglasi',
        'Coaching sesije',
        'Unlimited podrška'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('candidate-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad na Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-[#F2C230]" />
            <h1 className="text-3xl font-bold text-primary">Premium Features</h1>
          </div>
          <p className="text-gray-600 mt-2">Pristupite ekskluzivnim poslovima i dodatnim pogodnostima</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Premium Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-[#F2C230]" />
              <h2 className="text-2xl font-bold">EuroConnect Premium</h2>
            </div>
            <p className="text-lg mb-6 opacity-90">
              Pretplatnici dobijaju oglase direktno u inbox i na telefon. Budite prvi koji će vidjeti nova radna mjesta!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#F2C230]" />
                <span>Instant notifikacije</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-[#F2C230]" />
                <span>Mobilna aplikacija</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#F2C230]" />
                <span>Prioritetna podrška</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Ekskluzivni poslovi</h2>
            <Badge className="bg-[#F2C230] text-primary">Premium Only</Badge>
          </div>
          
          <div className="grid gap-6">
            {premiumJobs.map((job, index) => (
              <Card key={index} className="relative border-2 border-[#F2C230]/30 hover:border-[#F2C230] transition-colors">
                <div className="absolute -top-3 left-6">
                  <Badge className="bg-[#F2C230] text-primary">
                    <Crown className="w-3 h-3 mr-1" />
                    {job.type}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Globe className="w-3 h-3" />
                        {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {job.salary}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Premium pristup potreban</span>
                    </div>
                    <Button 
                      style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
                      onClick={() => handlePlanSelect('professional')}
                      disabled={isPremium || isAdmin}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {isPremium || isAdmin ? 'Unlocked' : 'Unlock Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">Izaberite vaš plan</h2>
          
          {(isPremium || isAdmin) && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  {isAdmin ? 'Admin pristup - svi premium sadržaji su dostupni' : 'Vi ste Premium korisnik!'}
                </span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-[#F2C230] scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#F2C230] text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Najpopularniji
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    style={{ 
                      backgroundColor: plan.popular ? '#F2C230' : 'transparent', 
                      color: plan.popular ? '#0E395C' : '#0E395C',
                      border: plan.popular ? 'none' : '1px solid #0E395C'
                    }}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={isPremium || isAdmin}
                  >
                    {isPremium || isAdmin ? '✓ Aktivan' : 'Izaberi plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantee Section */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Garancija zamjene posla</h3>
                <p className="text-green-700">
                  Ako ne dobijete ponudu posla u prvih 30 dana korišćenja Premium plana, 
                  vratićemo vam novac ili produžiti pristup bez dodatne naplate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Add-on */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Osiguranje boravka u paketu</h3>
                  <p className="text-blue-700 mb-2">
                    Dodatno osiguranje koje pokriva zdravstvene troškove i pomoć pri adaptaciji u novoj zemlji.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <span>✓ Zdravstveno osiguranje</span>
                    <span>✓ Pravna pomoć</span>
                    <span>✓ 24/7 podrška</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-800">+€15/mjesec</p>
                <Button variant="outline" className="mt-2 border-blue-600 text-blue-600">
                  Dodaj u plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Poređenje funkcija</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Funkcija</th>
                    <th className="text-center p-4">Besplatno</th>
                    <th className="text-center p-4 bg-[#F2C230]/10">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Pristup osnovnim poslovima', free: true, premium: true },
                    { feature: 'Ekskluzivni premium poslovi', free: false, premium: true },
                    { feature: 'Instant notifikacije', free: false, premium: true },
                    { feature: 'Prioritetna podrška', free: false, premium: true },
                    { feature: 'Personalizovane preporuke', free: false, premium: true },
                    { feature: 'Mobilna aplikacija', free: false, premium: true },
                    { feature: 'Analitika profila', free: false, premium: true },
                  ].map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{row.feature}</td>
                      <td className="text-center p-4">
                        {row.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="text-center p-4 bg-[#F2C230]/5">
                        {row.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Spremni da počnete?</h2>
          <p className="text-gray-600 mb-6">Pridružite se hiljadama uspješnih kandidata koji koriste EuroConnect Premium</p>
          <Button 
            size="lg" 
            style={{ backgroundColor: '#F2C230', color: '#0E395C' }} 
            className="text-lg px-8 py-4"
            onClick={() => handlePlanSelect('professional')}
            disabled={isPremium || isAdmin}
          >
            <Crown className="w-5 h-5 mr-2" />
            {isPremium || isAdmin ? 'Premium Aktivan' : 'Aktiviraj Premium odmah'}
          </Button>
        </div>
      </div>

      <PremiumPaymentModal 
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}