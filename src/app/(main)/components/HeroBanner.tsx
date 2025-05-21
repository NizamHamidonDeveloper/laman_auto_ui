import { Button } from '@/components/ui/button';

export default function HeroBanner() {
  return (
    <section className="relative h-[400px] md:h-[500px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://placehold.co/1920x600)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Car, Hassle-Free</h1>
        <p className="mb-6 text-lg md:text-xl">Shop Online. Pickup Today. It's Fast, Simple and Easy.</p>
        <Button className="text-lg px-8 py-3">Browse Inventory</Button>
      </div>
    </section>
  );
} 