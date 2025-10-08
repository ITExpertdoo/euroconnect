import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Save, Euro, Crown, Zap, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PricingConfig {
  // Candidate Premium Plans
  candidateBasic: number;
  candidateProfessional: number;
  candidateEnterprise: number;
  
  // Employer Job Boost Plans
  employerBoost: number;
  employerHighlight: number;
  employerFeatured: number;
}

interface PricingConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export function PricingConfigModal({ open, onClose }: PricingConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<PricingConfig>({
    candidateBasic: 9.99,
    candidateProfessional: 29.99,
    candidateEnterprise: 99.99,
    employerBoost: 19.99,
    employerHighlight: 29.99,
    employerFeatured: 49.99,
  });

  useEffect(() => {
    if (open) {
      loadPricingConfig();
    }
  }, [open]);

  const loadPricingConfig = async () => {
    setLoading(true);
    const response = await api.getPricingConfig();
    if (response.success && response.data) {
      setConfig(response.data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    // Validate all prices are positive numbers
    const values = Object.values(config);
    if (values.some(v => isNaN(v) || v <= 0)) {
      toast.error('Sve cene moraju biti pozitivni brojevi');
      return;
    }

    setSaving(true);
    const response = await api.updatePricingConfig(config);
    if (response.success) {
      toast.success('Cenovnik uspešno ažuriran!');
      onClose();
    } else {
      toast.error('Greška pri čuvanju cenovnika');
    }
    setSaving(false);
  };

  const handleChange = (key: keyof PricingConfig, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setConfig(prev => ({ ...prev, [key]: numValue }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Euro className="w-6 h-6 text-primary" />
            Upravljanje Cenovnikom
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Učitavanje...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Candidate Premium Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-gold" />
                  Premium Planovi za Kandidate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateBasic" className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Basic Premium (mesečno)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="candidateBasic"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.candidateBasic}
                        onChange={(e) => handleChange('candidateBasic', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Pristup premium oglasima 1 mesec</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateProfessional" className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-600" />
                      Professional Premium (3 meseca)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="candidateProfessional"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.candidateProfessional}
                        onChange={(e) => handleChange('candidateProfessional', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Pristup premium oglasima 3 meseca</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateEnterprise" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      Enterprise Premium (godišnje)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="candidateEnterprise"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.candidateEnterprise}
                        onChange={(e) => handleChange('candidateEnterprise', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Pristup premium oglasima 12 meseci</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employer Job Boost Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  Nadogradnje Oglasa za Poslodavce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employerBoost" className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Boost (7 dana)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="employerBoost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.employerBoost}
                        onChange={(e) => handleChange('employerBoost', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Povećana vidljivost 7 dana</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerHighlight" className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      Highlight (30 dana)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="employerHighlight"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.employerHighlight}
                        onChange={(e) => handleChange('employerHighlight', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Zlatni okvir + povećana vidljivost</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerFeatured" className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-gold" />
                      Featured Premium (30 dana)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-gray-500" />
                      <Input
                        id="employerFeatured"
                        type="number"
                        step="0.01"
                        min="0"
                        value={config.employerFeatured}
                        onChange={(e) => handleChange('employerFeatured', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Top pozicija + zlatni okvir + premium badge</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Otkaži
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Čuvanje...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Sačuvaj Cenovnik
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}