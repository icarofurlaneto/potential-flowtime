

export function Footer() {
  return (
    <footer className="w-full bg-white py-12 text-gray-400 text-sm text-center px-4 border-t border-gray-100">
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="font-medium text-gray-500 italic">
          "Dar de si, em cada ação, conceito de grande homem e de inteligência extraordinária"
        </p>
        <p className="text-xs uppercase tracking-widest opacity-60">
          &copy; {new Date().getFullYear()} FlowTime. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
