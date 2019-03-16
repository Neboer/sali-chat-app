import axios from 'axios'
import {environment, url} from "../environment.json";
import {parseUserList} from "./Post"
import User from "./User";

export function getOnlineUser(callback: (onlineUserList: User[], err: Error | null) => void) {
    axios.get("http://" + url[environment] + ":8080/online", {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'text/plain'
        }
    }).then(response => {
        callback(
            parseUserList(response.data), null)
    }, err => {
        callback([], err)
    }).catch(error => console.error(error))
}