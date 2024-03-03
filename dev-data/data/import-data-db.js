/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

const DB =
  'mongodb+srv://tayyab:077BuiknatOtUsIT@cluster0.xckkbxb.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database is connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(data);
    console.log('Data is transferred to DB');
    process.exit();
  } catch (err) {
    console.log('There is some error in transferring the data ');
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Cleared the DB');
    process.exit();
  } catch (err) {
    console.log('There is  some error in deleting the data');
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
