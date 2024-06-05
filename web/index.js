const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

//mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', itemSchema);

//CRUD
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
