
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import styles from './styles.module.scss';
import { RichText } from 'prismic-dom'; // LIB que serve para poder parsear mais facil, conversor do formato do prismic para  texto ou html
import Link from 'next/link'
type Post = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
};

interface PostsProps {  // o map retorna uma lista entao o tipo dele é uma lista por isso serapa em interface e type
    posts: Post[]
};

export default function Posts({ posts }: PostsProps) {
    return (
        <>
        <Head>
            <title>Posts | Ignews</title>
        </Head>
        <main className={styles.container}>
            <div className={styles.posts}>
                { posts.map(post => (   // usar parenteses ja exibe na tela de uma vez , por este motivo nao usa chaves
                <Link  href={`/posts/${post.slug}`}>
                <a key={post.slug}>
                    <time> {post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                </a>
                </Link>

                ))}
            </div>
        </main>
        </>
    )
}
export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()
    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'publication') // busca todos os posts la do site do prismic
    ], {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100, //sempre existe um limite (paginação)
    }) // segundo parametro é o que vc deseja do conteudo
    // console.log(JSON.stringify(response, null, 2)) // forma de logar quando tiver lista ou objetos dentro de um dicionario MUITO LEGAL! 
    const posts = response.results.map(post => {
        console.log('post', post.slugs)
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '', // feito dessa maneira pois pode haver imagens e a gente só quer os textos o trecho ?.text ?? '' deve ser lido como 'se for encontrado o texto se nao uma string vazia' 
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
        }
    })
    return { 
        props: {
            posts
        }
    }
}