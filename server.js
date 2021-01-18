/*****************************************************************************************************
 * WEB422 - Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: Shamima Rahman                   Student ID:154321194             Date: 18th January 2021
 * Heroku Link:
 * 
 ******************************************************************************************************/

const express = require("express");
const path = require("path");
const cors = require('cors');
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://myUser:safeer@cluster0.ghcwz.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

 // CREATE

app.post("/api/restaurants", (req,res)=>{
    db.addNewRestaurant(req.body).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });
    
});

 // READ

 app.get("/api/restaurants", (req,res)=>{
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });
    
});

 app.get("/api/restaurants/:id", (req,res)=>{
    db.getRestaurantById(req.params.id).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });
});


// UPDATE

app.put("/api/restaurants/:id", (req,res)=>{
    db.updateRestaurantById(req.body, req.params.id).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });  
});



// DELETE

app.delete("/api/restaurants/:id", (req,res)=>{
    db.deleteRestaurantById(req.params.id).then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });  
}); 



app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/index.html"));
});


/* app.get("/", (req,res)=>{
    res.json({message: ` API Listening`});
}); */


db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
