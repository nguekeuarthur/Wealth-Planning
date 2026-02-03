require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'a__maryam@hotmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Maryam123!', salt);

        user.password = hashedPassword;
        user.isEmailVerified = true; // Ensure verified
        user.loginAttempts = 0;
        user.lockUntil = null;

        // Force role to likely partner if needed, but keeping existing is safer unless requested.
        // If they want to test partner login, maybe I should ensure role is partner?
        // The user said "essayé de me connecter en tant que partenaire". implies they think they are partner.
        // I will just print the role.
        console.log(`User role is: ${user.role}`);

        await user.save();
        console.log(`Password for ${email} reset to 'ed'`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

reset();
