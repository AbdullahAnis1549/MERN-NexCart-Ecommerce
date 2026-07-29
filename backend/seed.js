import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from './Config/DB.js';
import User from './Models/UserSchema.js';

dotenv.config({ quiet: true });

const demoAccounts = [
  {
    name: 'Demo User',
    email: 'user@example.com',
    phone: '03001234567',
    password: 'passworduser123',
    role: 'user',
  },
  {
    name: 'Demo Admin',
    email: 'admin@example.com',
    phone: '03001234567',
    password: 'admin123',
    role: 'admin',
  },
];

const seedAccounts = async () => {
  await connectDB();

  for (const account of demoAccounts) {
    const hashedPassword = await bcrypt.hash(account.password, 12);
    const existing = await User.findOne({ email: account.email });

    const data = {
      name: account.name,
      email: account.email,
      phone: account.phone,
      password: hashedPassword,
      role: account.role,
      verifystatus: true,
      verifycode: null,
      resetpasscode: null,
      resetpasscodeexp: null,
    };

    if (existing) {
      await User.updateOne({ email: account.email }, data);
      console.log(`Updated seed account: ${account.email}`);
    } else {
      await User.create(data);
      console.log(`Created seed account: ${account.email}`);
    }
  }
};

seedAccounts()
  .then(() => {
    console.log('Seed complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
