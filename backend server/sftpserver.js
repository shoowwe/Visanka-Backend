const Client = require('ssh2-sftp-client');
const sftp = new Client();

async function makeDirectories() {
  try {
    await sftp.connect({
      host: '0.0.0.0',
      port: 22,
      username: 'mohd shoeib',
      password: '24samshoeib',
    });

    const dir = '/home/AdminPanel/genre';
    await sftp.mkdir(dir, true);

    console.log('Directory created successfully');
  } catch (error) {
    console.error('Error creating directory:', error);
  } 
}

makeDirectories();

module.exports = sftp;