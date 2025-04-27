import Header from './Header';
import Footer from './home/Footer';

const Layout = ({ children }) => {
  return (
    <div className="App px-[120px] h-full">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;