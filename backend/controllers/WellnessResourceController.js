const WellnessResource = require('../models/WellnessResourceModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Create a wellness resource
const createResource = asyncHandler(async (req, res) => {
  const { resourceTitle, resourceCategory, resourceURL } = req.body;

  const newResource = await WellnessResource.create({
    resourceTitle,
    resourceCategory,
    resourceURL,
    createdBy: req.user._id, // Created by the current user
    createdAt: Date.now(), // Ensure the date is set correctly
  });  

  console.log("Resource Created:", newResource);
  res.status(201).json(newResource);
});

// Get all resources (with user details)
const getAllResources = asyncHandler(async (req, res) => {
  try {
    const resources = await WellnessResource.find({}) // Use the correct model
      .populate("createdBy", "name email") // Populate user info
      .exec();

    console.log("Resources fetched:", resources);
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

// Delete a resource by ID
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await WellnessResource.findById(req.params.resourceId);

  if (!resource) {
    console.error("Resource not found for deletion");
    res.status(404);
    throw new Error('Resource not found');
  }

  await resource.remove();
  res.status(200).json({ message: 'Resource deleted' });
});

module.exports = { createResource, getAllResources, deleteResource };
