// ServerCommand用来构筑服务器传递到客户端的命令对象,需要客户端实现execute方法
import Command from "./Command";
import User from "./User";

class ServerCommand extends Command{ // 注意：服务器端的ServerCommand对象没有执行意义，因此不会执行。
    public static commandList = ['login','logout'];
    public static parse = (str:string):ServerCommand => {
        const a = JSON.parse(str);
        const b:User = User.parse(a.parameters.user);
        return new ServerCommand(a.command,{user:b})
    };
    public parameters = {
        user:new User('',new Date(),new Date())
    };
    public toString = () => {
        const a = this.parameters.user.toString();
        return JSON.stringify(
            {
                command:this.command,
                parameters:{user:a}
            }
        )
    };
}

export default ServerCommand