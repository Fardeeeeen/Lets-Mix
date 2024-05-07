import path from 'path';
import express from "express";
import axios from "axios";
import { fileURLToPath } from 'url'; 

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const viewsPath = path.join(__dirname, '..', 'client', 'views');
const publicPath = path.join(__dirname, '..', 'client','public');

app.set('view engine', 'ejs');
app.use(express.static(publicPath));
app.set('views', viewsPath);

app.get('/', async (req, res) => {
  try {
    let url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

    // Check if there's a search query in the URL
    if (req.query.search) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.query.search}`;
    }

    // Make a request to the CocktailDB API
    const response = await axios.get(url);

    if (response.data.drinks) {
      // If drinks are available, display the first one
      const cocktail = response.data.drinks[0];
      res.render('index.ejs', { cocktail });
    } else {
      // If no drinks are found, display a message
      res.render('index.ejs', { notFound: true });
    }
  } catch (error) {
    console.error('Error fetching data from the API:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});