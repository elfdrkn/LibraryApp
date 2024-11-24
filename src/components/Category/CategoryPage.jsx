import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './CategoryPage.css'; // Importing CSS file for styling

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [newCategory, setNewCategory] = useState({ name: '', description: '' }); // State for adding a new category
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category to update
  const [visibleDetails, setVisibleDetails] = useState({}); // Track visibility of details

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(); // Get categories from API
      if (data.length === 0) {
        // If no categories, add some sample categories
        const sampleCategories = [
          { name: 'Fiction', description: 'Novels and stories' },
          { name: 'Science', description: 'Books on science' },
          { name: 'History', description: 'Historical books' },
          { name: 'Philosophy', description: 'Philosophical works' },
          { name: 'Technology', description: 'Tech-related books' },
        ];
        for (const category of sampleCategories) {
          await addCategory(category); // Add sample categories
        }
        const updatedData = await getCategories();
        setCategories(updatedData);  // Update state with categories
      } else {
        setCategories(data); // Set categories if there are any
      }
    };
    fetchCategories(); // Call the fetchCategories function on mount
  }, []);

  // Toggle visibility of category details
  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the visibility for the selected category
    }));
  };

   // Add a new category
  const handleAddCategory = async () => {
    try {
      const addedCategory = await addCategory(newCategory); // Call API to add category
      setCategories((prev) => [...prev, addedCategory]);  // Add new category to the list
      setNewCategory({ name: '', description: '' }); // Reset form
      toast.success('Category added successfully!');  // Show success message
    } catch (err) {
      console.error('Error adding category:', err); // Log error
      toast.error('Failed to add category.');// Show error message
    }
  };

  // Update selected category
  const handleUpdateCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, selectedCategory); // Call API to update category
      setCategories((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id ? selectedCategory : category
        )
      );  // Update the list of categories
      setSelectedCategory(null); // Deselect the category
      toast.success('Category updated successfully!'); // Show success message
    } catch (err) {
      console.error('Error updating category:', err); // Log error
      toast.error('Failed to update category.'); // Show error message
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id); // Call API to delete category
        setCategories((prev) => prev.filter((category) => category.id !== id)); // Remove deleted category from the list
        toast.success('Category deleted successfully!'); // Show success message
      } catch (err) {
        console.error('Error deleting category:', err); // Log error
        toast.error('Failed to delete category.'); // Show error message
      }
    }
  };

  return (
    <div className="category-container">
      <h1 className="category-header">Categories</h1>
      {/* Display each category */}
      {categories.map((category) => (
        <div key={category.id} className="category-row">
          <p className="category-name">{category.name}</p>
          <div className="button-group"> 
          <button  onClick={() => toggleDetails(category.id)}>            
              {visibleDetails[category.id] ? "Hide Details" : "Show Details"}
            </button>
            {/* Show category details if visible */}
            {visibleDetails[category.id] && (
              <div className="details">
                <p><strong>Description:</strong> {category.description}</p>
              </div>
            )}   
            {/* Edit and Delete buttons */}       
            <button
              className="update-button"
              onClick={() => setSelectedCategory(category)}
              aria-label="Update Publisher"
            >
            <FaEdit size={20} /> {/* Edit icon */}
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeleteCategory(category.id)}
            aria-label="Delete Publisher"
          >
            <FaTrash size={20} /> {/* Trash icon */}
          </button>            
          </div>          
        </div>
      ))}

      {/* Category Update Form */}
      {selectedCategory && (
        <form className="category-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateCategory();
          }}
        >
          <input
            className="form-input"
            type="text"
            name="name"
            value={selectedCategory.name}
            onChange={(e) =>
              setSelectedCategory({ ...selectedCategory, name: e.target.value })
            }
          />
          <input
            className="form-input"
            type="text"
            name="description"
            value={selectedCategory.description}
            onChange={(e) =>
              setSelectedCategory({
                ...selectedCategory,
                description: e.target.value,
              })
            }
          />
          <button className="form-button" type="submit">Save</button>
        </form>
      )}

      {/* New Category Addition Form */}
      <form className="author-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCategory();
        }}
      >
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <input
          className="form-input"
          type="text"
          name="description"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <button className="add-form-button" type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default CategoryPage;
