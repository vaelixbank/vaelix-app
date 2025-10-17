import BottomNav from '../components/ui/bottom-nav';
import TopHeader from '../components/ui/top-header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <TopHeader />

      {/* Main Content */}
      <main className="pb-20">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}