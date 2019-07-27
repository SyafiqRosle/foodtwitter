const form = document.querySelector('form')
const tweetdiv = document.querySelector('.tweets')
const waitdiv = document.querySelector('.wait');
const API = 'http://localhost:5000/tweets'

getTweets(false)
form.addEventListener('submit',e=>{
    e.preventDefault()
    const formData = new FormData(form)
    const name = formData.get('name')
    const content = formData.get('content')

    const TWEET={
        name,
        content
    }
    console.log(TWEET)
    form.style.display='none'

    fetch(API,{
        method:'post',
        body:JSON.stringify(TWEET),
        headers:{
            'content-type':'application/json'
        }
    }).then(res=>res.json()
        ).then(data=>{
            console.log(data)
            form.reset()
            setTimeout(()=>{
                form.style.display=''; 
            }, 10*1000);    
            getTweets(true);
           
        })
    
})

function getTweets(DisplayWait){
    if(DisplayWait){
        const wait = document.createElement('h3')
        wait.textContent = "please wait"
        waitdiv.appendChild(wait)
        setTimeout(()=>{
            waitdiv.innerHTML=''; 
        },10*1000);
    }
    tweetdiv.innerHTML = '';
    fetch(API)
    .then(res=>res.json())
    .then(tweets=>{
        tweets.reverse()
        tweets.forEach(tweet=>{
    
            const div = document.createElement('div')
            const h3 = document.createElement('h3')
            h3.textContent = tweet.name
            const p = document.createElement('p')
            p.textContent = tweet.content
            const date = document.createElement('small')
            date.textContent = new Date(tweet.created)

            div.appendChild(h3)
            div.appendChild(p)
            div.appendChild(date)
            
            tweetdiv.appendChild(div)
        })
    })
    
}