import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import MainLayoutClient from './MainLayoutClient';

function MainLayout({ children }) {
  return (
    <MainLayoutClient
      header={<Header />}
      footer={<Footer />}
    >
      {children}
    </MainLayoutClient>
  );
}


export default MainLayout