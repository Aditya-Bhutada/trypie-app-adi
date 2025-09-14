
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TravelGroup } from '@/types/travel-group-types';
import { 
  fetchMyGroups, 
  fetchInfluencerTrips, 
  fetchExploreGroups 
} from '@/services/travel-group-service-groups';

export function useTravelGroups() {
  const [myGroups, setMyGroups] = useState<TravelGroup[]>([]);
  const [influencerTrips, setInfluencerTrips] = useState<TravelGroup[]>([]);
  const [exploreGroups, setExploreGroups] = useState<TravelGroup[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    myGroups: false,
    influencerTrips: false,
    exploreGroups: false
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const loadMyGroups = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(prev => ({ ...prev, myGroups: true }));
    try {
      console.log("Fetching my groups...");
      const groups = await fetchMyGroups();
      console.log("My groups fetched:", groups.length);
      setMyGroups(groups);
    } catch (err) {
      console.error('Error fetching my groups:', err);
      setError('Failed to load your groups');
      toast({
        title: 'Error',
        description: 'Failed to load your groups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, myGroups: false }));
    }
  }, [isAuthenticated, toast]);

  const loadInfluencerTrips = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, influencerTrips: true }));
    try {
      const trips = await fetchInfluencerTrips();
      setInfluencerTrips(trips);
    } catch (err) {
      console.error('Error fetching influencer trips:', err);
      setError('Failed to load influencer trips');
      toast({
        title: 'Error',
        description: 'Failed to load influencer trips',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, influencerTrips: false }));
    }
  }, [toast]);

  const loadExploreGroups = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(prev => ({ ...prev, exploreGroups: true }));
    try {
      const groups = await fetchExploreGroups();
      setExploreGroups(groups);
    } catch (err) {
      console.error('Error fetching explore groups:', err);
      setError('Failed to load explore groups');
      toast({
        title: 'Error',
        description: 'Failed to load explore groups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, exploreGroups: false }));
    }
  }, [isAuthenticated, toast]);

  const refreshAllGroups = useCallback(async () => {
    await Promise.all([
      loadMyGroups(),
      loadInfluencerTrips(),
      loadExploreGroups()
    ]);
  }, [loadMyGroups, loadInfluencerTrips, loadExploreGroups]);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyGroups();
      loadExploreGroups();
    }
    loadInfluencerTrips();
  }, [isAuthenticated, loadMyGroups, loadExploreGroups, loadInfluencerTrips]);

  return {
    myGroups,
    influencerTrips,
    exploreGroups,
    isLoading,
    error,
    refreshAllGroups,
    loadMyGroups,
    loadInfluencerTrips,
    loadExploreGroups
  };
}
