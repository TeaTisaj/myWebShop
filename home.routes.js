const express = require("express");
const router = express.Router();

const data = require('../data/mydata'); //mydata.js se save u 


//ovdje ce te koristit dvije GET metode

router.get("/getCategories", function(req, res, next) {
    var kat = "Odaberite kategoriju";
    var broj = 0; //refresha se na 0 kad ponovno odem na back
    var cart = req.session.cart || [];
    for (let i = 0; i < cart.length; i++) {
        broj += cart[i].cnt;
    }

    // console.log(broj);

    return res.render("home", {

        broj,
        kat,
        // Ovdje pišete objekt koji će se koristiti u "home.ejs" predlošku, na primjer:
        // U taj objekt možete stavljati sve što će vam trebati za renderiranje stranice u "home.ejs",
        // pri čemu možete pisati funkcije koje će dohvaćati podatke iz "mydata.js"
        session: req.session,
        categories: data.categories,
        products: data.categories.find(cat => cat.id == 1).produkt //tako da u mainu ispisuje 1.kat njih saljem u home.ejs za foreach
    });
});

router.get("/getProducts/:id([0-9]{1,10})", function(req, res, next) {
    var broj = 0; //refresha se na 0 kad ponovno odem na back
    var kat = "Odaberite kategoriju";
    var cart = req.session.cart || [];
    for (let i = 0; i < cart.length; i++) {
        broj += cart[i].cnt;
    }


    res.render("home", {
        broj,
        kat: data.categories.find(cat => cat.id == req.params.id).name,
        // Ovdje pišete objekt koji će se koristiti u "home.ejs" predlošku, na primjer:
        //u taj objekt možete stavljat sve što će vam trebat za renderiranje stranice u home.ejs , pri
        //čemu možete pisat funkcije koje će dohvaćat podatke iz mydata.js
        session: req.session,
        categories: data.categories,
        id: req.params.id,
        products: data.categories.find(cat => cat.id == req.params.id).produkt
    });
});




//ove dvije rute koriste isti .ejs, ali pune ga različitim podacima
// pošto nije u potpunosti definirano za što bi se trebala koristi /getCategories ruta, možete ili
//prikazat stranicu samo s navigacijom bez proizvoda, ili napunite svim proizvodima


module.exports = router;