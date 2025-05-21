import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Sign Up Page</h1>
        <form className="space-y-4">
          <div>
            <Input placeholder="Full Name" />
          </div>
          <div>
            <Input type="email" placeholder="Email Address" />
          </div>
          <div>
            <Input type="password" placeholder="Password" />
          </div>
          <div>
            <Input type="password" placeholder="Confirm Password" />
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </div>
    </div>
  );
} 