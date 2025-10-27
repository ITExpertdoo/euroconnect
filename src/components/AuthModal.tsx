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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  defaultRole?: 'candidate' | 'employer';
  onOpenResetModal?: (token: string) => void;
}

export function AuthModal({ open, onClose, defaultTab = 'login', defaultRole, onOpenResetModal }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: (defaultRole || 'candidate') as 'candidate' | 'employer',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginData.email, loginData.password);
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Uspešno ste se prijavili!');
      onClose();
      setLoginData({ email: '', password: '' });
    } else {
      toast.error(result.error || 'Prijavljivanje nije uspelo');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Lozinke se ne podudaraju');
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error('Lozinka mora imati najmanje 6 karaktera');
      return;
    }
    
    setLoading(true);

    const result = await signup({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
    });
    
    setLoading(false);
    
    if (result.success) {
      toast.success('Uspešno ste se registrovali i prijavili!');
      onClose();
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: defaultRole || 'candidate',
      });
    } else {
      toast.error(result.error || 'Registracija nije uspela');
    }
  };

  // Update role when defaultRole prop changes
  React.useEffect(() => {
    if (defaultRole) {
      setSignupData(prev => ({ ...prev, role: defaultRole }));
    }
  }, [defaultRole]);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dobrodošli u EuroConnect Europe</DialogTitle>
            <DialogDescription>
              Prijavite se ili kreirajte novi nalog
            </DialogDescription>
          </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Prijava</TabsTrigger>
            <TabsTrigger value="signup">Registracija</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            {/* Demo Credentials Info - Hidden but still functional */}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="vas.email@primer.com"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="login-password">Lozinka</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Zaboravili ste lozinku?
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  'Prijavi se'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            {/* Demo Info - Hidden but credentials still work */}
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Puno ime</Label>
                <Input
                  id="signup-name"
                  placeholder="Marko Marković"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="vas.email@primer.com"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Lozinka</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm-password">Potvrdite lozinku</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                />
              </div>
              <div>
                <Label>Tip naloga</Label>
                <RadioGroup 
                  value={signupData.role} 
                  onValueChange={(value: any) => setSignupData({ ...signupData, role: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate" />
                    <Label htmlFor="candidate" className="cursor-pointer">
                      Kandidat - Tražim posao
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer" />
                    <Label htmlFor="employer" className="cursor-pointer">
                      Poslodavac - Objavljujem poslove
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kreiranje naloga...
                  </>
                ) : (
                  'Kreiraj nalog'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
      
    <ForgotPasswordModal 
      open={showForgotPassword}
      onClose={() => setShowForgotPassword(false)}
      onOpenResetModal={onOpenResetModal}
    />
    </>
  );
}