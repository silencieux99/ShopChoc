import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  ArrowRight,
  Package,
  Facebook,
  Chrome,
  Check,
  X
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import { cn } from '../../shared/utils/cn';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  });
  const [errors, setErrors] = useState({});

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordStrengthLabel = 
    passwordStrengthScore <= 1 ? 'Faible' :
    passwordStrengthScore <= 3 ? 'Moyen' :
    'Fort';
  const passwordStrengthColor = 
    passwordStrengthScore <= 1 ? 'text-red-500' :
    passwordStrengthScore <= 3 ? 'text-yellow-500' :
    'text-green-500';

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (passwordStrengthScore < 3) {
      newErrors.password = 'Le mot de passe est trop faible';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signUp(formData.email, formData.password, formData.username);
      
      // Subscribe to newsletter if checked
      if (formData.newsletter) {
        // API call to subscribe to newsletter
        console.log('Subscribe to newsletter');
      }
      
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Erreur lors de la création du compte';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible';
      }
      
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialSignup = async (provider) => {
    toast.info(`Inscription ${provider} bientôt disponible`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <Package className="h-10 w-10 text-primary-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">ShopChoc</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-600">
              Rejoignez notre communauté de vendeurs et acheteurs
            </p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialSignup('Google')}
              leftIcon={<Chrome className="h-5 w-5" />}
            >
              S'inscrire avec Google
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialSignup('Facebook')}
              leftIcon={<Facebook className="h-5 w-5" />}
            >
              S'inscrire avec Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            {/* Username */}
            <Input
              label="Nom d'utilisateur"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="johndoe"
              leftIcon={<User className="h-5 w-5 text-gray-400" />}
              required
              autoComplete="username"
              helperText="Uniquement lettres, chiffres et underscores"
            />

            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="votre@email.com"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              required
              autoComplete="email"
            />

            {/* Password */}
            <div>
              <Input
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                required
                autoComplete="new-password"
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Force du mot de passe:</span>
                    <span className={cn('text-xs font-medium', passwordStrengthColor)}>
                      {passwordStrengthLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={cn(
                      'flex items-center',
                      passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'
                    )}>
                      {passwordStrength.hasMinLength ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      8+ caractères
                    </div>
                    <div className={cn(
                      'flex items-center',
                      passwordStrength.hasUpperCase ? 'text-green-500' : 'text-gray-400'
                    )}>
                      {passwordStrength.hasUpperCase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Majuscule
                    </div>
                    <div className={cn(
                      'flex items-center',
                      passwordStrength.hasLowerCase ? 'text-green-500' : 'text-gray-400'
                    )}>
                      {passwordStrength.hasLowerCase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Minuscule
                    </div>
                    <div className={cn(
                      'flex items-center',
                      passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'
                    )}>
                      {passwordStrength.hasNumber ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Chiffre
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              required
              autoComplete="new-password"
            />

            {/* Terms & Newsletter */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  J'accepte les{' '}
                  <Link to="/legal/terms" className="text-primary-600 hover:text-primary-700">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/legal/privacy" className="text-primary-600 hover:text-primary-700">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 ml-6">{errors.acceptTerms}</p>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Recevoir les offres et nouveautés par email
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
              rightIcon={!loading && <ArrowRight className="h-5 w-5" />}
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
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
