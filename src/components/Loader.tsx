import React from 'react';
import './Loader.css';

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = 'Loading…' }) => {
    return (
        <div className="loader-wrapper">
            <div className="loader-spinner">
                <div className="spinner-ring" />
                <div className="spinner-ring ring-2" />
                <div className="spinner-ring ring-3" />
            </div>
            <p className="loader-text">{text}</p>
        </div>
    );
};

export default Loader;
