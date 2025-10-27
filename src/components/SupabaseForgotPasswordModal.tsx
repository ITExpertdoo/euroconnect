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
import { Loader2, Mail, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SupabaseForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  redirectUrl?: string; // URL where user will be redirected after clicking email link
}

export function SupabaseForgotPasswordModal({ 
  open, 
  onClose,
  redirectUrl = 'https://www.euroconnectbg.com/reset'
}: SupabaseForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Unesite email adresu');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Sending forgot password request to backend...');
      console.log('📧 Email:', email);
      
      // Call our custom backend API instead of Supabase Auth
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

      if (!response.ok || data.error) {
        console.error('❌ Backend error:', data.error);
        toast.error(data.error || 'Greška prilikom slanja emaila');
      } else {
        console.log('✅ Reset email sent successfully via backend');
        console.log('🔗 Reset token:', data.resetToken); // For debugging
        setEmailSent(true);
        toast.success('Email sa reset linkom je poslat!');
      }
    } catch (error) {
      console.error('❌ Forgot password exception:', error);
      toast.error('Greška prilikom slanja zahteva');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Zaboravljena lozinka</DialogTitle>
          <DialogDescription>
            Unesite svoju email adresu i poslaćemo vam link za reset lozinke
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email adresa</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vas.email@primer.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
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
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Slanje...
                  </>
                ) : (
                  'Pošalji Reset Link'
                )}
              </Button>
            </div>
          </form>
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
                Proverite svoj inbox na <strong>{email}</strong> i kliknite na link za reset lozinke.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Link ističe za 1 sat.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full"
            >
              Zatvori
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}