const express = require('express');
const cors = require('cors');
const monk = require('monk');
const app = express();
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
console.log(process.env.MONGODB_URI)
const db = monk('mongodb://syafiq:syafiq@foodtweetdb-shard-00-00-yalqd.mongodb.net:27017,foodtweetdb-shard-00-01-yalqd.mongodb.net:27017,foodtweetdb-shard-00-02-yalqd.mongodb.net:27017/test?ssl=true&replicaSet=foodtweetdb-shard-0&authSource=admin&retryWrites=true&w=majority');
//create collection:tweets
const tweetdb = db.get('tweets');
const filter = new Filter();
//incoming requests to server passes thru middleware cors, auto add cors headers
app.use(cors());
//parse json body
app.use(express.json());

// when client makes a get request on slash route
app.get('/',(req,res)=>{
    res.json({
        message: 'hey ee'
    })
})

app.get('/tweets',(req,res)=>{
    tweetdb.find()
    .then(tweets=>{
        res.json(tweets);
    });
    
});

 // prevent sending empty tweets
function isValidTweet(tweet){
    return tweet.name && tweet.name.toString().trim()!=='' && 
        tweet.content && tweet.content.toString().trim()!=='' 
} 

//only add ratelimit after refreshing page
app.use(rateLimit({
    windowMs:10*1000,//30 secs
    max:1 //limit each IP to 1 req per windowMs
}));


app.post('/tweets',(req,res)=>{
    if(isValidTweet(req.body)){
        //insert db, toString() to prevent injection
        const tweet={
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        tweetdb.insert(tweet)
        .then(createdTweet=>{
            res.json(createdTweet);
        });

    }else{
        req.statusCode(422);   
        req.json({
            message:'Name and content required.'
        })
    }
    console.log(req.body);
})
var port =  process.env.PORT || 5000
app.listen(port,()=>console.log("Working well"));