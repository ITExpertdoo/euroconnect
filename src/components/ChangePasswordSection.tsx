import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';

export function ChangePasswordSection() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Popunite sva polja');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Nove lozinke se ne podudaraju');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Nova lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Nova lozinka mora biti različita od trenutne');
      return;
    }

    setLoading(true);

    try {
      // Get access token from localStorage
      const authData = localStorage.getItem('auth');
      if (!authData) {
        toast.error('Morate biti prijavljeni');
        return;
      }

      const { access_token } = JSON.parse(authData);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fe64975a/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
          body: JSON.stringify({ 
            currentPassword,
            newPassword 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Lozinka uspešno promenjena!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowForm(false);
      } else {
        toast.error(data.error || 'Greška prilikom promene lozinke');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Greška prilikom promene lozinke');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Sigurnost naloga
        </CardTitle>
        <CardDescription>
          Promenite lozinku za pristup vašem nalogu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showForm ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Preporučujemo redovnu promenu lozinke</p>
                <p className="text-blue-700">
                  Koristite jaku lozinku sa minimum 6 karaktera koja uključuje velika i mala slova, brojeve i simbole.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Promeni lozinku
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Trenutna lozinka</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-4">
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
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 karaktera
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-new-password">Potvrdite novu lozinku</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                          ? 'bg-green-500 w-full'
                          : newPassword.length >= 6
                          ? 'bg-yellow-500 w-2/3'
                          : 'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                      ? 'text-green-600'
                      : newPassword.length >= 6
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                      ? 'Jaka'
                      : newPassword.length >= 6
                      ? 'Srednja'
                      : 'Slaba'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Sačuvaj
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
