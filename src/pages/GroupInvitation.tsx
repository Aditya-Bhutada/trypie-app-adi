
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { acceptGroupInvitation, validateInvitationToken } from '@/services/travel-group-service-invitations';
import { TravelGroup } from '@/types/travel-group-types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, ArrowRight, Info, Settings } from 'lucide-react';

const GroupInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'validating' | 'success' | 'error' | 'unauthenticated'>('loading');
  const [message, setMessage] = useState('Processing invitation...');
  const [group, setGroup] = useState<TravelGroup | null>(null);
  const [groupName, setGroupName] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [inviterName, setInviterName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid invitation link.');
      return;
    }

    const validateInvite = async () => {
      try {
        setStatus('validating');
        const result = await validateInvitationToken(token);

        if (result.isValid) {
          setGroupName(result.groupName);
          setGroupId(result.groupId);
          setInviterName(result.inviterName);

          if (!isAuthenticated) {
            setStatus('unauthenticated');
            setMessage(`Sign in to join ${result.groupName || 'this travel group'}.`);
            return;
          }
          processInvitation(token, result.groupId);
        } else {
          setStatus('error');
          setMessage(result.message || 'Invalid invitation.');

          toast({
            title: 'Error',
            description: result.message || 'Invalid invitation.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error validating invitation:', error);
        setStatus('error');
        setMessage('Failed to validate invitation.');
      }
    };

    const processInvitation = async (token: string, destinationGroupId?: string) => {
      try {
        const result = await acceptGroupInvitation(token);

        if (result.success && result.group) {
          setStatus('success');
          setMessage(result.message || 'You have successfully joined the group!');
          setGroup(result.group);

          toast({
            title: 'Success!',
            description: result.message,
          });

          // Instantly redirect to group after a short animation (0.5s for visual feedback)
          setTimeout(() => {
            navigate(`/groups/${result.group.id}`);
          }, 500);
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to accept invitation.');

          toast({
            title: 'Error',
            description: result.message || 'Failed to accept invitation.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error accepting invitation:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred while processing the invitation.');

        toast({
          title: 'Error',
          description: 'Failed to process invitation.',
          variant: 'destructive',
        });
      }
    };

    validateInvite();
  }, [searchParams, isAuthenticated, toast, user, navigate]);

  // Premium-style animated group header
  const GroupHeader = () => (
    <div className="flex items-center justify-between bg-white px-3 py-4 rounded-lg shadow-sm mb-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-trypie-700 text-2xl font-extrabold tracking-tight flex items-center">
          {groupName || "Group"}
        </span>
        <Info className="h-5 w-5 ml-1 text-trypie-600/80 transition-transform hover:scale-110 cursor-pointer" />
      </div>
      <Settings className="h-6 w-6 text-gray-500 hover:text-trypie-700 transition-colors duration-200 cursor-pointer" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-8 px-2 md:px-4">
        <Card className="max-w-xl w-full p-6 flex flex-col items-center">
          {status === 'loading' || status === 'validating' ? (
            <>
              <Loader2 className="h-12 w-12 text-trypie-600 mx-auto animate-spin mb-4" />
              <h1 className="text-2xl font-semibold mb-2 animate-fade-in">
                {status === 'validating' ? 'Validating Invitation...' : 'Processing Invitation'}
              </h1>
              <p className="text-gray-600">
                {status === 'validating'
                  ? 'Verifying your invitation details...'
                  : 'Please wait while we process your invitation...'}
              </p>
            </>
          ) : null}

          {status === 'success' && group && (
            <>
              <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-1" />
                <GroupHeader />
                <div>
                  <p className="text-lg text-gray-700 font-medium mb-2">
                    Welcome to <span className="font-bold text-trypie-700">{group.title}</span>!
                  </p>
                  <p className="text-gray-600 mb-2">
                    You're now a member of this travel group. Meet new friends, plan, chat, & explore!
                  </p>
                  <p className="text-gray-400 text-sm italic">Redirecting you to the group chat...</p>
                </div>
                <Loader2 className="h-6 w-6 text-trypie-600 mx-auto animate-spin mt-2" />
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <GroupHeader />
              <h1 className="text-xl font-semibold mb-2">Sorry, this invitation can't be used.</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/groups')}
              >
                Back to Groups
              </Button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                <GroupHeader />
                <p className="text-gray-700 text-base mb-2">
                  <span className="font-semibold">{inviterName}</span> invited you to join <span className="font-semibold">{groupName || "a travel group"}</span> on Trypie.
                </p>
                <p className="text-gray-600 mb-3">Sign in to accept this invitation and join the adventure!</p>

                <Button
                  className="w-full mb-2 animate-fade-in"
                  onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))}
                >
                  <ArrowRight className="mr-2 h-4 w-4" /> Sign In and Join Group
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default GroupInvitation;
