import VoiceAssistant from './components/VoiceAssistant';
import { ApiProvider } from './contexts/ApiContext';
import { AudioProvider } from './contexts/AudioContext';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <ApiProvider>
        <AudioProvider>
          <VoiceAssistant />
        </AudioProvider>
      </ApiProvider>
    </div>
  );
}

export default App;
