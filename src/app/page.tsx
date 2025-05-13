"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Auto UI
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="#vehicles" className="text-foreground/60 hover:text-foreground">
                Vehicles
              </Link>
              <Link href="#brands" className="text-foreground/60 hover:text-foreground">
                Brands
              </Link>
              <Link href="#about" className="text-foreground/60 hover:text-foreground">
                About
              </Link>
              <Link href="#contact" className="text-foreground/60 hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/vehicles">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Perfect Vehicle
          </h1>
          <p className="text-xl text-foreground/60 mb-8 max-w-2xl mx-auto">
            Explore our extensive collection of premium vehicles and find the perfect match for your needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#vehicles">
              <Button size="lg">Browse Vehicles</Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section id="vehicles" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vehicle cards will be added here */}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Premium Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand logos will be added here */}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Features will be added here */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            {/* Contact form will be added here */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Auto UI</h3>
              <p className="text-foreground/60">
                Your trusted partner in finding the perfect vehicle.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#vehicles" className="text-foreground/60 hover:text-foreground">
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="#brands" className="text-foreground/60 hover:text-foreground">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-foreground/60 hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-foreground/60 hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
              </div>
            <div>
              <h3 className="font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-foreground/60">
                <li>Email: info@autoui.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Auto Street, City</li>
              </ul>
              </div>
            <div>
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Social media links will be added here */}
              </div>
            </div>
              </div>
          <div className="mt-8 pt-8 border-t text-center text-foreground/60">
            <p>&copy; 2024 Auto UI. All rights reserved.</p>
              </div>
        </div>
      </footer>
    </div>
  );
}
