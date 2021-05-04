

const express = require("express");
const path = require("path");
const cors = require('cors');
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://myUser:safeer@cluster0.ghcwz.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

 // CREATE

app.post("/api/restaurants", (req,res)=>{
    db.addNewRestaurant(req.body).then((result)=>{
        res.status(201).json("Restaurant created successfully");
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
        res.status(204).json("Restaurant updated successfully");
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });  
});



// DELETE

app.delete("/api/restaurants/:id", (req,res)=>{
    db.deleteRestaurantById(req.params.id).then((result)=>{
        res.status(204).json("Restaurant deleted");
    }).catch((err)=>{
        res.status(500).json({message: err.message});
    });  
}); 



app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"/index.html"));
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
