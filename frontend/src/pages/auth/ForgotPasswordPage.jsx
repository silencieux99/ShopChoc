import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Mail, ArrowLeft, Package, CheckCircle } from 'lucide-react';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('L\'email est requis');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-8">
            <Package className="h-10 w-10 text-primary-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">ShopChoc</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email envoyé !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. 
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Vous n'avez pas reçu l'email ? Vérifiez vos spams ou réessayez.
            </p>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Renvoyer l'email
              </Button>
              
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Retour à la connexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <Package className="h-10 w-10 text-primary-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">ShopChoc</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate('/auth/login')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600">
              Entrez votre email et nous vous enverrons un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              required
              autoComplete="email"
              error={error}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4 text-sm">
          <Link to="/legal/terms" className="text-gray-500 hover:text-gray-700">
            CGU
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/legal/privacy" className="text-gray-500 hover:text-gray-700">
            Confidentialité
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/help" className="text-gray-500 hover:text-gray-700">
            Aide
          </Link>
        </div>
      </div>
    </div>
  );
}
