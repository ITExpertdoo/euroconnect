import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import {
  Crown,
  TrendingUp,
  Star,
  Check,
  Edit,
  Save,
  X,
  Briefcase,
  Users,
  Zap,
  Target,
  Award,
  Shield,
  ArrowLeft
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  icon: any;
  color: string;
  popular?: boolean;
}

interface PricingPageProps {
  onNavigate?: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [jobBoostPlans, setJobBoostPlans] = useState<PricingPlan[]>([
    {
      id: 'boost',
      name: 'Boost',
      price: 19.99,
      duration: '7 dana',
      icon: TrendingUp,
      color: 'blue',
      features: [
        'Povećana pozicija u listingu',
        '3x više pregleda',
        'Prioritet u pretrazi',
        'Aktivan 7 dana'
      ]
    },
    {
      id: 'highlight',
      name: 'Highlight',
      price: 29.99,
      duration: '30 dana',
      icon: Star,
      color: 'yellow',
      popular: true,
      features: [
        'Zlatni okvir oglasa',
        'Istaknuta pozicija',
        '5x više pregleda',
        'Premium badge',
        'Aktivan 30 dana'
      ]
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 49.99,
      duration: '30 dana',
      icon: Crown,
      color: 'gold',
      features: [
        'Top pozicija u listingu',
        'Premium dizajn oglasa',
        '10x više pregleda',
        'Featured badge',
        'Prioritet u email listama',
        'Aktivan 30 dana'
      ]
    }
  ]);

  const [packagePlans, setPackagePlans] = useState<PricingPlan[]>([
    {
      id: 'starter',
      name: 'Starter paket',
      price: 99,
      duration: 'mjesečno',
      icon: Briefcase,
      color: 'blue',
      features: [
        '5 aktivnih oglasa',
        'Osnovna statistika',
        'Email podrška',
        'Standardna pozicija'
      ]
    },
    {
      id: 'professional',
      name: 'Professional paket',
      price: 199,
      duration: 'mjesečno',
      icon: Target,
      color: 'purple',
      popular: true,
      features: [
        '15 aktivnih oglasa',
        'Napredna statistika',
        'Prioritet podrška',
        '5 Featured oglasa mjesečno',
        'Kompanijski profil',
        'Pristup bazi kandidata'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise paket',
      price: 499,
      duration: 'mjesečno',
      icon: Award,
      color: 'gold',
      features: [
        'Neograničeno oglasa',
        'Kompletna analitika',
        'Dedicirani account manager',
        'Unlimited Featured oglasi',
        'Premium kompanijski profil',
        'API pristup',
        'Custom branding',
        'Prioritet u pretrazi'
      ]
    }
  ]);

  const handleEditPlan = (planId: string, newPrice: number, type: 'job' | 'package') => {
    if (type === 'job') {
      setJobBoostPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, price: newPrice } : plan
      ));
    } else {
      setPackagePlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, price: newPrice } : plan
      ));
    }
  };

  const savePricing = () => {
    // TODO: Save to backend
    toast.success('Cjenovnik ažuriran!');
    setEditMode(false);
  };

  const PlanCard = ({ plan, type }: { plan: PricingPlan; type: 'job' | 'package' }) => {
    const [editedPrice, setEditedPrice] = useState(plan.price);
    const IconComponent = plan.icon;

    return (
      <Card className={`relative ${plan.popular ? 'border-gold border-2 shadow-lg' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge style={{ backgroundColor: '#F2C230', color: '#0E395C' }} className="px-4">
              Najpopularnije
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            plan.color === 'gold' ? 'bg-gold/20' :
            plan.color === 'yellow' ? 'bg-yellow-100' :
            plan.color === 'purple' ? 'bg-purple-100' :
            'bg-blue-100'
          }`}>
            <IconComponent className={`w-8 h-8 ${
              plan.color === 'gold' ? 'text-gold' :
              plan.color === 'yellow' ? 'text-yellow-600' :
              plan.color === 'purple' ? 'text-purple-600' :
              'text-blue-600'
            }`} />
          </div>
          
          <CardTitle className="mb-2">{plan.name}</CardTitle>
          
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">€</span>
            {editMode && isAdmin ? (
              <Input
                type="number"
                step="0.01"
                value={editedPrice}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setEditedPrice(newPrice);
                  handleEditPlan(plan.id, newPrice, type);
                }}
                className="w-24 text-center text-3xl font-bold p-1 h-auto"
              />
            ) : (
              <span className="text-3xl font-bold">{plan.price}</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1">{plan.duration}</p>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            className="w-full"
            style={plan.popular ? { backgroundColor: '#F2C230', color: '#0E395C' } : {}}
            variant={plan.popular ? 'default' : 'outline'}
          >
            {type === 'job' ? 'Nadogradi oglas' : 'Izaberi paket'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('landing')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad na početnu
          </Button>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4">Cjenovnik za poslodavce</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6">
            Transparentne cijene, bez skrivenih troškova. Odaberite plan koji najbolje odgovara vašim potrebama.
          </p>
          
          {isAdmin && (
            <div className="flex justify-center gap-3">
              {editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                    onClick={savePricing}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sačuvaj izmjene
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                    onClick={() => setEditMode(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Otkaži
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => setEditMode(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Uredi cjenovnik
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Job Boost Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-4 h-4 mr-1" />
              Pojedinačni oglasi
            </Badge>
            <h2 className="mb-4">Nadogradite svoje oglase</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Povećajte vidljivost pojedinačnih oglasa i privucite više kvalifikovanih kandidata
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {jobBoostPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} type="job" />
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-4 h-4 mr-1" />
              Mjesečni paketi
            </Badge>
            <h2 className="mb-4">Kompletna rješenja za zapošljavanje</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sve što vam treba za uspješno zapošljavanje kvalifikovanih kandidata sa Balkana
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packagePlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} type="package" />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2">Sigurna plaćanja</h3>
                <p className="text-sm text-gray-600">
                  SSL enkripcija i sigurnosni protokoli za sve transakcije
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="mb-2">Garancija zadovoljstva</h3>
                <p className="text-sm text-gray-600">
                  30 dana povrat novca ako niste zadovoljni rezultatima
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="mb-2">Podrška 24/7</h3>
                <p className="text-sm text-gray-600">
                  Naš tim je uvijek tu da vam pomogne
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Spremni da pronađete savršenog kandidata?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Pridružite se stotinama zadovoljnih poslodavaca koji su pronašli kvalifikovane radnike preko EuroConnect Europe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              style={{ backgroundColor: '#F2C230', color: '#0E395C' }}
              className="text-lg px-8"
            >
              Kreirajte besplatan nalog
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
            >
              Kontaktirajte prodaju
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
