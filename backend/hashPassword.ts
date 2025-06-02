import bcrypt from 'bcrypt';

const password = 'admin101'; 
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log('Hashed password:', hash);
    process.exit(0); 
  })
  .catch(err => {
    console.error('Error hashing password:', err);
    process.exit(1);
  });
