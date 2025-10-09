import Sidebar from '../../components/ui/sidebar';
import BottomNav from '../../components/ui/bottom-nav';
import MobileHeader from '../../components/ui/mobile-header';
import DesktopHeader from '../../components/ui/desktop-header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <MobileHeader />
      <DesktopHeader />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 md:ml-64 pb-16 md:pb-0">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}