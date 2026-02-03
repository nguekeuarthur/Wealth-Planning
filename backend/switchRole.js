require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const setPartner = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'edimaevina@icloud.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        user.role = 'partner';
        await user.save();
        console.log(`User ${email} role updated to 'partner'`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

setPartner();
