// Import the Cosmo theme from Bootswatch
import 'bootswatch/dist/lux/bootstrap.min.css';
// If you're using Bootstrap's JavaScript components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import PromptManagement from './pages/PromptManagement';
import PromptPlayground from './pages/PromptPlayground';
import PromptCreator from './pages/PromptCreator';
import Home from './pages/Home';

function App() {

	return (
		<Router>
			<div>
				{/* Navigation Bar 
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<div className="container">
						<Link className="navbar-brand" to="/">My App</Link>
						<div className="collapse navbar-collapse">
							<ul className="navbar-nav me-auto">
								<li className="nav-item">
									<Link className="nav-link" to="/">Home</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/about">About</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				*/}

				{/* Route Components */}
				<Routes>
					<Route path="/" element={<Home ></Home>} />
					<Route path="/manage" element={<PromptManagement></PromptManagement>} />
					<Route path="/playground" element={<PromptPlayground></PromptPlayground>} />
					<Route path="/create" element={<PromptCreator></PromptCreator>} />
				</Routes>
			</div>
		</Router>
	);
}

export default App
