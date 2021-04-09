import { query as q } from 'faunadb';
import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        }),
    ],

    callbacks: {
        async session(session) { // permite adicionar mais valores ao session e modifica-lo para poder saber se o usuário pagou ou nao a aplicação
            try {
            const userActiveSubscription = await fauna.query(
                q.Get(
                  q.Intersection([ // intersection é para poder dar match com 2 argumentos &&
                        q.Match(
                        q.Index('subscription_by_user_ref'),
                        q.Select(
                            'ref',
                            q.Get(
                                q.Match(
                                    q.Index('users_by_email'),
                                    q.Casefold(session.user.email)
                                )
                            )
                        )
                    ),
                    q.Match(
                        q.Index('subscription_by_status'),
                        'active'
                    )
                  ])
                )
            )
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                    }
            } catch {
                 return {
                ...session,
                activeSubscription: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user  
            try { // try catcg tem a funcao aqui de evitar que o usuario consiga logar caso o banco de dados der erro
                await fauna.query( // sintax FQL q
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('users_by_email'), q.Casefold(user.email)
                                )
                            )
                        ),
                        q.Create(
                        q.Collection('users'), // Collection('users') usuers é o usuario criado la no site do faunadb em colettions
                        { data: { email }}
                        ),
                        q.Get(
                            q.Match(
                                q.Index('users_by_email'), q.Casefold(user.email)
                            )
                        )
                    )
                )
                return true
            } catch (error) {
                console.log('algo deu errado', error);
                return false
            }
        }
    }
})