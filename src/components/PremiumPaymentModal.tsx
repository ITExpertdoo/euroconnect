import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard, Check, Lock } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

interface PremiumPaymentModalProps {
  open: boolean;
  onClose: () => void;
  selectedPlan?: 'basic' | 'professional' | 'enterprise';
}

const planDetails = {
  basic: {
    name: 'Basic Premium',
    price: '9.99',
    duration: '1 mesec',
    features: [
      'Pristup svim premium oglasima',
      'Prioritetna podrška',
      'Mesečni newsletteri sa novim poslovima',
    ],
  },
  professional: {
    name: 'Professional Premium',
    price: '29.99',
    duration: '3 meseca',
    features: [
      'Sve iz Basic paketa',
      'Premium badge na profilu',
      'Direktan kontakt sa poslodavcima',
      'CV pregled od stručnjaka',
    ],
  },
  enterprise: {
    name: 'Enterprise Premium',
    price: '99.99',
    duration: '1 godina',
    features: [
      'Sve iz Professional paketa',
      'Lični karierni savetnik',
      'Prioritetne aplikacije',
      'Ekskluzivni oglasi',
      'Coaching sesije',
    ],
  },
};

export function PremiumPaymentModal({ open, onClose, selectedPlan = 'basic' }: PremiumPaymentModalProps) {
  const { refreshPremiumStatus } = useAuth();
  const [plan, setPlan] = useState<'basic' | 'professional' | 'enterprise'>(selectedPlan);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        toast.error('Molimo popunite sve podatke kartice');
        return;
      }
    }

    setProcessing(true);

    try {
      const response = await api.purchasePremium(plan, paymentMethod);

      if (response.success) {
        toast.success('Uspešna kupovina Premium paketa!');
        await refreshPremiumStatus();
        onClose();
      } else {
        toast.error(response.error || 'Plaćanje nije uspelo');
      }
    } catch (error) {
      toast.error('Došlo je do greške pri plaćanju');
    } finally {
      setProcessing(false);
    }
  };

  const currentPlan = planDetails[plan];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kupovina Premium Pristupa</DialogTitle>
          <DialogDescription>
            Izaberite paket i završite plaćanje za pristup premium oglasima
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div>
            <Label className="mb-3 block">Izaberite paket</Label>
            <RadioGroup value={plan} onValueChange={(value: any) => setPlan(value)}>
              {Object.entries(planDetails).map(([key, details]) => (
                <div
                  key={key}
                  className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    plan === key
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => setPlan(key as any)}
                >
                  <RadioGroupItem value={key} id={key} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={key} className="cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{details.name}</span>
                        <span className="text-lg text-primary font-bold">
                          €{details.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Trajanje: {details.duration}
                      </p>
                      <ul className="space-y-1">
                        {details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="mb-3 block">Način plaćanja</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div
                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Kreditna/Debitna kartica
                </Label>
              </div>
              <div
                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                  paymentMethod === 'paypal'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="cursor-pointer flex-1">
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details (if card selected) */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label htmlFor="cardNumber">Broj kartice</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Rok važenja</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/GG"
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardExpiry(value);
                    }}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Lock className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
            <p>
              Vaši podaci su sigurni. Koristimo enkriptovanu vezu i ne čuvamo podatke o kartici.
              <br />
              <span className="text-xs text-gray-500">
                * Ovo je demo aplikacija. Neće se naplatiti pravi novac.
              </span>
            </p>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Ukupno:</span>
              <span className="text-2xl font-bold text-primary">
                €{currentPlan.price}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={processing}
              >
                Otkaži
              </Button>
              <Button
                onClick={handlePurchase}
                className="flex-1"
                disabled={processing}
              >
                {processing ? 'Obrada...' : `Plati €${currentPlan.price}`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
