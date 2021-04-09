import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss';

interface PostProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function Post({ post }: PostProps) {       // TODA PÁGINA DEVE SER DEFAUTLT
    return (
        <>
        <Head>
            <title>{post.title} | Ignews </title>
        </Head>
        <main  className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                {/* dangerouslySetInnerHTML usado para interpretar as tags html */}
                <div className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: post.content }}
                ></div> 
            </article>
        </main>
        </>
    )
}   

// carregar o conteudo do post, usa getServerSideProps por ser um conteudo o cliente deve estar logado e com a conta ativa
// se usar a getStaticProps toda pagina statica fica publica
export const getServerSideProps: GetServerSideProps = async ({ req, params }) => { // REQ dentro dela vc pega se o usuario esta logado do auth, PARAMS 
    const session = await getSession({ req });
    const {slug} = params;
    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
            
        }
    }
    const prismic = getPrismicClient(req)
 
    // buscando conteudo do post
    const response = await prismic.getByUID('publication', String(slug), {}) // o String(slug) pode ser lista ou string, é passado String para reforçar que sera uma string

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    return {
        props: {
            post,
        }
    }
}