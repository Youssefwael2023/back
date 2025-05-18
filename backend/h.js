const bcrypt = require('bcryptjs');

const run = async () => { const hashed = await bcrypt.hash('admin123', 10); console.log('🔐 Hashed Password:', hashed); };

run();