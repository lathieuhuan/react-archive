import { CloseCircleOutlined } from "@ant-design/icons";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./features";

import { topCluster } from "./routes";
import { renderRoutes } from "@Routes/renderRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {renderRoutes(topCluster)}
            <Route path="*" element={<Home.NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
