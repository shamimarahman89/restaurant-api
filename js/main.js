/*****************************************************************************************************
 * WEB422 - Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: Shamima Rahman                   Student ID:154321194             Date: 2nd February 2021
 * 
 * 
 ******************************************************************************************************/


//This should be an empty array (we will populate it later with a "fetch" call to our back end API)
var restaurantData = [];

// This should be an empty object (ie: {} – we will populate it later once the user clicks on a specific restaurant within our UI)
var currentRestaurant  = {};


// This will keep track of the current page that the user is viewing. Set it to 1 as the default value
var page = 1;

// This will be a constant value that we will use to reference how many restaurant 
// items we wish to view on each page of our application. For this assignment, we will set it to 10.
var perPage = 10;

// This will be a reference to our current "map", once it has been initialized. For now, simply assign it a value of null
var map = null;

// This function can be used to help you calculate the average score, given an array of "grades" objects for a
// specific restaurant (ie: [{date, grade, score}, …] as its input parameter. 
// It will loop through the grades array to determine average score and return it (formatted using .toFixed(2)).

function avg(grades){
     var i;  var sum = 0;
     for(i =0; i < grades.length; i++){
        sum += grades[i].score;
    }
    return (sum / grades.length).toFixed(2);
}

// This will be a constant value that consists solely of a Lodash template (defined using the _.template() function). 
// The idea for this template is that it will provide the functionality to return all the rows for our main "restaurant-table",
// given an array of "restaurant" data. For example, if the tableRows template was invoked with the first two results back from 
// our Web API (left), it should output the following HTML (right):

/*
var compiled = _.template('<% _.forEach(users, function(user) { 
    %><li><%- user %></li><% 
}); %>');

*/

var tableRows = _.template(`<% _.forEach(restaurants, function(restaurant){
    %><tr data-id="<%- restaurant._id %>">
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
        <td><%- avg(restaurant.grades) %></td>
    </tr><%
}); %>`);

function loadRestaurantData(){
    fetch("/api/restaurants?page=" + page + "&perPage=" + perPage).then(res=>res.json()).then(data=>{
            console.log(data);
            restaurantData = data;
            var generatedTable = tableRows({restaurants: data});
            $("#restaurant-table tbody").html(generatedTable);
            $("#current-page").html(page);
        }).catch(err=>{
            console.log(err);
        }); 
}

$(function(){
    console.log("DOM is ready!");
    loadRestaurantData();
    // Click event for all tr elements within the tbody of the restaurant-table
    $("#restaurant-table tbody").on("click", "tr", function(e){
        let id = $(this).attr("data-id");
        console.log("id selected " + id);
        for(var i = 0; i< restaurantData.length; i++){
            if(restaurantData[i]._id == id){
                currentRestaurant = restaurantData[i];
                $("#restaurant-modal .modal-title").html(currentRestaurant.name);
                $("#restaurant-address").html(currentRestaurant.address.building + " " + currentRestaurant.address.street);
                $("#restaurant-modal").modal({
                    backdrop: "static",
                    keyboard: false
                }); 
                return;
            }
        }
        
        
    });

    // Click event for the "previous page" pagination button
    $("#previous-page").on("click", function(e){
        if(page > 1){
            page = page -1;
            loadRestaurantData();
        }
    });

    // Click event for the "next page" pagination button
    $("#next-page").on("click", function(e){
         page = page + 1;
        loadRestaurantData();
        
    });

    // shown.bs.modal event for the "Restaurant" modal window
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });
        L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
    });

    // hidden.bs.modal event for the "Restaurant" modal window
    $('#restaurant-modal').on('hidden.bs.modal', function (){
        map.remove();
    });
});


