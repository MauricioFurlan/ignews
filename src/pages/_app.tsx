import { AppProps } from 'next/app';
import {Header} from '../components/Header';
import '../styles/global.scss';
import { Provider as NextAuthProvider } from 'next-auth/client';
// arquivo que recarrega toda vez que o usuario troca de pagina, quando vc deseja carregar um arquivo uma vez exemplo font
 // deve-se utilizar o arquivo _documents
function MyApp({ Component, pageProps }: AppProps) {
  return (
  <NextAuthProvider session={pageProps.session}>
    <Header />
    <Component {...pageProps} />
  </NextAuthProvider>
  )
}

export default MyApp
