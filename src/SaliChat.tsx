import {Avatar, Icon, Input, Layout, List, Menu, message, Popover} from 'antd';
import axios from "axios";
import * as React from 'react';
import {Element, scroller} from "react-scroll";
import {environment, url} from './environment.json'
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
        userNameList: [] as string[],
        siderCollapsed: true
    };

    constructor(Props) {
        super(Props);
        this.username = Props.username;
        axios.get("http://" + url[environment] + ":8080/online", {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'text/plain'
            }
        })
            .then(response => {
                return response.data.map(userString => {
                    return User.parse(userString).username
                })
            }).then((retUserList: string[]) => {
            this.state.userNameList = retUserList.filter((value: string) => {
                return (value !== this.username)
            })
        }).catch((err) => {
            message.error(err);
            // console.error(err);
        });
        this.webSocket = new WebSocket('ws://' + url[environment] + ':8081/' + encodeURI(Props.username)); // 建立ws连接
        this.webSocket.onopen = () => {
            this.setState({connectionEstablishment: 'check', cannotUseButton: false});
        };
        this.webSocket.onclose = () => {
            this.setState({connectionEstablishment: 'close', cannotUseButton: true})
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
                }), (
                    (command: ServerCommand) => {
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
        window.onbeforeunload = () => this.webSocket.close();// 关闭窗口时中断连接。
    }

    public render(): React.ReactNode {
        const connectStatus = () => {
            if (this.state.connectionEstablishment === 'check') {
                return (<span><Icon type={'check'} style={{'color': '#00eb00'}}/>Connection Established</span>)
            } else if (this.state.connectionEstablishment === 'close') {
                return (<span><Icon type={'close'} style={{'color': '#eb0200'}}/>Connection Error</span>)
            } else {
                return (<span>Connection problem</span>)
            }
        };
        return (<Layout className="layout">
            <Header>
                <Avatar shape="square" size={32} icon="user"/>
                <div className={"usernameDisplay"}>{this.username} <Popover content={connectStatus()}
                                                                            placement="rightTop"><Icon
                    type={this.state.connectionEstablishment}/></Popover>
                </div>
                <div className={"logout"}><Icon type="logout"/>Logout</div>
            </Header>
            <Content>
                <Layout>
                    <Sider className={'user-sider'} width={200} collapsible={true} collapsed={this.state.siderCollapsed}
                           onCollapse={this.onCollapse}>
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
    private onCollapse = (collapsed) => {
        this.setState({siderCollapsed: collapsed});
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
    private addUser = (user: User) => {
        this.setState({userNameList: this.state.userNameList.concat([user.username])});
    };
    private deleteUser = (user: User) => {
        const newList = this.state.userNameList;
        newList.splice(newList.indexOf(user.username), 1);
        this.setState({userNameList: newList});
    }
}

export default SaliChat;