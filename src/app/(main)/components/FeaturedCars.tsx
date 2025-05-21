import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FeaturedCars() {
  const cars = [
    {
      id: 1,
      model: 'Toyota Camry XSE',
      details: 'Petrol, Automatic, 20 Miles',
      price: '$40,000',
      image: 'https://placehold.co/400x300',
    },
    {
      id: 2,
      model: 'Honda Accord',
      details: 'Petrol, CVT, 15 Miles',
      price: '$35,000',
      image: 'https://placehold.co/400x300',
    },
    {
      id: 3,
      model: 'BMW 3 Series',
      details: 'Petrol, Automatic, 10 Miles',
      price: '$45,000',
      image: 'https://placehold.co/400x300',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <CardHeader>
                <img src={car.image} alt={car.model} className="w-full h-48 object-cover" />
                <CardTitle className="mt-4">{car.model}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{car.details}</p>
                <p className="text-xl font-bold mt-2">{car.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 