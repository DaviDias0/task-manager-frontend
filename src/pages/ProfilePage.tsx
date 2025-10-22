import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import { toast } from 'react-toastify';

// Define the shape of the user profile data
interface UserProfile {
  id: number;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ProfilePage: useEffect started.'); // Log P1
    const fetchProfile = async () => {
      console.log('ProfilePage: fetchProfile started.'); // Log P2
      try {
        console.log('ProfilePage: Calling await getProfile()...'); // Log P3
        const data: UserProfile = await getProfile(); // Explicitly type the data
        console.log('ProfilePage: getProfile returned:', data); // Log P4
        setProfile(data);
      } catch (error) {
        console.error('ProfilePage: Error caught in fetchProfile:', error); // Log P5 (Error)
        toast.error('Could not load profile data.');
      } finally {
        console.log('ProfilePage: fetchProfile finished, setLoading(false).'); // Log P6
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty array ensures this runs only once on mount

  // Utility function to format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long', // Use 'long' for month name (e.g., Outubro)
      year: 'numeric',
    });
  };

  // Show loading indicator
  if (loading) {
    return <h1>Loading profile...</h1>; // We can add a Skeleton here later
  }

  // Show error message if profile couldn't be loaded
  if (!profile) {
    return <h1>Could not load profile.</h1>;
  }

  // Display profile data
  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
          <strong>Name:</strong>
          <span>{profile.name || 'Not provided'}</span>
        </div>
        <div className="profile-info">
          <strong>Email:</strong>
          <span>{profile.email}</span>
        </div>
         <div className="profile-info">
          <strong>Role:</strong>
          <span className={`role-badge role-${profile.role.toLowerCase()}`}>
            {profile.role}
          </span>
        </div>
        <div className="profile-info">
          <strong>Member Since:</strong>
          <span>{formatDate(profile.createdAt)}</span>
        </div>
         <div className="profile-info">
          <strong>Last Updated:</strong>
          <span>{formatDate(profile.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}