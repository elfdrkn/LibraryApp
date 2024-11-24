import React, { useEffect, useState } from 'react';
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from '../../api/authorApi';
import { toast } from 'react-toastify';
import './AuthorPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AuthorPage = () => {
   // State to store the list of authors
  const [authors, setAuthors] = useState([]);
  // State to store the new author form data
  const [newAuthor, setNewAuthor] = useState({
    name:"",
    birthDate: "",
    country: "",
  });
  // State to store the author being edited
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  // State to control visibility of author details
  const [visibleDetails, setVisibleDetails] = useState({});

 // Fetch authors from the database when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuthors(); // Call the API to get authors data

       // If no authors are found, add sample authors
      if (data.length === 0) {
        const sampleAuthors = [
          { name: "J.K. Rowling", birthDate: "1965-07-31", country: "United Kingdom" },
          { name: "George R.R. Martin", birthDate: "1948-09-20", country: "United States" },
          { name: "Agatha Christie", birthDate: "1890-09-15", country: "United Kingdom" },
          { name: "Haruki Murakami", birthDate: "1949-01-12", country: "Japan" },
          { name: "Gabriel García Márquez", birthDate: "1927-03-06", country: "Colombia" },
        ];

        // Add sample authors to the database
        for (const author of sampleAuthors) {
          await addAuthor(author);
        }

        // Fetch updated data after adding sample authors
        const updatedData = await getAuthors(); 
        setAuthors(updatedData); // Set the updated list of authors to the state
      } else {
        setAuthors(data);
      }      
    };
    
    fetchData();
  }, []) // Empty dependency array means this effect runs once when the component mounts

   // Toggle the visibility of author details
  const toggleDetails = (id) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle visibility of details for the clicked author
    }));
  };

  // Handle adding a new author
  const handleAddAuthor = async () => {
    try {
      const addedAuthor = await addAuthor(newAuthor); // Add the new author via the API
      setAuthors((prev) => [...prev, addedAuthor]); // Add the new author to the list
      setNewAuthor({ name:"", birthDate: "", country: ""}); // Reset the form
      toast.success("Author added succesfully!", { autoClose: 3000}) // Show success message
    } catch (err) {
      console.error("Error adding author:", err);
      toast.error("Failed to add author. Please try again.");
    }
  };

  // Handle updating an existing author
  const handleUpdateAuthor = async () => {
    try {
      await updateAuthor(selectedAuthor.id, selectedAuthor); // Update the author via the API
      toast.success("Author updated successfully!", { autoClose: 3000 });

      // Update the author list in the state after successful update
      setAuthors((prevAuthors) => 
        prevAuthors.map((author) =>
          author.id === selectedAuthor.id ? selectedAuthor : author)
      );
      setSelectedAuthor(null); // Reset the selected author
    } catch (err) {
      console.error("Error updating author:", err);
      toast.error("Error updating author");
    }
  };

  // Handle deleting an author
  const handleDeleteAuthor = async (id) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      try {
        await deleteAuthor(id); // Delete the author via the API
        setAuthors((prev) => prev.filter((author) => author.id !== id)); // Remove the author from the list
        toast.success("Author deleted successfully!");
      } catch (err) {
        console.error("Error deleting author:", err);
        toast.error("Error deleting author");
      }
    }
  };

    return (
      <div className='author-container'>
      <h1 className='author-header'>Authors</h1>
      {authors.map((author) => (
        <div key={author.id} className="author-row">
          <p className="author-name">{author.name}</p>
          <div className="button-group">
            <button onClick={() => toggleDetails(author.id)}>
              {visibleDetails[author.id] ? "Hide Details" : "Show Details"}
            </button>
            {visibleDetails[author.id] && (
              <div className="details">
                <p><strong>Birth Date:</strong> {author.birthDate}</p>
                <p><strong>Country:</strong> {author.country}</p>
              </div>
            )}
            {/* Update and delete buttons */}
            <button
              className="update-button"
              onClick={() => setSelectedAuthor(author)}
              aria-label="Update Author"
            >
              <FaEdit size={20} /> {/* Edit icon */}
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteAuthor(author.id)}
              aria-label="Delete Author"
            >
              <FaTrash size={20} /> {/* Trash icon */}
            </button>            
          </div>
        </div>
      ))}

       {/* Author update form */}
      {selectedAuthor && (
        <form className="author-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateAuthor(); // Handle update
          }}
        >
          <input className="form-input"
            type="text"
            name="name"
            placeholder='Name'
            value={selectedAuthor.name}
            onChange={(e) =>
              setSelectedAuthor({ ...selectedAuthor, name: e.target.value })
            }
          />
          <input className="form-input"
            type="date"
            name="birthDate"
            placeholder='Birth Date'
            value={selectedAuthor.birthDate}
            onChange={(e) =>
              setSelectedAuthor({ ...selectedAuthor, birthDate: e.target.value })
            }
          />
          <input className="form-input"
            type="text"
            name="country"
            placeholder='Country'
            value={selectedAuthor.country}
            onChange={(e) =>
              setSelectedAuthor({ ...selectedAuthor, country: e.target.value })
            }
          />
          <button className="form-button" type="submit">Save</button>
        </form>
      )}

       {/* New author form */}
      <form className="author-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAuthor(); // Add a new author
        }}
      >
        <input className="form-input"
          type="text"
          name="name"
          placeholder='Name'
          value={newAuthor.name}
          onChange={(e) =>
            setNewAuthor({ ...newAuthor, name: e.target.value })
          }
        />
        <input className="form-input"
          type="date"
          name="birthDate"
          placeholder='Birth Date'
          value={newAuthor.birthDate}
          onChange={(e) =>
            setNewAuthor({ ...newAuthor, birthDate: e.target.value })
          }
        />
        <input className="form-input"
          type="text"
          name="country"
          placeholder='Contry'
          value={newAuthor.country}
          onChange={(e) =>
            setNewAuthor({ ...newAuthor, country: e.target.value })
          }
        />
        <button className="add-form-button" type="submit">Add Author</button>
      </form>
    </div>
    );
  };
  
  export default AuthorPage;