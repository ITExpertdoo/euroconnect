import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Loader2, Mail, CheckCircle, Key } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onTokenSubmit?: (token: string) => void; // New prop for opening reset modal with token
}

export function ForgotPasswordModal({ open, onClose, onTokenSubmit }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Unesite email adresu');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success('Proverite svoj email!');
      } else {
        toast.error(data.error || 'Greška prilikom slanja emaila');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Greška prilikom slanja zahteva');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenInput || tokenInput.length < 10) {
      toast.error('Unesite validan reset token iz email-a');
      return;
    }

    console.log('🔑 User submitted token:', tokenInput);
    
    if (onTokenSubmit) {
      onTokenSubmit(tokenInput);
      handleClose();
      toast.success('🔐 Otvaranje forme za reset lozinke...');
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setShowTokenInput(false);
    setTokenInput('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Zaboravili ste lozinku?</DialogTitle>
          <DialogDescription>
            {showTokenInput 
              ? 'Paste token iz email-a koji ste dobili'
              : 'Unesite svoju email adresu i poslaćemo vam link za reset lozinke'
            }
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <>
            {!showTokenInput ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email adresa</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="vas.email@primer.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Otkaži
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Slanje...
                      </>
                    ) : (
                      'Pošalji link'
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">ILI</span>
                  </div>
                </div>

                {/* Already have token button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTokenInput(true)}
                  className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Već imam token iz email-a
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>📧 Imate reset token?</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Paste token koji ste dobili u email-u i kliknite "Dalje" da resetujete lozinku.
                  </p>
                </div>

                <div>
                  <Label htmlFor="token-input">Reset Token</Label>
                  <div className="relative mt-2">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="token-input"
                      type="text"
                      placeholder="Paste token ovde..."
                      required
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="pl-10 font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Token izgleda kao: a1b2c3d4-e5f6-7890-abcd-ef1234567890
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowTokenInput(false);
                      setTokenInput('');
                    }}
                    className="flex-1"
                  >
                    Nazad
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Dalje
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Email poslat!</h3>
              <p className="text-sm text-gray-600">
                Ako postoji nalog sa adresom <strong>{email}</strong>, dobićete email sa reset tokenom.
              </p>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-4">
                <p className="text-xs text-yellow-900 font-medium">
                  💡 Figma Make Napomena:
                </p>
                <p className="text-xs text-yellow-800 mt-1">
                  Link u emailu možda neće raditi direktno (iframe ograničenje). 
                  <strong> Kopirajte token iz email-a</strong> i kliknite "Već imam token iz email-a" da ga unesete.
                </p>
              </div>
              <p className="text-xs text-gray-500 pt-2">
                Token je validan 1 sat. Proverite spam folder ako ne vidite email.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setShowTokenInput(true);
                }}
                variant="outline"
                className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
              >
                <Key className="w-4 h-4 mr-2" />
                Imam token - unesite ga ovde
              </Button>

              <Button
                onClick={handleClose}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Zatvori
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}