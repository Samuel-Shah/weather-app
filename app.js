const express = require("express");
const https = require("https");
const { static } = require("express");
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");
  
});

app.post("/", function(req, res){

    const query = req.body.cityName;
const appKey = "a9f8deeab7c3f17ad5cbd4f91c59e99e";
const unit = "metric";

const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appKey+"&units="+unit+""

https.get(url, function(response){
    console.log(response.statusCode)

    if(response.statusCode===200){

    response.on("data",  function(data){

        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        
        res.write("<p>The weather is currently " + weatherDescription +"</p>");
        res.write("<h1>The temperature in "+query+" is " + temp + " degrees celcius</h1>");
        res.write("<img src="+ iconURL+">")
        res.send();
        
    })
    }else{
        res.write("The city that you have entered, does not exist or is not in our records");
        res.end();
    }
})
})




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on  port 3000");
})
