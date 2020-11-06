const mongoose = require('mongoose');
const chalk = require('chalk');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            console.log(chalk.bold.red('ERROR'), err);
        }
        console.log(chalk.bold.blue('mongodb connected'));
    }
);
