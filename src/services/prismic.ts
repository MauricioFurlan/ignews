import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown) { // req?: parametro não obrigado e o tipo unknow é desconhecido
    const prismic = Prismic.client(
        process.env.PRISMIC_ENDPOINT,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )
    return prismic;
}