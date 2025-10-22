import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Create Admin User
    const admin = await prisma.user.upsert({
      where: { id: 'admin' },
      update: {},
      create: {
        id: 'admin',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        balance: 0,
        points: 0,
        isBanned: false
      }
    });

    // Create Test User 1
    const user1 = await prisma.user.upsert({
      where: { id: 'user1' },
      update: {},
      create: {
        id: 'user1',
        name: 'Test User 1',
        password: userPassword,
        role: 'USER',
        balance: 10000,
        points: 0,
        isBanned: false
      }
    });

    // Create Test User 2
    const user2 = await prisma.user.upsert({
      where: { id: 'user2' },
      update: {},
      create: {
        id: 'user2',
        name: 'Test User 2',
        password: userPassword,
        role: 'USER',
        balance: 10000,
        points: 0,
        isBanned: false
      }
    });

    console.log('✅ Test users created successfully!');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('');
    console.log('👑 ADMIN:');
    console.log('   ID: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 USER 1:');
    console.log('   ID: user1');
    console.log('   Password: user123');
    console.log('');
    console.log('👤 USER 2:');
    console.log('   ID: user2');
    console.log('   Password: user123');
    console.log('');
    console.log('🚀 Now you can login at: http://localhost:3001');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();