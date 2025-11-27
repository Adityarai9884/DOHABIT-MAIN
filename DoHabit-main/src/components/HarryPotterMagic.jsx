import React, { useEffect } from 'react';
import '../css/HarryPotterMagic.module.css';

const HarryPotterMagic = () => {
	useEffect(() => {
		// Create magical particles
		const createMagicalParticle = () => {
			const particle = document.createElement('div');
			particle.className = 'magical-particle';
			
			const emojis = ['⚡', '✨', '🌟', '⭐', '🔮', '🪄', '🦉', '📜', '🏰', '👓', '⚗️'];
			particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
			
			particle.style.left = Math.random() * 100 + '%';
			particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
			particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
			particle.style.animationDelay = Math.random() * 5 + 's';
			
			document.body.appendChild(particle);
			
			setTimeout(() => {
				particle.remove();
			}, 25000);
		};

		// Create particles periodically
		const interval = setInterval(createMagicalParticle, 2000);
		
		// Create initial batch
		for (let i = 0; i < 8; i++) {
			setTimeout(createMagicalParticle, i * 300);
		}

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="harry-potter-theme">
			{/* Marauder's Map style background pattern */}
			<div className="marauders-map"></div>
			
			{/* Golden Snitch */}
			<div className="golden-snitch">🏐</div>
			
			{/* Floating wands */}
			<div className="wand wand-1">🪄</div>
			<div className="wand wand-2">🪄</div>
			
			{/* Hogwarts Castle silhouette */}
			<div className="hogwarts-castle">🏰</div>
			
			{/* Hedwig flying */}
			<div className="hedwig">🦉</div>
			
			{/* Magic spell effects */}
			<div className="spell-effect spell-1"></div>
			<div className="spell-effect spell-2"></div>
			<div className="spell-effect spell-3"></div>
		</div>
	);
};

export default HarryPotterMagic;
