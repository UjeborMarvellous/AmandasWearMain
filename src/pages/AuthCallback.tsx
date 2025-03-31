import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 1. Check for errors first
        const error = searchParams.get('error');
        if (error) {
          navigate(`/auth?error=${encodeURIComponent(error)}`);
          return;
        }

        // 2. Get the returnTo URL (decoding it properly)
        let returnTo = searchParams.get('returnTo');
        returnTo = returnTo ? decodeURIComponent(returnTo) : '/products';
        
        // 3. Wait for Supabase to process the auth response
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 4. Get the session with retry logic
        let session;
        let retries = 3;
        
        while (retries > 0) {
          const { data: { session: currentSession }, error: sessionError } = 
            await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          if (currentSession) {
            session = currentSession;
            break;
          }
          
          retries--;
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        if (!session) {
          throw new Error('No session found after login');
        }

        // 5. Validate the returnTo URL before redirecting
        const isValidPath = returnTo.startsWith('/') && 
                          !returnTo.includes('//') && 
                          !returnTo.includes('http');
        
        navigate(isValidPath ? returnTo : '/products');
        
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate(`/auth?error=${encodeURIComponent('Authentication failed')}`);
      }
    };

    handleAuth();
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;