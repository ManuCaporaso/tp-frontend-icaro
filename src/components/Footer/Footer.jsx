import React from 'react';
import './Footer.css';
import { FaInstagramSquare, FaTwitterSquare, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer>
      <div className="footer-social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagramSquare />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitterSquare />
        </a>
        <a href="mailto:example@example.com">
          <FaEnvelope />
        </a>
      </div>
      <div className="footer-nav">
        <a href="#about">Sobre Nosotros</a>
        <a href="#contact">Contáctanos</a>
        <a href="#privacy">Política de Privacidad</a>
      </div>
      <p className="footer-disclaimer">
        Lorem Ipsum Disclaimer: By accessing and using this website, you hereby acknowledge that all Lorem Ipsum content,
        including but not limited to, dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
    </footer>
  );
}

export default Footer;
