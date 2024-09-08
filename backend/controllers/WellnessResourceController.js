const WellnessResource = require('../models/WellnessResourceModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Assuming you have a UserModel for referencing the user

// Create a wellness resource
const createResource = asyncHandler(async (req, res) => {
  const { resourceTitle, resourceCategory, resourceURL } = req.body;

  const newResource = await WellnessResource.create({
    resourceTitle,
    resourceCategory,
    resourceURL,
    createdBy: req.user._id, // Created by the current user
  });

  res.status(201).json(newResource);
});

// Get all resources (with user details)
const getAllResources = asyncHandler(async (req, res) => {
    const resources = await WellnessResource.find({})
      .populate("createdBy", "name email") // Ensure this is correct
      .exec();
    res.status(200).json(resources);
  });  

// Delete a resource by ID
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await WellnessResource.findById(req.params.resourceId);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  await resource.remove();
  res.status(200).json({ message: 'Resource deleted' });
});

module.exports = { createResource, getAllResources, deleteResource };
