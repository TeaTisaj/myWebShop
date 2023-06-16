var path = require("path");
var ejs = require("ejs");
//importanje rutera
var hr = require("./routes/home.routes");
var cr = require("./routes/cart.routes");
var express = require("express");
var session = require("express-session");

//inicijalizacija expressa
const app = express();

//inicijalizacija session middleware-a
app.use(
    session({
        secret: "anything",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            maxAge: 24 *
                60 * 60 * 1000, //trajanje sednice
            sameSite: "lax"
        }
    })
);
//obavezno da mogu korisrit body
var bodyParser = require("body-parser");
//za to da bodijelim body na vise dijelova
app.use(express.urlencoded({ extended: false }));


app.use(express.json());

// setup views mape i ejs engine-a

//res.set(atribut,value) stavi atribut na tu vrijednost 

//ukljucujem ejs u svoj kod
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//setup statičkog poslužitelja koji statički poslužuje datoteke unutar public
app.use(express.static(path.join(__dirname, 'public')));
//router middleware
app.use('/home', hr);
app.use('/cart', cr);
//pokretanje servera




app.use(bodyParser.urlencoded({ extended: true }))


//render znaci kao otvori .ejs file
app.get('/', function(req, res) {
    //izracunaj odgovor na temelju req i odgovori pomocu res
    res.redirect('/home/getCategories');
});

app.get('/home/cart.ejs', function(req, res) {
    res.redirect('/cart');
});

app.get('/home/getCategories/cart.ejs', function(req, res) {
    res.redirect('/cart');
});
app.get('/home/getProducts/cart.ejs', function(req, res) {
    res.redirect('/cart');
});

app.listen(3000); //port koji slusa

//appp je instanca od express i onda mogu ili get ili post
//OPCENITOOOOOOO
//METODA get, POST put, Put na koju putanju stavljamo
//app.metoda('/putanja/ovajoblik', fjaOdgovora);

//u fji mogu imati i next() ona poziva sljedecu komponentu u lancu, ako nisam odmah odgovor preko res.



function isProdInCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].cnt++;
            return true;
        }
    }
    return false;
}



app.post('/addToCart', function(req, res) {
    //uzmi data iz forme
    var id = req.body.id;
    var name = req.body.name;
    var cnt = req.body.cnt;
    var image = req.body.image;
    var product = { id: id, name: name, cnt: cnt, image: image };


    if (req.session.cart) { //ako vec imamo karticu
        var cart = req.session.cart || [];

        if (!isProdInCart(cart, id)) {
            product.cnt = 1;
            cart.push(product);
        }
    } else {
        product.cnt = 1;
        req.session.cart = [product];
        var cart = req.session.cart;

    }
    // console.log(cart);

    res.redirect('./cart');

});

app.get('/cart', function(req, res) {
    //arg koji saljemo
    var cart = req.session.cart || [];

    res.render('cart', { cart: cart });
    //res.render(putanja  gdje zelim rez, podaci koje zelim prenjeti u tu drugu str)

});