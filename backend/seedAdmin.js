const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin account already exists');
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();

    console.log('Admin account created: admin@example.com');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin:', error);
    mongoose.connection.close();
  }
};

seedAdmin();