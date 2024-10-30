import "./App.css";
import Tabs from "./components/Tabs";

function App() {
  return (
    <div className="entry">
      <Tabs />
      <div className="footer">
        <p>
          Made with <span>❤️</span> by{" "}
          <a href="https://github.com/techkelster">etlak</a>
        </p>
      </div>
    </div>
  );
}

export default App;
