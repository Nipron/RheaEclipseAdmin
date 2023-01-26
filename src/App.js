import React, {useState, useRef} from 'react';
import axios from "axios";
import NightCity from './assets/NightCity.jpg';
import './App.css';
import {io} from "socket.io-client";

const url = 'https://rhea-eclipse-server.herokuapp.com'
const urlSocket = 'https://rhea-eclipse-socket.herokuapp.com'
const url2 = 'http://localhost:5000'

const handleInit = msg => {
    console.log(msg)
}

const socket = io(urlSocket)
socket.on('init', handleInit)

export const fetchPosts = () => axios.get(url)
export const createPost = data => axios.post(url, data)

export const bigRegister = data => {
    console.log(data);
    return axios.post(`${url}/auth/register`, data)
}
export const bigRegister2 = data => axios.get(`${url}/auth`)


function App() {

    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
   // const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const b = 5;

    function connect() {

        console.log("AAA")
        //socket.current = new WebSocket('ws://localhost:5000')
        socket.current = new WebSocket('wss://rhea-eclipse-socket.herokuapp.com/')

        console.log("BBB")

        socket.current.onopen = () => {
            setConnected(true)
            /*  const message = {
                  event: 'connection',
                  username,
                  id: Date.now()
              }
              socket.current.send(JSON.stringify(message))*/
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

    const sendZZZ = async () => {

        console.log("HTHT")

        /*  title: String,
              message: String,
              creator: String,
              tags: [String],
              selectedFile: String,
              likeCount: {
              type: Number,
          default: 0,
          },
          createdAt: {
              type: Date,
          default: new Date(),
          },*/

        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'zzz'
        }
        socket.current.send(JSON.stringify(message));
        console.log("Sent ")
        setValue('')
    }

    const conPost = async () => {
        console.log("PIZDA")
        const posts = await fetchPosts()
        console.log("BLIA : ", posts.data)
    }

    const createV = async () => {
        let bb = await createPost({creator: "LL", title: "XXX", message: "j"})
        console.log(bb)
    }

    const login = async () => {

    }

    const register = async () => {
        const response = await bigRegister({email: username, password})
        console.log("RESP from server: ", response)
    }

    const connectIO = () => {
        console.log("GG")
        socket.emit('kuku', 'epta')
    }


    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="text"
                        placeholder="Введите пароль"/>
                    <button onClick={login}>Login</button>
                    <button onClick={register}>Register</button>
                    <button onClick={connectIO}>ConnetcIO</button>
                </div>
            </div>
        )
    }

    return (
        <div className="App" style={{backgroundImage: `url(${NightCity})`}}>
            <span className="BigName">Rhea Eclipse Admin</span>
            <div className="form">
                <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button onClick={sendMessage}>Отправить</button>
                <button onClick={sendZZZ}>sendZZZ</button>
            </div>
            <div className="messages">
                {messages.map(mess =>
                    <div className="message" key={mess.id}>
                        {mess.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
