const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    var broj = 0; //refresha se na 0 kad ponovno odem na back
    var cart = req.session.cart || [];
    for (let i = 0; i < cart.length; i++) {
        broj += cart[i].cnt;
    }
    res.render('cart', {
        cart: req.session.cart,
        broj
    })
})

function isProductInCart(cart, id) {

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].cnt++;
            return true;
        }
    }

    return false;

}

router.post("/add/:id([0-9]{1,10})", function(req, res, next) {
    let id = parseInt(req.params.id);


    var name = req.body.name;
    var cnt = req.body.cnt;
    var product = { id: id, name: name, cnt: cnt };

    if (req.session.cart) {
        var cart = req.session.cart || [];

        if (!isProductInCart(cart, id)) {
            product.cnt = 1;
            cart.push(product);
        }
    } else {
        product.cnt = 1;
        req.session.cart = [product];
        var cart = req.session.cart || [];

    }

    /*res.render('cart', {
        cart: cart
    })
*/
    return res.sendStatus(204); // server ne renderira novu stranicu
    // to za njega radi lokalna js skripta

});

router.post("/addCart/:id([0-9]{1,10})", function(req, res, next) {
    let id = parseInt(req.params.id);


    var name = req.body.name;
    var cnt = req.body.cnt;
    var product = { id: id, name: name, cnt: cnt };

    if (req.session.cart) {
        var cart = req.session.cart || [];

        if (!isProductInCart(cart, id)) {
            product.cnt = 1;
            cart.push(product);
        }
    } else {
        product.cnt = 1;
        req.session.cart = [product];
        var cart = req.session.cart || [];

    }
    return res.redirect('/cart');
    /*res.render('cart', {
        cart: cart
    })
*/
    //return res.sendStatus(204); // server ne renderira novu stranicu
    // to za njega radi lokalna js skripta

});


router.post("/remove/:id([0-9]{1,10})", function(req, res, next) {
    let id = parseInt(req.params.id);

    if (req.session.cart) {
        var cart = req.session.cart;

        // Pronalazi proizvod u košarici
        var productIndex = findProductIndex(cart, id);

        if (productIndex !== -1) {
            var product = cart[productIndex];

            // Smanjuje vrijednost cnt ili briše proizvod ako cnt postane 0
            if (product.cnt > 0) {
                product.cnt -= 1;
            }

            if (product.cnt === 0) {
                cart.splice(productIndex, 1); // Briše proizvod iz košarice
            }

            req.session.cart = cart;
        }
    }
    return res.redirect('/cart');
    //  return res.sendStatus(204);
});

// Pomoćna funkcija za pronalaženje indeksa proizvoda u košarici
function findProductIndex(cart, id) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            return i;
        }
    }
    return -1; // Proizvod nije pronađen
}


router.get("/getAll", function(req, res, next) {
    var broj = 0; //refresha se na 0 kad ponovno odem na bac
    var cart = req.session.cart || [];
    for (let i = 0; i < cart.length; i++) {
        broj += cart[i].cnt;
    }

    return res.render("cart", { // objekt koji će te koristit u cart.ejs }
        broj,
        cart: req.session.cart
    });
});



module.exports = router;