import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 md:pl-64 transition-all duration-300">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 flex items-center justify-center font-bold text-lg rounded text-white">
            F
          </div>
          <span className="text-xl font-serif font-bold text-neutral-900">Le Focus</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
