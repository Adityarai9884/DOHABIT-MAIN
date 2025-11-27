import styles from '../css/Header.module.css';

// router
import { Link, useNavigate } from 'react-router-dom';

// components
import IconButton from './Actions/IconButton';

// auth
import { useAuth } from '../contexts/AuthContext';

// icons
import { FaPlus, FaBars, FaAward, FaSignOutAlt } from 'react-icons/fa';
import { MdLibraryBooks } from 'react-icons/md';

const publicUrl = process.env.PUBLIC_URL;

function Header() {
	const { signOut, user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		navigate('/login');
	};

	const navItems = [
		['/modal/habitEditor', 'Create new habit', <FaPlus />],
		['/modal/diary', 'Main Diary', <MdLibraryBooks />],
		['/modal/achievements', 'Achievements', <FaAward />],
		['/modal/menu', 'Menu', <FaBars />]
	].map(
		([path, title, icon]) => (
			<li key={path}>
				<Link to={publicUrl + path} state={{ modalTitle: title }}>
					<IconButton {...{ icon, title }} />
				</Link>
			</li>
		)
	);

	return (
		<header className={styles.header}>
			<div className={styles.logoWrapper}>
				<span className={styles.logo} />
				<h1>DoHabit</h1>
				{user && <span style={{ fontSize: '0.8rem', marginLeft: '10px', opacity: 0.7 }}>({user.email})</span>}
			</div>

			<nav>
				<ul className={styles.navList}>
					{navItems}
					<li>
						<IconButton 
							icon={<FaSignOutAlt />} 
							title="Logout" 
							onClick={handleLogout}
						/>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;