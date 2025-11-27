import styles from '../../css/ProfileIcon.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

function ProfileIcon() {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!user) return null;

  // Get user name from metadata or use email
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email;

  // Get initials from name
  const getInitials = (name) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <div 
      className={styles.profileContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.profileIcon} title={userName}>
        {initials}
      </div>
      
      {isHovered && (
        <div className={styles.profileTooltip}>
          <div className={styles.tooltipName}>{userName}</div>
          <div className={styles.tooltipEmail}>{userEmail}</div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;
