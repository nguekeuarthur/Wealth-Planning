const Client = require("../models/Client");

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin)
const getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate('projects', 'name status imageUrl')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${clients.length} clients in database`);
    res.json({ clients });
  } catch (error) {
    console.error("Error in getClients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('projects', 'name status imageUrl category completion startDate');
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.json(client);
  } catch (error) {
    console.error("Error in getClientById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Admin)
const createClient = async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phoneNumber,
      address,
      website,
      logoUrl,
      companySize,
      industry,
      notes,
      status
    } = req.body;

    // Check if client with this email already exists
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: "Client with this email already exists" });
    }

    // Create new client
    const client = await Client.create({
      companyName,
      contactName,
      email,
      phoneNumber,
      address,
      website,
      logoUrl,
      companySize,
      industry,
      notes,
      status: status || "active"
    });

    res.status(201).json({ 
      message: "Client created successfully", 
      client 
    });
  } catch (error) {
    console.error("Error in createClient:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update client details
// @route   PUT /api/clients/:id
// @access  Private (Admin)
const updateClient = async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phoneNumber,
      address,
      website,
      logoUrl,
      companySize,
      industry,
      notes,
      status
    } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Update fields
    if (companyName) client.companyName = companyName;
    if (contactName) client.contactName = contactName;
    if (email) client.email = email;
    if (phoneNumber !== undefined) client.phoneNumber = phoneNumber;
    if (address !== undefined) client.address = address;
    if (website !== undefined) client.website = website;
    if (logoUrl !== undefined) client.logoUrl = logoUrl;
    if (companySize !== undefined) client.companySize = companySize;
    if (industry !== undefined) client.industry = industry;
    if (notes !== undefined) client.notes = notes;
    if (status !== undefined) client.status = status;

    const updatedClient = await client.save();
    
    res.json({ 
      message: "Client updated successfully", 
      client: updatedClient 
    });
  } catch (error) {
    console.error("Error in updateClient:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error in deleteClient:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  getClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient 
};
