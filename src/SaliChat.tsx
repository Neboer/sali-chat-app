import {Avatar, Icon, Input, Layout, List, Menu, message} from 'antd';
import axios from "axios";
import * as React from 'react';
import {Element, scroller} from "react-scroll";
import Message from "./Module/Message";
import {parseTransmission} from "./Module/Post";
import ServerCommand from "./Module/ServerCommand";
import User from "./Module/User";
import './SaliChat.css';

const {Header, Footer, Content, Sider} = Layout;
class SaliChat extends React.Component<{ username: string }> {
    public listLength = 0;// 为了使滚动能够自动到底，使用listLength变量以达到自动实现目的
    public username: string = '';// 由props传递而来，是用户的用户名
    public webSocket: WebSocket;// 这是客户端与服务器建立的连接
    public state = {
        messageData: [] as string[],
        connectionEstablishment: 'loading',
        cannotUseButton: true,
        messageWaitForSend: '',
        userNameList: [] as string[]
    };

    constructor(Props) {
        super(Props);
        this.username = Props.username;
        axios.get("http://localhost:8080/online",{headers:{'Accept': '*/*','Content-Type':'text/plain'}})
            .then(response=> {
                return response.data.map(userString => {
                    return User.parse(userString).username
                })
        }).then((retUserList:string[]) => {
            this.state.userNameList = retUserList.filter((value:string)=>{
                return (value!==this.username)
            })
        }).catch((err)=>{
            console.error(err);
        });
        this.webSocket = new WebSocket('ws://localhost:8081/' + encodeURI(Props.username)); // 建立ws连接
        this.webSocket.onopen = () => {
            this.setState({connectionEstablishment: 'check-circle', cannotUseButton: false});
        };
        this.webSocket.onclose = () => {
            this.setState({connectionEstablishment: 'close-circle', cannotUseButton: true})
        };
        this.webSocket.onmessage = (ev => {
            parseTransmission(ev.data,
                (() => {
                    this.addMessage(ev.data);
                    this.listLength += 250;
                    scroller.scrollTo('messageContainerScroll', {
                        offset: this.listLength,
                        containerId: 'containerElement'
                    });
                }),(
                    (command:ServerCommand)=>{
                        switch (command.command) {
                            case "login":
                                this.addUser(command.parameters.user);
                                break;
                            case "logout":
                                this.deleteUser(command.parameters.user);
                                break;
                        }
                    }
                )
                );
        });
        this.webSocket.onerror = () => {
            message.error("error");
            this.setState({connectEstablishment: 'close-circle', cannotUseButton: true})
        };
    }

    public render(): React.ReactNode {
        return (<Layout className="layout">
            <Header>
                <Avatar shape="square" size={32} icon="user"/>
                <div className={"usernameDisplay"}>{this.username} <Icon type={this.state.connectionEstablishment}/>
                </div>
                <div className={"logout"}><Icon type="logout"/> Logout</div>
            </Header>
            <Content>
                <Layout>
                    <Sider width={200}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{height: '100%'}}>
                            {this.state.userNameList.map((value, index) => {
                                return (
                                    <Menu.Item key={index}>
                                        <Icon type={'user'}/>
                                        <span>{value}</span>
                                    </Menu.Item>
                                )
                            })}
                        </Menu>
                    </Sider>
                    <Content className={"messageContent"}>
                        <Element
                            name="messageContainerScroll"
                            className="element"
                            id="containerElement">
                            <List
                                itemLayout="vertical"
                                bordered={true}
                                dataSource={this.state.messageData}
                                renderItem={this.showItem}
                                className={"messageList"}
                            />
                        </Element>
                        <Input.Search placeholder="message here" enterButton="Send" size="large"
                                      onSearch={this.sendMessage}
                                      onChange={this.messageChange} value={this.state.messageWaitForSend}
                                      disabled={this.state.cannotUseButton}/>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Sali-chat ©2019 Created by Neboer
            </Footer>
        </Layout>);
    }

    // private showUser = this.state.userNameList.map((value, index) => {
    //     return (
    //         <Menu.Item key={index}>
    //             <Icon type={'user'}/>
    //             <span>{value}</span>
    //         </Menu.Item>
    //     )
    // });
    private showItem = (item) => {
        const messageInList = Message.parse(item);
        return <List.Item>
            <List.Item.Meta title={messageInList.poster} description={messageInList.time.toLocaleTimeString()}/>
            {messageInList.message}
        </List.Item>
    };
    private sendMessage = (messagel) => {
        (new Message(this.username, new Date(), messagel)).send(this.webSocket);
        this.setState({messageWaitForSend: ''})
    };
    private messageChange = (event) => {
        this.setState({messageWaitForSend: event.target.value})
    };
    private addMessage = (piece: string) => {
        this.setState({messageData: this.state.messageData.concat([piece])})
    };
    private addUser = (user:User) => {
        this.setState({userNameList:this.state.userNameList.concat([user.username])});
    };
    private deleteUser = (user:User) => {
        const newList = this.state.userNameList;
        newList.splice(newList.indexOf(user.username),1);
        this.setState({userNameList:newList});
    }
}

export default SaliChat;