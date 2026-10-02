import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { store } from "./store";
import MysterySelection from "./components/MysterySelection";
import MysteryRoom from "./components/MysteryRoom";
import MysteryReveal from "./components/MysteryReveal";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<MysterySelection />} />
          <Route
            path="/mysteries/:mysteryId/result"
            element={<MysteryReveal />}
          />
          <Route path="/mysteries/:mysteryId" element={<MysteryRoom />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
