// carregado uma unica vez na aplicação, comparado com o index.html do public 
//obrigatorio formato de classe
// a pagina renderizada deve ser preenchida com os componentes do document importados ao inves de tags html
import Document, { Html, Head, Main, NextScript } from 'next/document'
export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet"/>
                    <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
                </Head>
                <body>
                    <Main />
                    <NextScript/>  
                    {/* NextScript é onde o next vai colocar os arquivos js para funcionar a aplicacao */}
                </body>
            </Html>
        )
    }
}