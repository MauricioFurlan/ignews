import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router'; // usado para redirecionar o usuário de forma programática ou seja , redireciona ele mesmo qnd ele nao interage com nada
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {
    const [session] = useSession();
    const router = useRouter();
    async function handleSubscribe() {
        if(!session) {
            signIn('github');
            return
        }
        if(session.activeSubscription) {
            router.push('/posts') // redireciona o usuario caso ele ja tenha se inscrito.
            return
        }
        try { 
               const response = await api.post('/subscribe')
               const { sessionId } = response.data;
               const stripe = await getStripeJs()
               await stripe.redirectToCheckout({sessionId})
        } catch (error) {
            console.log('??????????????????????????????????????????????????????????????????')
            console.log(error.message);
        }
    }
    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}