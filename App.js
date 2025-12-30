import axios from "axios";
import { useState } from "react";
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  const createPaste = async () => {
    try {
      const res = await axios.post("http://localhost:5000/paste", {
        content: text,
        expireMinutes: 5,
        maxViews: 3
      });
      setLink(`http://localhost:5000${res.data.link}`);
      setText("");
    } catch (err) {
      console.log(err);
      alert("Failed to create paste");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <h1>Paste App</h1>
      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Write your text here..."
      />
      <button onClick={createPaste}>Create Paste</button>

      {link && (
        <div className="link-container">
          <p>Shareable Link: <a href={link} target="_blank" rel="noreferrer">{link}</a></p>
          <button onClick={copyLink} className="copy-btn">Copy Link</button>
        </div>
      )}
    </div>
  );
}

export default App;
