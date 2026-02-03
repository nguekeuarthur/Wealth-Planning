#!/usr/bin/env node

/**
 * Usage:
 *   node resetUserPassword.js --email=a__maryam@hotmail.com --password=Maryam123
 *
 * The script will connect to the project's MongoDB (reads MONGODB_URI from env),
 * find the user by normalized email and set the given password (bcrypt hashed).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  args.forEach(arg => {
    const [k, v] = arg.split('=');
    if (k && v) {
      out[k.replace(/^--/, '')] = v;
    }
  });
  return out;
}

const normalizeEmail = (email) => email && email.trim().toLowerCase();

async function main() {
  const { email, password } = parseArgs();

  if (!email || !password) {
    console.error('Usage: node resetUserPassword.js --email=EMAIL --password=NEWPASSWORD');
    process.exit(2);
  }

  try {
    await connectDB();

    const normalized = normalizeEmail(email);
    const user = await User.findOne({ email: normalized });
    if (!user) {
      console.error('User not found for email:', normalized);
      process.exit(3);
    }

    // Optional: basic password validation (at least 6 chars)
    if (password.length < 6) {
      console.error('Password too short. Choose at least 6 characters.');
      process.exit(4);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Reset login attempts and locks so user can sign in immediately
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();
    console.log(`Password updated successfully for user: ${user.email} (id: ${user._id})`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err.message || err);
    process.exit(1);
  }
}

main();
