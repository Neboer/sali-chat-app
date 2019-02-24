import {Button, Icon, Input, message, Modal} from "antd";
import axios from "axios";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import {environment, url} from "./environment.json";
import SaliChat from './SaliChat';

// import logo from './logo.svg';
class MainPage extends React.Component {
    public state = {visible: false, loading: false, username: '', password: '', openState: 'login'};// openState:login/register
    public clickLoginButton = () => {
        this.setState({visible: true, openState: 'login'})
    };
    public clickRegisterButton = () => {
        this.setState({visible: true, openState: 'register'})
    };
    public handleCancel = () => {
        this.setState({visible: false})
    };
    public handleLogin = () => { // 用户登录逻辑
        axios.post("http://" + url[environment] + ":8080/login",
            {username: this.state.username,password:this.state.password},
            {headers: {'Accept': '*/*', 'Content-Type': 'text/plain'}}).then(response => {
            switch (response.data) {
                case 'ok': {
                    message.success("welcome," + this.state.username);
                    this.setState({loading: false});
                    ReactDOM.render(<SaliChat
                        username={this.state.username}/>, document.getElementById('root') as HTMLElement);
                    break;
                }
                case 'no user': {
                    message.error("invalid user name " + this.state.username);
                    this.setState({loading: false});
                    break;
                }
                case 'wrong password': {
                    message.error('wrong password');
                    this.setState({loading: false});
                    break;
                }
            }
        }).catch(() => {
            message.error('connection error');
            this.setState({loading: false})
        })
    };
    public handleRegister = () => { // 用户注册逻辑
        axios.post("http://" + url[environment] + ":8080/register",
            {username: this.state.username,password: this.state.password},
            {headers: {'Accept': '*/*', 'Content-Type': 'text/plain'}}).then(response => {
            if (response.data === 'ok') {
                message.success('register granted');
                this.handleLogin()
            } else {
                message.info('duplicated username');
                this.setState({loading: false});
            }
        })
    };
    public changeUsername = (event) => {
        this.setState({username: event.target.value})
    };
    public changePassword = (event) => {
        this.setState({password: event.target.value})
    };
    public handleSubmit = () => {
        this.setState({loading: true});
        if (this.state.openState === 'login') {
            this.handleLogin()
        } else {
            this.handleRegister()
        }
    };

    public render() {
        return (
            <div className="App">
                <p className={"header"}>Sali Chat!</p>
                <header className="App-header">
                    <h1 className="App-title">Welcome here!</h1>
                    <p><Button type={"primary"} icon={"login"} className={"buttons"} shape={"round"}
                               onClick={this.clickLoginButton}> Login </Button></p>
                    <p><Button type={"default"} className={"buttons"} shape={"round"}
                               onClick={this.clickRegisterButton}><Icon type={"login"} rotate={270}/> Register</Button>
                    </p>
                    <Modal title={this.state.openState} visible={this.state.visible} onCancel={this.handleCancel}
                           footer={[<Button key={"back"} type={"default"} onClick={this.handleCancel}>cancel</Button>,
                               <Button key={'login'} type={"primary"} onClick={this.handleSubmit}
                                       loading={this.state.loading}>{this.state.openState}</Button>]}>
                        input your username and password
                        <Input.Group size={"large"}>
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   onChange={this.changeUsername}
                                   placeholder="Username" value={this.state.username}/>
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   onChange={this.changePassword} className={'input-box'}
                                   type="password" placeholder="Password"/>
                        </Input.Group>
                    </Modal>
                </header>
                <p className="App-intro">
                    to build a small secure chat app
                </p>
            </div>
        );
    }

}

export default MainPage;
