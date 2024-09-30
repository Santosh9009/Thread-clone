"use client"
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Please check your email for further instructions.');
        router.replace('/forgot-password-confirm')
        toast({
          title: "Success",
          description: "Email sent Successfully",
        });
      } else {
        setMessage(data.message || 'An error occurred, please try again.');
        toast({
          title: "Failure",
          description: "Error sending email",
          variant:'destructive'
        });
      }
    } catch (error) {
      setMessage('Failed to send request, please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#5051F9] text-white font-semibold rounded-md hover:bg-[#4747e0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
