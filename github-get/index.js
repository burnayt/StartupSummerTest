/*
avatar_url: "https://avatars.githubusercontent.com/u/16421706?v=4"
bio: null
blog: ""
company: null
created_at: "2015-12-24T04:26:55Z"
email: null
events_url: "https://api.github.com/users/burnayt/events{/privacy}"
followers: 0
followers_url: "https://api.github.com/users/burnayt/followers"
following: 1
following_url: "https://api.github.com/users/burnayt/following{/other_user}"
gists_url: "https://api.github.com/users/burnayt/gists{/gist_id}"
gravatar_id: ""
hireable: null
html_url: "https://github.com/burnayt"
id: 16421706
location: null
login: "burnayt"
name: null
node_id: "MDQ6VXNlcjE2NDIxNzA2"
organizations_url: "https://api.github.com/users/burnayt/orgs"
public_gists: 0
public_repos: 16
received_events_url: "https://api.github.com/users/burnayt/received_events"
repos_url: "https://api.github.com/users/burnayt/repos"
site_admin: false
starred_url: "https://api.github.com/users/burnayt/starred{/owner}{/repo}"
subscriptions_url: "https://api.github.com/users/burnayt/subscriptions"
twitter_username: null
type: "User"
updated_at: "2022-05-11T00:19:03Z"
url: "https://api.github.com/users/burnayt"
*/


let a = null;
document.querySelector('#click').addEventListener('click', function(){
    console.log(this.dataset.user)
    fetch(this.dataset.user)
    .then(responce => responce.json() )
    .then(data => {
        console.log(data);
        //data.name
        //data.login
        //data.avatar_url
        //data.company
        //data.followers
        //data.following
    })
    .catch(err =>{
        console.log(err)
    })   
})

document.querySelector('#click2').addEventListener('click', async function(){
    let p = await fetch(this.dataset.user)
    let g=  await p.json()
    console.log(g);

})