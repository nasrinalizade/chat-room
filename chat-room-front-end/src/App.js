import React, {Component} from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './css/MessageStyle.css';
import LoginComponent from "./components/LoginComponent";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typedMessage: "",
            nameForSearch: "",
            searchedMessages: [],
            name: ""
        }
    }

    setName = (name) => {
        console.log(name);
        this.setState({name: name});
    };

    sendMessage = () => {
        if (this.state.name !== "" && this.state.typedMessage !== "") {
            this.clientRef.sendMessage('/app/chat-all', JSON.stringify({
                name: this.state.name,
                message: this.state.typedMessage
            }));
            this.setState({typedMessage: ""})
        }
    };

    getMessages = () => {
        const apiUrl = 'http://localhost:8080/api/messages?name=' + this.state.nameForSearch;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.setState({searchedMessages: data});
                console.log(this.state.searchedMessages);
            });
    };

    displayMessages = () => {
        return (
            <div className="chat-history">
                <ul className="m-b-0">
                    {this.state.messages.map(msg => {
                        return (
                            <li className="clearfix">
                                {this.state.name === msg.name ?
                                    <div className="message my-message">
                                        <b>{msg.name} : </b><br/>
                                        <p>{msg.message}</p>
                                    </div> :
                                    <div className="message other-message float-right">
                                        <b>{msg.name} : </b><br/>
                                        <p>{msg.message}</p>
                                    </div>
                                }
                            </li>)
                    })}
                </ul>
            </div>
        );
    };

    displaySpecificMessages = () => {
        return (
            <div id="plist" className="people-list col-md-4">

                <TextField className=" get-box" id="outlined-basic" label="Enter Name" variant="outlined"
                           onChange={(event) => {
                               this.setState({nameForSearch: event.target.value});
                           }}/>

                <Button variant="contained" color="primary" className="input-group-prepend message-btn"
                        onClick={this.getMessages}><i className="fa fa-search"></i></Button>

                <ul className="list-unstyled chat-list mt-2 mb-0">
                    {this.state.searchedMessages.map(msg => {
                        return (
                            <li className="clearfix">
                                {this.state.name === msg.name ?
                                    <div className="message my-message">
                                        <b>{msg.name} : </b><br/>
                                        <p>{msg.message}</p>
                                    </div> :
                                    <div className="message other-message float-right">
                                        <b>{msg.name} : </b><br/>
                                        <p>{msg.message}</p>
                                    </div>
                                }
                            </li>)
                    })}
                </ul>
            </div>
        );
    };

    render() {
        return (
            <div className="container">
                <div className="row row clearfix">
                    <div className="card row">
                        {this.displaySpecificMessages()}
                        <div className="chat col-md-8">
                            <div className="chat-header clearfix">
                                <div className="row">
                                    <LoginComponent setName={this.setName}/>

                                    <div className="align-center man-header">
                                        <h1>Chat Room</h1>
                                        <br/><br/>
                                    </div>
                                    <div className="col-lg-12">
                                        <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar"/>
                                        </a>
                                        <div className="chat-about">
                                            <h3 className="m-b-0 m-t-1"> {this.state.name}</h3>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="chat-message clearfix">
                                <br/><br/>
                                <div className="input-group mb-0">

                                    <TextField className="form-control message-box" id="outlined-basic"
                                               label="Enter Your Message" variant="outlined"
                                               value={this.state.typedMessage}
                                               onChange={(event) => {
                                                   this.setState({typedMessage: event.target.value});
                                               }}/>

                                    <Button variant="contained" color="primary"
                                            className="input-group-prepend message-btn"
                                            onClick={this.sendMessage}><i className="fa fa-send"></i></Button>


                                </div>
                            </div>
                            <br/><br/>

                            {this.displayMessages()}


                            <SockJsClient url='http://localhost:8080/websocket-chat/'
                                          topics={['/topic/chat']}
                                          onConnect={() => {
                                              console.log("connected");
                                          }}
                                          onDisconnect={() => {
                                              console.log("Disconnected");
                                          }}
                                          onMessage={(msg) => {
                                              var jobs = this.state.messages;
                                              jobs.push(msg);
                                              this.setState({messages: jobs});
                                              console.log(this.state);
                                          }}
                                          ref={(client) => {
                                              this.clientRef = client
                                          }}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;