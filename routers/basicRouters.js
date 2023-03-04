require('dotenv').config()
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const userDB = {
    users: require('../model/users.json')
}

const postDB = {
    posts: require('../model/posts.json'),
    setPosts: function(data) {
        this.posts = data
    }
}



router.get('/', async(req, res) => {
    const newsAPI = `https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian`
    const news_get = await axios.get(newsAPI);
    const newsData = news_get.data.meals;


    const postList = postDB.posts
    const jwtCookie = req.cookies.JWT
    const stripeKey = 'stripekey'
    
    res.render('index', {postList, jwtCookie, stripeKey, newsData})
});

router.get('/admin', (req, res) => {
    res.render('admin/adminlogin')
})

router.get('/adminpanel', (req, res) => {
    const userList = userDB.users
    const postList = postDB.posts
    res.render('admin/adminpanel', {userList, postList})
})

router.get('/create-post', (req, res) => {
    res.render('upload')
})

router.get('/blink', (req, res) => {
    res.render('blink_proj/blink')
});

router.get('/result', async(req, res) => {
    const searchQuery = (req.query.query || "").toLowerCase().replace(/\s+/g, "_");
    const jwtCookie = req.cookies.JWT
    
    const newsAPI = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuery}`
    const news_get = await axios.get(newsAPI);
    const newsData = news_get.data.meals;

    if(Array.isArray(newsData) === true) {
        const results = newsData;

        res.render('results', {results, jwtCookie});
    }
    else{
        res.render('404', {jwtCookie});
    }
})

router.get('/content/:id', async (req, res) => {
    const newsQuery = (req.params.id);
    const newsAPI = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${newsQuery}`
    const news_get = await axios.get(newsAPI);
    const newsData = news_get.data.meals;

    const results = newsData;
    const jwtCookie = req.cookies.JWT


    res.render('content', {results, jwtCookie});
});

router.get('/payment', (req, res) => {
    const postList = postDB.posts
    const jwtCookie = req.cookies.JWT
    res.render('payment', {postList, jwtCookie});
});

/*router.post('/payments', async(req, res) => {
    const { client_secret } = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card'],
    })
    console.log(client_secret)
    res.json({ clientSecret: client_secret})
});*/

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: 'price_1MbgDSSDxJRIdwCCSzpoHsvx',
              quantity: req.body.quantity,
            },
          ],
          mode: 'payment',
          success_url: `http://localhost:7000/`,
          cancel_url: `http://localhost:7000/cancel`,
          payment_method_types: ['card']
        });
        
        res.status(200).json({ id: session.id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});


router.post('/adminlogin', (req, res) => {
    const {adminname, adminpassword} = req.body;

    if(adminname === "popbob", adminpassword === "popbob"){
        res.redirect('adminpanel')
    }
    else{
        res.sendStatus(401);
    }
})

router.get('/dummydatafile', (req, res) => {
    res.render('test')
});

router.get('/dummydata', (req, res) => {
    console.log(req.body.class);
    res.send('Officially be sanitized');
});



module.exports = router;
