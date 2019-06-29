const form = document.querySelector('form');
const loadingGIF = document.querySelector('.loading');
const tweetdiv = document.querySelector('.tweets');
const waitdiv = document.querySelector('.wait');
const API_URL = 'http://localhost:5000/tweets';
// const API_URL = window.location.hostname=== 'localhost'?'http://localhost:5000/tweets': 'https://server.syafiqroslezz.now.sh/tweets ';
loadingGIF.style.display='';

listAllTweets(false);

form.addEventListener('submit',e=>{
    //prevent refresh on submit
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const tweet={
        name,
        content
    };
    console.log(tweet)
    form.style.display='none'
    loadingGIF.style.display=''

    //send data to backend server
    fetch(API_URL, {
        method:'POST',
        body: JSON.stringify(tweet),
        headers:{
            'content-type':'application/json'
        }
    }).then(response=>response.json())
    .then(createdTweet=>{
            console.log(createdTweet);
            form.reset();
            setTimeout(()=>{
                form.style.display=''; 
            }, 10*1000);    
            listAllTweets(true);
        });
});

function listAllTweets(displayWaitMessage){
    if (displayWaitMessage){
        const wait = document.createElement('h3');
        wait.textContent ="Please wait a while before posting another tweet.";
        waitdiv.appendChild(wait);
        setTimeout(()=>{
            waitdiv.innerHTML=''; 
        },10*1000);
    }
   
    tweetdiv.innerHTML = '';
    fetch(API_URL)
    .then(response=>response.json())
    .then(tweets=>{
        tweets.reverse();
        console.log(tweets)
        tweets.forEach(tweet=>{
            const div = document.createElement('div');
            const header = document.createElement('h3');
            header.textContent = tweet.name;
            const contents = document.createElement('p');
            contents.textContent = tweet.content;
            const date = document.createElement('small');
            date.textContent = new Date(tweet.created);
            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);
            tweetdiv.appendChild(div);
            
        });
        loadingGIF.style.display='none';
    });
}