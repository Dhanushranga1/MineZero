import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 p-4 text-white">
            <h1>Coal Mine Carbon Footprint Tracker</h1>
          </header>
          <main className="flex-grow p-6">{children}</main>
          <footer className="bg-blue-600 p-4 text-white text-center">
            © 2024 Coal Mine Carbon Footprint
          </footer>
        </div>
      </body>
    </html>
  );
}
