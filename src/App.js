import React, {useEffect, useState, useRef} from 'react';
import axios from "axios";
import NightCity from './assets/NightCity.jpg';
import './App.css';

const url = 'https://rhea-eclipse-server.herokuapp.com/posts'

export const fetchPosts = () => axios.get(url)


function App() {

    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
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

    const conPost = async () => {

        const posts = await fetchPosts()
        console.log("BLIA : ", posts.data)

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
                    <button onClick={connect}>Войти</button>
                    <button onClick={conPost}>XXXXXX</button>
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
