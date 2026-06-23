import { UserAuthProvider } from "./hooks/useUserAuth";
import AdminApp from "./admin/AdminApp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import LoginPage from "./sections/LoginPage";

const path = window.location.pathname;

function App() {
  // Admin panel
  if (path.startsWith("/admin")) return <AdminApp />;

  // Standalone login/register page
  if (path === "/login" || path === "/register") {
    return (
      <UserAuthProvider>
        <LoginPage />
      </UserAuthProvider>
    );
  }

  // Main portfolio
  return (
    <UserAuthProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </UserAuthProvider>
  );
}

export default App;
