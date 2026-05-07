const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abhayrajchauhan976_db_user:BJjSFLVQLxxYed4l@cluster0.ywcm2sa.mongodb.net/taskflow?appName=Cluster0')
.then(() => {
  console.log('Success');
  process.exit(0);
})
.catch(err => {
  console.error('Failure:', err);
  process.exit(1);
});
