const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connecté à MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà !');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}\n`);
      
      const overwrite = await question('Voulez-vous créer un nouvel administrateur quand même ? (o/n): ');
      if (overwrite.toLowerCase() !== 'o') {
        console.log('Opération annulée.');
        process.exit(0);
      }
    }

    // Get admin details
    console.log('\n📝 Création d\'un compte administrateur\n');
    
    const username = await question('Nom d\'utilisateur: ');
    if (!username || username.length < 3) {
      console.log('❌ Le nom d\'utilisateur doit contenir au moins 3 caractères');
      process.exit(1);
    }

    const email = await question('Email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Email invalide');
      process.exit(1);
    }

    const password = await question('Mot de passe (min. 7 caractères, 1 majuscule, 1 minuscule, 1 chiffre): ');
    if (!password || password.length < 7) {
      console.log('❌ Le mot de passe doit contenir au moins 7 caractères');
      process.exit(1);
    }
    
    if (!/[A-Z]/.test(password)) {
      console.log('❌ Le mot de passe doit contenir au moins une majuscule');
      process.exit(1);
    }
    
    if (!/[a-z]/.test(password)) {
      console.log('❌ Le mot de passe doit contenir au moins une minuscule');
      process.exit(1);
    }
    
    if (!/[0-9]/.test(password)) {
      console.log('❌ Le mot de passe doit contenir au moins un chiffre');
      process.exit(1);
    }

    // Create admin user
    const admin = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    console.log('\n✅ Administrateur créé avec succès !');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log('\n🔐 Vous pouvez maintenant vous connecter avec ces identifiants.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();
