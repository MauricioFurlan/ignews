import { GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import {stripe} from '../services/stripe';

interface HomeProps {
  product: {
    productId: string,
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          {/* React esta em uma tag span pois terá uma cor diferente */}
          <h1> News about the <span>React</span> world </h1> 
          <p>
            get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
            <SubscribeButton priceId={product.productId}/>
        </section>

        <img src="/images/avatar.svg" alt=""/>
      </main>
    </>
  )
}

// IMPORTANTE
// pode-se fazer api no clint-side (dentro do home) se nao tiver necessidade de indexar por motor de busca eh melhor chamar pelo cliente
// getServerSideProps = realiza todo o fluxo da requisitcao a cada usuario, indicado qnd é para contudos dinamicos - bom para motores de busca
// getStaticProps = salva um conteudo statico e é validado atraves do validate, indicado para paginas que podem ser statics (igual para todo mundo) - bom para motores de busca
export const getStaticProps: GetStaticProps = async () => {
const prince = await stripe.prices.retrieve('price_1Ia8MDBbOKIyE42EjW63XPM5',{
  expand: ['product']
})

const product = {
  priceId: prince.id,
  amount: new Intl.NumberFormat('en-US', {
    style:'currency',
    currency: 'USD'
  }).format(prince.unit_amount / 100),
}
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}