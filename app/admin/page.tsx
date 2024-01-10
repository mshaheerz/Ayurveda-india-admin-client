import MainDash from '@/components/Dashboard/MainDash';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "AyurvedaIndia admin",
  description: "Dashboard page",
  // other metadata
};



export default function Home() {

  return (
    <>
      <MainDash />
    </>
  )
}
