import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { store } from "./store/store";
import { Provider } from "react-redux";
import PlayerDetails from "./pages/actorDetails/actorDetails"
ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);

<Router>
    <Routes>
        <Route path="/player/:id" element={<PlayerDetails />} />
    </Routes>
</Router>;