import { GetStaticPaths, GetStaticProps } from "next"
import { getSession, session, useSession } from "next-auth/client"
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function PostPreview({ post }: PostPreviewProps) {       // TODA PÁGINA DEVE SER DEFAUTLT
    // como é uma página statica para validar se o uruário esta logado , deve ser feito por aqui
    const [session] = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session]) // faz redirecionar qnd logar
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
                {/* classe para fazer o texto ir desaparecendo */}
                <div className={`${styles.postContent} ${styles.previewContent}`}
                dangerouslySetInnerHTML={{ __html: post.content }}
                ></div> 
                <div className={styles.continueReading}>
                    Wanna continue reading?
                    <Link href="/">
                        <a href=""> Subscribe now 😉</a>
                    </Link>
                </div>
            </article>
        </main>
        </>
    )
}
// getStaticPaths só existe em paginas com parametros dinamicos ex:[slug].tsx
export const getStaticPaths: GetStaticPaths = async () => { // permite carregar conforme a demanda ou pre carregar a pagina, quando desejar ja deixar algumas paginas ja carregadas , deve passar o slug
    return { // paths vazio faz com que toda a pagina seja já carregada sob demanda
        paths: [{
            params: { slug: 'evento-de-bonus-do-pokemon-go-tour-kanto'} // yarn build vc observa a bolinha branca SSG pagina statica (pagina com slug passado no params)
        }],
        fallback: 'blocking' // quando nao for carregado o conteudo , a configuracao blocking faz ele ir carregar o conteudo pelo lado do serveless (neste caso getStaticProps)
    }
}

// pagina publica entao é getStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {  // no getStaticProps não existe REQ
    
    const {slug} = params;

    const prismic = getPrismicClient()
 
    // buscando conteudo do post
    const response = await prismic.getByUID('publication', String(slug), {}) // o String(slug) pode ser lista ou string, é passado String para reforçar que sera uma string

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 2)), // faz buscar os 3 primeiros paragrafos do texto
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    return {
        props: {
            post,
        },
        revalidate: 60 * 30. // 30 minutos
    }
}