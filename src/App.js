import NightCity from './assets/NightCity.jpg';
import './App.css';


function App() {
  return (
    <div className="App" style={{backgroundImage: `url(${NightCity})`}}>
      <span className="BigName">Rhea Eclipse Admin</span>
    </div>
  );
}

export default App;
