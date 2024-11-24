import React, { useEffect, useState } from 'react';
import { getPublishers, addPublisher, updatePublisher, deletePublisher } from '../../api/publisherApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './PublisherPage.css';

const PublisherPage = () => { // State variables for managing publishers, new publisher, selected publisher for editing, and visibility of publisher details
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [visibleDetails, setVisibleDetails] = useState({}); // Track visibility of publisher details

  // Fetching publishers on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublishers();
      // If no publishers exist, add sample publishers
      if (data.length === 0) {
        const samplePublishers = [
          { name: "Penguin Random House", establishmentYear: 1925, address: "New York, USA" },
          { name: "HarperCollins", establishmentYear: 1989, address: "New York, USA" },
          { name: "Macmillan Publishers", establishmentYear: 1843, address: "London, UK" },
          { name: "Hachette Livre", establishmentYear: 1826, address: "Paris, France" },
          { name: "Simon & Schuster", establishmentYear: 1924, address: "New York, USA" },
        ];

        // Add sample publishers to the database
        for (const publisher of samplePublishers) {
          await addPublisher(publisher);
        }
        const updatedData = await getPublishers();
        setPublishers(updatedData);
        toast.info("Sample publishers added successfully!");
      } else {
        setPublishers(data); // If data exists, set publishers from the API
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on component mount

  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle visibility of the specific publisher's details
    }));
  };

  // Handle the addition of a new publisher
  const handleAddPublisher = async () => {
    if (!newPublisher.name || !newPublisher.establishmentYear || !newPublisher.address) {
      toast.warn("Please fill in all fields."); // Display warning if form is incomplete
      return;
    }
    try {
      const addedPublisher = await addPublisher(newPublisher); // Add publisher to the API
      setPublishers((prev) => [...prev, addedPublisher]);  // Update the publisher list with the new publisher
      setNewPublisher({ name: "", establishmentYear: "", address: "" }); // Reset input fields
      toast.success("Publisher added successfully!", { autoClose: 3000 });
    } catch (err) {
      console.error("Error adding publisher:", err);
      toast.error("Failed to add publisher. Please try again.");
    }
  };

  // Handle updating an existing publisher
  const handleUpdatePublisher = async () => {
    if (!selectedPublisher) {
      toast.error("No publisher selected for update.");
      return;
    }

    if (!selectedPublisher.name || !selectedPublisher.establishmentYear || !selectedPublisher.address) {
      toast.warn("Please fill in all fields before saving."); // Show a warning if fields are incomplete
      return;
    }

    try {
      const updatedData = { ...selectedPublisher };
      await updatePublisher(selectedPublisher.id, updatedData); // Update publisher in the API
      setPublishers((prevPublishers) =>
        prevPublishers.map((publisher) =>
          publisher.id === selectedPublisher.id ? selectedPublisher : publisher)// Update the list of publishers
      ); 
      toast.success("Publisher updated successfully!", { autoClose: 3000 });
      setSelectedPublisher(null); // Reset selected publisher after update
    } catch (err) {
      console.error("Error updating publisher:", err);
      toast.error("Error updating publisher.");
    }
  };

  // Handle deleting a publisher
  const handleDeletePublisher = async (id) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      try {
        await deletePublisher(id); // Delete publisher from the API
        setPublishers((prev) => prev.filter((publisher) => publisher.id !== id)); // Remove from state
        toast.success('Publisher deleted successfully!');
      } catch (err) {
        console.error("Error deleting publisher:", err);
        toast.error('Error deleting publisher.');
      }
    }
  };

  return (
    <div className="publisher-container">
      <h1 className="publisher-header">Publishers</h1>
      {publishers.map((publisher) => (
        <div key={publisher.id} className="publisher-row">
          <p className="publisher-name">{publisher.name}</p>
          <div className="button-group">
            <button onClick={() => toggleDetails(publisher.id)}>
              {visibleDetails[publisher.id] ? "Hide Details" : "Show Details"}
            </button>
            {/* Conditionally render publisher details */}
            {visibleDetails[publisher.id] && (
              <div className="details">
                <p><strong>Year:</strong> {publisher.establishmentYear}</p>
                <p><strong>Address:</strong> {publisher.address}</p>
              </div>
            )}
            <button
              className="update-button"
              onClick={() => setSelectedPublisher(publisher)}
              aria-label="Update Publisher"
            >
            <FaEdit size={20} /> {/* Edit icon */}
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeletePublisher(publisher.id)}
            aria-label="Delete Publisher"
          >
            <FaTrash size={20} /> {/* Trash icon */}
          </button>
          </div>          
        </div>
      ))}

       {/* Form for updating selected publisher */}
      {selectedPublisher && (
        <form className="publisher-form" onSubmit={(e) => { e.preventDefault(); handleUpdatePublisher(); }}>
          <input
            className="form-input"
            type="text"
            name="name"
            value={selectedPublisher.name}
            onChange={(e) => setSelectedPublisher({ ...selectedPublisher, name: e.target.value })}
          />
          <input
            className="form-input"
            type="number"
            name="establishmentYear"
            value={selectedPublisher.establishmentYear}
            onChange={(e) => setSelectedPublisher({ ...selectedPublisher, establishmentYear: e.target.value })}
          />
          <input
            className="form-input"
            type="text"
            name="address"
            placeholder="Address"
            value={selectedPublisher?.address || ""}
            onChange={(e) => setSelectedPublisher({ ...selectedPublisher, address: e.target.value })}
          />
          <button className="form-button" type="submit">Save</button>
        </form>
      )}

      {/* Form for adding a new publisher */}
      <form className="publisher-form" onSubmit={(e) => { e.preventDefault(); handleAddPublisher(); }}>
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={newPublisher.name}
          onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
        />
        <input
          className="form-input"
          type="number"
          name="establishmentYear"
          placeholder="Establishment Year"
          value={newPublisher.establishmentYear}
          onChange={(e) => setNewPublisher({ ...newPublisher, establishmentYear: e.target.value })}
        />
        <input
          className="form-input"
          type="text"
          name="address"
          placeholder="Address"
          value={newPublisher.address}
          onChange={(e) => setNewPublisher({ ...newPublisher, address: e.target.value })}
        />
        <button className="add-form-button" type="submit">Add Publisher</button>
      </form>
    </div>
  );
};

export default PublisherPage;
