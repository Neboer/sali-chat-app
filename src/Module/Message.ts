// 消息类定义，所有传递中的消息都是消息类的实例。
// import * as React from "react";

class Message {
    public static parse = (messageJsonString: string): Message => {
        const a = JSON.parse(messageJsonString);
        return new Message(a.poster, new Date(a.time), a.message)
    };
    public poster: string; // 发送者
    public time: Date; // 发送时间
    public message: string; // 消息内容
    constructor(poster: string, time: Date, message: string) {
        this.poster = poster;
        this.time = time;
        this.message = message;
    }

    public send = (socket: WebSocket): void => {
        socket.send(this.stringify())
    };


    // public setIntoState = (component:React.Component,arrayName:string):void => {
    //     const newStateArray:any[] = component.state[arrayName].concat(this.stringify());
    //     const setStateObject = {};
    //     setStateObject[arrayName]=newStateArray;
    //     component.setState(setStateObject)
    // };
    private stringify = () => {
        return JSON.stringify(
            {poster: this.poster, time: this.time.toString(), message: this.message})
    };
}

export default Message