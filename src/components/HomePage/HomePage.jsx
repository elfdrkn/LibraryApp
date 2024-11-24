import React from 'react';
import './HomePage.css'; // Import CSS for styling

const HomePage = () => {
    return (
        <div className='home-page'>
            <h1>📚 Library Management System</h1>
            <p>
                Welcome to the Library Management System, your go-to application for organizing and managing your library's collection of books, authors, categories, and publishers. 
            </p>
            <p>Whether you're a librarian or a book enthusiast, this tool is designed to make your library management seamless and efficient.</p>

            {/* Content section */}
            <div className="content">
                <h2>📖 Featured Books</h2>
                <p>
                    Explore our featured collection, manage inventory, and keep track of the authors and publishers that bring these amazing books to life. 
                    
                </p>
                With just a few clicks, you can update records, add new titles, or delete outdated entries to keep your library up-to-date.
                <p>

                </p>
            </div>
        </div>
    );
};

export default HomePage;