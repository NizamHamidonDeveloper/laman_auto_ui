import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoanApplicationForm() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Easy Loan Application</h2>
        <form className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Enter your full name" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" />
          </div>
          <div>
            <Label htmlFor="loanAmount">Desired Loan Amount</Label>
            <Input id="loanAmount" type="number" placeholder="Enter loan amount" />
          </div>
          <Button type="submit" className="w-full">Submit Application</Button>
        </form>
      </div>
    </section>
  );
} 