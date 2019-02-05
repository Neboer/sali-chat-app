import {Button , Form, Icon,Input,Modal} from "antd";
// import axios from 'axios';
import * as React from 'react';
import './App.css';

// import logo from './logo.svg';
const http = new XMLHttpRequest();
class MainPage extends React.Component {
    public state={visible:false,loading:false,username:'',password:''};
    // constructor(props:any){
    //     super(props);
    //     this.changeUsername = this.changeUsername.bind(this)
    // }
    public clickLoginButton = ()=>{
        this.setState({visible:true })
    };
    public handleCancel = ()=>{
        this.setState({visible:false})
    };
    public handleLogin = ()=>{
        this.setState({loading:true});
        http.open("post","http://localhost:8080/",true);
        http.send(JSON.stringify({username:this.state.username,password:this.state.password}));
        http.onreadystatechange =  ()=> {
            if(http.readyState === 4 && http.status === 200) {
                alert(http.responseText);
            }
        };
    };
    public changeUsername = (event) =>{
        this.setState({username:event.target.value})
    };
    public changePassword = (event) =>{
        this.setState({password:event.target.value})
    };
    public render() {
        return (
            <div className="App">
                <p className={"header"}>Sali Chat!</p>
                <header className="App-header">
                    <h1 className="App-title">Welcome here!</h1>
                    <p><Button type={"primary"} icon={"login"} className={"buttons"} shape={"round"} onClick={this.clickLoginButton}> Login </Button></p>
                    <p><Button type={"default"} className={"buttons"} shape={"round"}><Icon type={"login"} rotate={270}/> Register</Button></p>
                    <Modal title={"Login"} visible={this.state.visible} onCancel={this.handleCancel}
                           footer={[<Button key={"back"} type={"default"} onClick={this.handleCancel}>cancel</Button>,
                               <Button key={"submit"} type={"primary"} onClick={this.handleLogin} loading={this.state.loading}>login</Button>]}>
                        input your username and password
                        <Form>
                            <Form.Item>
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.changeUsername}
                                       placeholder="Username" value={this.state.username}/>
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.changePassword}
                                       type="password" placeholder="Password"/>
                            </Form.Item>
                        </Form>
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
