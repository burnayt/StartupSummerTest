import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

import { ReactComponent as OctocatLogo } from './Octocat-logo.svg';
import { ReactComponent as ZoomLogo } from './zoom-icon.svg';
import { ReactComponent as FollowersLogo } from './followers.svg';
import { ReactComponent as FollowingsLogo } from './following.svg';
import { ReactComponent as NotFoundLogo } from './user-not-found.svg';
import { ReactComponent as NoReposLogo } from './no-repos.svg';



//https://api.github.com/users/burnayt/repos?per_page=4&page=1
class App extends React.Component {
    constructor(props) {
        super(props);
        this.requestSearch = this.requestSearch.bind(this);
        this.state = {mainState: 'initial'};
    }
    
    componentDidMount(){
        //Test Purpose
        //this.requestSearch('gaearon');
    }
    requestSearch(name){        
        this.setState({mainState: 'searching'})
        this.setState({result:name});        
        Promise.all(
            [fetch(`https://api.github.com/users/${name}`),
            fetch(`https://api.github.com/users/${name}/repos?per_page=4&page=1`)]
        )
        .then(response =>   {
            let result = [];
            response.forEach(element =>{
                if (response[0].ok){
                    result.push(element.json())
                }    
                else{  
                    console.log(response[0])              
                    throw new Error('404');
                }
            })
            return Promise.all(result);
        }
        )
        .then(data =>{
            // let name = '';
            // if ( data[0].twitter_username != null) {
            //     // name = data[0].twitter_username.replace('_', ' ').split(' ');
            //     // name = `${name[0][0].toUpperCase()}${name[0].slice(1, name[0].length)} ${name[1][0].toUpperCase()}${name[1].slice(1, name[1].length)}`                
            //     name = data[0].twitter_username;
            // }
            // else if (data[0].name != null){
            //     name = data[0].name
            // }
            // else{
            //     name = data[0].login
            // }
            let name = data[0].name || data[0].twitter_username || data[0].login || '';
            if (name) {
                name = `${name[0].toUpperCase()}${name.slice(1, name.length)}`                
            }
            let user = {
                pic:data[0].avatar_url,
                name: name,
                login:data[0].login,
                followers: data[0].followers,
                following:data[0].following,
                repNum: data[0].public_repos,
                url: data[0].html_url
            } 
            // console.log(data[1])
            this.setState({user:user, repos:data[1], mainState:'found'})
        })
        .catch(e => {
            this.setState({mainState:'error'});
        })
    }
    render() {
        if (this.state.mainState === 'error') {
            return(
                <>
                    <Header request={this.requestSearch}/>
                    <Main 
                        user={this.state.user}
                        repos={this.state.repos}                    
                        mainState ={this.state.mainState}
                    />      
                </>
            )
        }
        else if (this.state.mainState === 'found' || this.state.mainState === 'initial'){
            return (
                <>
                    <Header request={this.requestSearch}/>
                    <Main 
                        user={this.state.user}
                        repos={this.state.repos}                    
                        mainState ={this.state.mainState}
                    />                
                </>
            );

        }
        else if (this.state.mainState === 'searching'){
            return (
                <>
                    <Header request={this.requestSearch}/>
                    <Main 
                        user={this.state.user}
                        repos={this.state.repos}                    
                        mainState ={this.state.mainState}
                    />                
                </>
            );

        }
        
    }
}

class SearchField extends React.Component {    
    OnKeyUp = (event)=>{
        if (event.code === 'Enter') {
            // console.log( event.target );
            // event.target.blur()    ;
            this.props.request(event.target.value)
        }        
    }
    render() {
        return (
            <div className="search">
                <div className="icon">
                    <ZoomLogo/>
                </div>
                <div className="input">
                    <input type="text" onKeyUp={this.OnKeyUp} placeholder="Enter GitHub username" name="" id="" />
                </div>
                <div className="tail">
                </div>                
            </div>
        );
    }

}
class Header extends React.Component {
    render() { 
        return(
            <div className="header-container">
                <div className="content">
                    <div>
                        <OctocatLogo/>
                    </div>
                    <SearchField request={this.props.request} />
                </div>
            </div>
        );
    }
}
class Main extends React.Component {
    render() {
        
        if (this.props.mainState === 'initial') {
            return(                       
                <div className="main-container">                    
                        <ZoomLogo/>
                        <p>
                            Start with searching a GitHub user
                        </p>
                </div>
            )    
        }else if (this.props.mainState === 'found') {            
            return(
                <div className="main-found">                
                  <Bio user={this.props.user}/>  
                  <Repos login={this.props.user.login} repos={this.props.repos} repNum={this.props.user.repNum}/>
                </div>
            )
        }else if (this.props.mainState === 'error'){
            return(
                <div className="main-container">                    
                        <NotFoundLogo className="not-found"/>
                        <p>
                            User not found
                        </p>
                </div>
            )
        } else if (this.props.mainState === 'searching'){
            return(
                <div className="main-container">                                            
                        <div className="loader">                            
                        </div>
                        <p>Searching...</p>
                </div>
            )
        } 
        
    }
}

class Bio extends React.Component {
    render() {
        let followers = this.props.user.followers;
        let following = this.props.user.following;
        if (followers > 1000) {
            followers = `${Math.round(followers/100)/10}k`
        }
        if (following > 1000) {
            following = `${Math.round(following/100)/10}k`
        }
        return(
            <div className="bio-content">
                <img src={this.props.user.pic} alt="user"/>
                <h1>{this.props.user.name}</h1>
                <a href={this.props.user.url}>{this.props.user.login}</a>
                <div className="bio-all">
                    <div>
                        <FollowersLogo/>
                        <span>{followers} followers</span>
                    </div>
                    <div>
                        <FollowingsLogo/>
                        <span>{this.props.user.following} following</span>
                    </div>
                
                </div>
                
            </div>
        );
    }
}
class Repos extends React.Component {
    constructor(props) {
        super(props);
        this.requestPage = this.requestPage.bind(this);
        //console.log('props', props.repos);
        this.state = {repos:props.repos};
        this.currentPage = 1;
    }
    
    requestPage(event){
        
        if (event.target.dataset.index === undefined ||
            event.target.dataset.index === this.currentPage) {
            return;
        }  
        
        let page = event.target.dataset.index;
        if (page === 'lt') {
            page = this.currentPage - 1;    
            if (page < 1) {
                return;
            }
        }
        if(page === 'gt') {
            page = this.currentPage + 1;
            if (page > Math.ceil( this.props.repNum/4)) {
                return;
            }
        }
        
        this.currentPage = parseInt(page, 10);     
        fetch(`https://api.github.com/users/${this.props.login}/repos?per_page=4&page=${page}`)
        .then(element=>element.json())
        .then(data=>
            this.setState({repos:data})
            );
    }
    render() {
        console.log(this.state.repos.length)
        const repos = this.state.repos.map((element)=>{
            return <SingleRepositoriy 
            key={element.id}
            url={element.html_url} 
            name={element.name}
            description={element.description || "No description."}
            />
        })
        const pages = 
        [this.currentPage-1, this.currentPage, this.currentPage+1].filter(element=>{                      
            if (element > 1 && element < Math.ceil( this.props.repNum/4)) {
                return true;
            }
            return false;
        })
        .map( 
            element => {
                return(
                    <div data-index={element} key={element}
                    className={element === this.currentPage? "current": ''}
                    >
                        {element}                    
                    </div>
                )
                
            }
        );
        if (this.currentPage > 3) {
            pages.unshift(<div key={-1}>...</div>)
        }
        if(this.currentPage <= Math.ceil( this.props.repNum/4) - 2){
            pages.push(<div key={-2}>...</div>)
        }   
        //RETURNs
        if (this.props.repNum === 0) {
            return(
                <div className="repos-empty">
                    <div>

                    </div>
                    <NoReposLogo/>
                    <p>
                        Repository list is empty
                    </p>
                </div>
            )
        }     
        else{
            return(
                <div className="repos-container">
                    <div>
                        <h2>Repositories({this.props.repNum})</h2>
                    </div>
                    <div className="repos-list">
                        {repos}
                    </div>
                    <div className="repos-pages">
                        <div className="stat">
                            { 4*(this.currentPage-1)+1} - {this.currentPage*4} of {Math.ceil( this.props.repNum)}
                        </div>
                        <div className="page-panel" onClick={this.requestPage}>
                            <div data-index="lt">
                                &lt;
                            </div>
                           
                            <div data-index="1" className={this.currentPage === 1? 'current':''}>
                                1
                            </div>
                            {pages}
                            <div data-index={Math.ceil( this.props.repNum/4)}
                             className={this.currentPage === Math.ceil( this.props.repNum/4)? 'current':''}>
                                {Math.ceil( this.props.repNum/4)}
                            </div>
                            
                            <div data-index="gt">
                                &gt;
                            </div>
                          
                        </div>
                        
                    </div>                
                </div>
            );
            
        }
        
    }
}
class SingleRepositoriy extends React.Component{
    render() {
        return(
            <div>
                <a href={this.props.url}>{this.props.name}</a>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

class Error extends React.Component{
    render() {
        return(
                <div>
                </div>
        )
    }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);