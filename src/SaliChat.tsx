import {Avatar, Icon, Input, Layout, List, message} from 'antd';
import * as React from 'react';
import {Element} from "react-scroll";
import './SaliChat.css';

const {Header, Content, Footer} = Layout;
const fuckTSlint: string[] = [];//  为了让制杖tslint不把空数组识别为never
class SaliChat extends React.Component<{ username: string }> {
    public username: string = '';
    public webSocket: WebSocket;
    /* 我有必要为这个代码加一个注释。我只能说ts实在是太牛逼了，搞求不来。
    * tslint自动把空数组识别为never类型也就算了，
    * 你为啥还不允许在state数组里存入子对象？？？
    * 来来来，react是哪个制杖发明的，我想和你好好谈谈！！！！*/
    public state = {
        messageData: fuckTSlint,
        connectionEstablishment: 'loading',
        cannotUseButton: true,
        messageWaitForSend: ''
    };

    constructor(Props) {
        super(Props);
        this.username = Props.username;
        this.webSocket = new WebSocket('ws://localhost:8081'); // 建立ws连接
        this.webSocket.onopen = () => {
            this.setState({connectionEstablishment: 'check-circle', cannotUseButton: false});
        };
        this.webSocket.onclose = () => {
            this.setState({connectionEstablishment: 'close-circle', cannotUseButton: true})
        };
        this.webSocket.onmessage = (ev => {
            this.addPiece(ev.data)
        });
        this.webSocket.onerror = () => {
            message.error("error");
            this.setState({connectEstablishment: 'close-circle', cannotUseButton: true})
        };
    }

    public showItem = (item) => {
        const c = JSON.parse(item);
        return <List.Item>
            <List.Item.Meta title={c.poster} description={(new Date(c.time)).toLocaleTimeString()}/>
            {c.message}
        </List.Item>
    };
    public makeMessage = (poster: string, time: Date, messagel: string) => {
        return JSON.stringify({poster: poster, time: time.toString(), message: messagel})
    };
    public addPiece = (piece: string) => {
        // const a = this.state.messageData;
        // a.push(piece);
        this.setState({messageData: this.state.messageData.concat([piece])})
    };
    public sendMessage = (messagel) => {
        this.webSocket.send(this.makeMessage(this.username, new Date(), messagel));
        this.setState({messageWaitForSend: ''})
    };
    public messageChange = (event) => {
        this.setState({messageWaitForSend: event.target.value})
    };

    public render(): React.ReactNode {
        return (<Layout className="layout">
            <Header>
                <Avatar shape="square" size={32} icon="user"/>
                <div className={"usernameDisplay"}>{this.username} <Icon type={this.state.connectionEstablishment}/>
                </div>
                <div className={"logout"}><Icon type="logout"/> Logout</div>
            </Header>
            <Content className={"messageContent"}>
                <Element
                    name="test7"
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
                <Input.Search placeholder="message here" enterButton="Send" size="large" onSearch={this.sendMessage}
                              onChange={this.messageChange} value={this.state.messageWaitForSend} disabled={this.state.cannotUseButton}/>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Sali-chat ©2019 Created by Neboer
            </Footer>
        </Layout>);
    }
}

export default SaliChat;