const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

dotenv.config({ path: path.join(__dirname, '/config/dev.env') });

const PORT = process.env.PORT;
require('./utils/connectToDB');
// import routes
const usersRoute = require('./components/user/userAPI');
const profilesRoute = require('./components/profile/profileAPI');
const tasksRoute = require('./components/task/taskAPI');

const app = express();
app.use(express.json());

mkdirp.sync(require('./config/fileUploadDir').profileUploadDir);

app.use('/api/users', usersRoute);
app.use('/api/profiles', profilesRoute);
app.use('/api/tasks', tasksRoute);

app.listen(PORT, (err) => {
    if (err) {
        console.log(chalk.bold.red('ERROR'), err);
    }
    console.log(chalk.bold.cyan(`server is running on port ${PORT}`));
});
