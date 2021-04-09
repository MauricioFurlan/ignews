import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    const userRef = await fauna.query(
        q.Select( // filtra o campo que vc deseja buscar , evitar que venha todos os dados e reduz a cobranca do faunadb
            'ref', // estamos buscando apenas o ref neste exemplo.
            q.Get( // me da (select) 
            q.Match( // o valor que seja 
                q.Index('user_by_stripe_customer_id'), // este  index do faundadb
                customerId // com este
            )
        )
        )
    ) // busca um dado no banco de dados

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)       // buscando todos os dados do subscritionId , todos os dados que os tripe retorna 
    const subscriptionData = { // filtrando os dados importantes do stripe para salvar no nosso banco de dados
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
    }

    if (createAction) {
        await fauna.query(     // salvando no banco de dados
            q.Create(
                q.Collection('subscriptions'),
                {data: subscriptionData} 
            )
        )
    } else {
        console.log('entrei no update')
        console.log('entrei no dauptede')
        await fauna.query(
            q.Replace( // replace atualiza todos os campos 
                q.Select(
                    "ref", // busca apenas a ref
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data: subscriptionData} // dados que deseja atualizar
            )
        )
    }
}