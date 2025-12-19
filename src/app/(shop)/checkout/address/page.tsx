
import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';


export default async function AddressPage() {

  const countries = await getCountries();

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return (<h3 className='text-5xl'>No hay sesión de usuario</h3>);
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined;

  return (
    <div className="address-page">



      <div className="address-page__inner">

        <Title title="Dirección" subtitle="Dirección de facturación" />
        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}