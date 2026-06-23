import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500">
      Footer © {new Date().getFullYear()}
    </footer>
  );
}

export default Footer;
