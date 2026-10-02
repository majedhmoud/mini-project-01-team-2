import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { store } from "./store";
import MysteryRoom from "./components/MysteryRoom";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/mysteries/sealed-observatory" replace />}
          />
          <Route path="/mysteries/:mysteryId" element={<MysteryRoom />} />
          <Route
            path="*"
            element={<Navigate to="/mysteries/sealed-observatory" replace />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
