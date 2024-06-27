// src/components/LandingPage/LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Restaurant Recipe Creator</h1>
                <nav>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/login">Log In</Link>
                </nav>
            </header>
            <main>
                <section className="intro">
                    <h2>Create and Share Your Favorite Recipes</h2>
                    <p>Discover new recipes, share your own, and keep track of your favorite dishes from your favorite restaurants.</p>
                    <Link to="/recipes" className="btn">Explore Recipes</Link>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 Restaurant Recipe Creator</p>
            </footer>
        </div>
    );
};

export default LandingPage;
