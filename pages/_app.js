import 'antd/dist/reset.css'; 
import './globals.css'; 
import LayoutApps from '../components/LayoutApps';
import { AppProvider } from '../context/AppContext';

export default function App({ Component, pageProps }) {
  return (
    <>
    <AppProvider>
    <LayoutApps>
  <Component {...pageProps} />
  </LayoutApps>
  </AppProvider>
  </>
);
}