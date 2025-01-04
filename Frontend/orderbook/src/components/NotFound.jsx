import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    // This component is a simple 404 page that displays a message and a button to return to the homepage.
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <h2>Oops! Page not found.</h2>
            <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
    );
};

export default NotFound;