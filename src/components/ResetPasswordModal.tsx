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
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  resetToken: string;
}

export function ResetPasswordModal({ open, onClose, resetToken }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Popunite sva polja');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Lozinke se ne podudaraju');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            token: resetToken,
            newPassword 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Lozinka uspešno promenjena!');
      } else {
        toast.error(data.error || 'Greška prilikom promene lozinke');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Greška prilikom promene lozinke');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Resetuj lozinku</DialogTitle>
          <DialogDescription>
            Unesite novu lozinku za vaš nalog
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password">Nova lozinka</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 karaktera
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password">Potvrdite lozinku</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
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
                className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Čuvanje...
                  </>
                ) : (
                  'Resetuj lozinku'
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
              <h3 className="font-semibold text-lg">Lozinka promenjena!</h3>
              <p className="text-sm text-gray-600">
                Vaša lozinka je uspešno promenjena. Sada se možete prijaviti sa novom lozinkom.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Zatvori i prijavi se
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
