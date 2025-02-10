import { redirect } from 'next/navigation';

export default function Home() {
  // Perform the redirect
  redirect('/tnslpvfpp/splash_screen');

  // The component can return null or a placeholder since it will be redirected
  return null;
}
