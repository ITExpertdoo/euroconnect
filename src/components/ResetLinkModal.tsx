import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ResetLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetLink: string;
  onSimulateClick?: () => void;
}

export function ResetLinkModal({ isOpen, onClose, resetLink, onSimulateClick }: ResetLinkModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      toast.success('✅ Link kopiran u clipboard!');
    }
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      textareaRef.current.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            🔗 Reset Password Link Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning about Figma iframe */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900 font-medium">
                  ⚠️ Figma Make Ograničenje
                </p>
                <p className="text-xs text-yellow-800 mt-1">
                  Ova aplikacija radi samo unutar Figma Make iframe-a i <strong>ne može se otvoriti direktno u browseru</strong>.
                  Email sa ovim linkom NEĆE raditi u produkciji. Klikni "Simuliraj Email Klik" da testiraš funkcionalnost.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Link koji bi bio poslat u email-u:</strong>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              (Ne može se otvoriti direktno - koristi dugme "Simuliraj Email Klik" ispod)
            </p>
          </div>

          {/* Reset Link Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reset Link:
            </label>
            <textarea
              ref={textareaRef}
              value={resetLink}
              readOnly
              onClick={handleSelectAll}
              className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Copy className="w-5 h-5 mr-2" />
              Kopiraj Link
            </Button>

            <Button
              onClick={() => {
                if (onSimulateClick) {
                  onSimulateClick();
                  onClose();
                  toast.success('🔐 Otvaranje Reset Password modala...');
                }
              }}
              variant="default"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              ✨ Simuliraj Email Klik
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-green-900 font-medium">
                  Kako testirati:
                </p>
                <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                  <li>Klikni <strong>"Simuliraj Email Klik"</strong> da testiraš funkcionalnost</li>
                  <li>Reset Password modal će se automatski otvoriti</li>
                  <li>Unesi novu lozinku i resetuj je!</li>
                  <li><strong>Napomena:</strong> U pravoj produkciji, moraš imati standalone URL, ne Figma iframe</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Zatvori
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}